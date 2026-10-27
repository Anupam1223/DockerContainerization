import ChapterDeck from '../components/ChapterDeck';
import CodeBlock from '../components/CodeBlock';
import {
  VisualBuildArgs,
  VisualBuildContext,
  VisualBuildIntro,
  VisualBuildPath,
  VisualBuildTag,
  VisualDotEnv,
  VisualEnvFileOrder,
  VisualEnvIntro,
  VisualEnvList,
  VisualEnvMap,
  VisualEnvWire,
  VisualHostSubst,
  VisualLiteralDollar,
  VisualPrecedence,
  VisualTriggerBuild,
} from '../components/StreamliningWorkflowsWithDockerComposePartTwoVisualizers';

const C = ({ children }) => <span className="font-mono text-[13px] text-teal-200">{children}</span>;
const R = ({ children }) => <span className="font-mono text-[13px] text-rose-300">{children}</span>;

export const meta = {
  title: 'Streamlining Workflows with Docker Compose (Part 2)',
  subtitle: 'Environment variables, env files, and image builds',
};

const slides = [
  {
    id: 'env-intro',
    title: 'Environment Variables in Compose',
    subtitle: 'One place for credentials, hyperparameters, and host-specific settings',
    Visual: VisualEnvIntro,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Orchestrating multi-container applications with Docker Compose demands effective configuration. Services within a stack, such as an inference API needing database credentials or a training job requiring specific hyperparameters, often need external settings to function correctly. Manually passing these via complex <R>docker run</R> commands for each container quickly becomes impractical.</p>
        <p>Docker Compose provides a structured and convenient way to manage configuration for your services using environment variables, directly within the <R>docker-compose.yml</R> file or through external files. This approach centralizes configuration, making your multi-container ML applications easier to manage, adapt, and deploy across different environments.</p>
      </div>
    ),
  },
  {
    id: 'env-list',
    title: 'Defining Variables as a List',
    subtitle: 'Each item is a VARIABLE=value string',
    Visual: VisualEnvList,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Defining Environment Variables in <R>docker-compose.yml</R></h3>
        <p>The most direct way to set environment variables for a service is using the <R>environment</R> key within its definition in <R>docker-compose.yml</R>. You can define these variables either as a list or as a map (dictionary).</p>
        <h3 className="text-base font-semibold text-white">Using a List</h3>
        <p>This is often the preferred format as it&apos;s explicit and avoids potential type interpretation issues. Each item in the list is a string in the format <R>VARIABLE=value</R>.</p>
        <CodeBlock code={`# docker-compose.yml
version: '3.8'
services:
  training_job:
    build: ./training_app
    image: my_training_app:latest
    environment:
      - LEARNING_RATE=0.01
      - EPOCHS=50
      - MODEL_OUTPUT_DIR=/app/outputs
      - WANDB_API_KEY=\${WANDB_API_KEY_HOST} # Gets value from host environment`} />
        <p>In this example, <R>LEARNING_RATE</R>, <R>EPOCHS</R>, and <R>MODEL_OUTPUT_DIR</R> are set directly. <R>WANDB_API_KEY</R> demonstrates how you can substitute a value from the environment of the host machine running <C>docker-compose up</C>. If <R>WANDB_API_KEY_HOST</R> is set on your host, its value will be assigned to <R>WANDB_API_KEY</R> inside the container. If it&apos;s not set on the host, the variable <R>WANDB_API_KEY</R> inside the container will be empty.</p>
      </div>
    ),
  },
  {
    id: 'env-map',
    title: 'Defining Variables as a Map',
    subtitle: 'Compose turns every map value into a string',
    Visual: VisualEnvMap,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Using a Map</h3>
        <p>Alternatively, you can use a dictionary format.</p>
        <CodeBlock code={`# docker-compose.yml
version: '3.8'
services:
  inference_api:
    build: ./inference_api
    image: my_inference_api:latest
    environment:
      MODEL_PATH: /models/latest.pkl
      API_PORT: 8000
      DATABASE_URL: \${DB_CONNECTION_STRING} # Gets value from host environment
    ports:
      - "8000:8000" # Maps host port 8000 to container port 8000`} />
        <p>Here, <R>MODEL_PATH</R> and <R>API_PORT</R> are set. Note that Compose typically converts all values in the map format to strings. If your application expects a numeric type (like the port number), it will need to handle the string-to-number conversion internally. <R>DATABASE_URL</R> again shows substitution from the host environment.</p>
      </div>
    ),
  },
  {
    id: 'env-host',
    title: 'Substituting Host Environment Variables',
    subtitle: 'Empty, a default, or stop with an error',
    Visual: VisualHostSubst,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>As seen above, Compose allows you to inject variables from the host machine&apos;s environment into your container&apos;s environment. This is extremely useful for sensitive information like API keys or database passwords, or for settings that change between development, testing, and production environments.</p>
        <p>The syntax is <R>{'${HOST_VARIABLE}'}</R>. If <R>HOST_VARIABLE</R> exists on the host, its value is used. If not, the behavior depends on whether you provide a default:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><R>{'${HOST_VARIABLE}'}</R>: If not set on the host, the variable inside the container becomes an empty string.</li>
          <li><R>{'${HOST_VARIABLE:-default}'}</R>: If not set on the host, the variable inside the container gets the value <R>default</R>.</li>
          <li><R>{'${HOST_VARIABLE:?error message}'}</R>: If not set on the host, Compose will stop and display the error message.</li>
        </ul>
        <p>Example with a default value:</p>
        <CodeBlock code={`# docker-compose.yml
services:
  worker:
    image: my_worker:latest
    environment:
      - QUEUE_NAME=\${JOB_QUEUE:-default_queue}
      - LOG_LEVEL=\${LOG_LEVEL:-INFO}`} />
        <p>If <R>JOB_QUEUE</R> is not set on the host, the <R>QUEUE_NAME</R> inside the container will be <R>default_queue</R>. Similarly, <R>LOG_LEVEL</R> defaults to <R>INFO</R>.</p>
      </div>
    ),
  },
  {
    id: 'env-dotenv',
    title: 'Using .env Files for Local Development',
    subtitle: 'Compose reads .env from the project directory',
    Visual: VisualDotEnv,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Hardcoding configuration, especially secrets, directly in <R>docker-compose.yml</R> is not recommended. Checking such files into version control exposes sensitive data. A common practice for managing environment-specific variables, particularly during local development, is to use an environment file, typically named <R>.env</R>.</p>
        <p>Docker Compose automatically looks for a file named <R>.env</R> in the directory where you run the <C>docker-compose up</C> command (or in the project directory specified with the <R>--project-directory</R> flag). Variables defined in this <R>.env</R> file are automatically substituted into your <R>docker-compose.yml</R> file wherever the <R>{'${VARIABLE}'}</R> syntax is used.</p>
        <p>Example <R>.env</R> file:</p>
        <CodeBlock code={`# .env (This file should typically be added to .gitignore)
DB_USER=ml_user
DB_PASSWORD=supersecretdevpassword
DB_HOST=db # Service name defined in docker-compose.yml
DB_NAME=ml_database
API_KEY=dev-abc123xyz`} />
      </div>
    ),
  },
  {
    id: 'env-wire',
    title: 'A Compose File Filled from .env',
    subtitle: 'One DB_USER value lands in every ${DB_USER}',
    Visual: VisualEnvWire,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Example <R>docker-compose.yml</R> using <R>.env</R> variables:</p>
        <CodeBlock code={`# docker-compose.yml
version: '3.8'
services:
  api:
    build: ./api
    image: my_ml_api:latest
    environment:
      - DATABASE_USER=\${DB_USER}
      - DATABASE_PASSWORD=\${DB_PASSWORD}
      - DATABASE_HOST=\${DB_HOST}
      - DATABASE_NAME=\${DB_NAME}
      - EXTERNAL_SERVICE_KEY=\${API_KEY}
    depends_on:
      - db
    ports:
      - "5000:5000"

  db:
    image: postgres:14-alpine
    environment:
      # PostgreSQL image uses these specific env vars
      POSTGRES_USER: \${DB_USER}
      POSTGRES_PASSWORD: \${DB_PASSWORD}
      POSTGRES_DB: \${DB_NAME}
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:`} />
        <p>When you run <C>docker-compose up</C>, Compose reads the <R>.env</R> file, finds <R>DB_USER=ml_user</R>, and substitutes <R>ml_user</R> wherever <R>{'${DB_USER}'}</R> appears in the <R>docker-compose.yml</R> file. This keeps your secrets out of version control while providing necessary configuration to your services. Remember to add <R>.env</R> to your <R>.gitignore</R> file!</p>
      </div>
    ),
  },
  {
    id: 'env-file',
    title: 'Specifying Environment Files with env_file',
    subtitle: 'Later files override earlier files',
    Visual: VisualEnvFileOrder,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>While the automatic <R>.env</R> loading is convenient, sometimes you need more control, perhaps using different environment files for different situations (e.g., <R>.env.dev</R>, <R>.env.prod</R>, <R>.env.test</R>). The <R>env_file</R> directive within a service definition allows you to specify one or more custom environment files.</p>
        <CodeBlock code={`# docker-compose.yml
version: '3.8'
services:
  inference_service:
    build: ./inference
    image: my_predictor:latest
    # Loads variables from ./config/.prod.env first,
    # then ./config/.common.env, overriding duplicates
    env_file:
      - ./config/.prod.env
      - ./config/.common.env
    environment:
      # Variables defined here override those from env_file
      - LOG_LEVEL=INFO`} />
        <p>Variables loaded via <R>env_file</R> are set in the container&apos;s environment. If you list multiple files, they are read in order, and variables defined in later files override those from earlier files. Variables defined directly under the <R>environment</R> key take precedence over those loaded via <R>env_file</R>.</p>
      </div>
    ),
  },
  {
    id: 'env-precedence',
    title: 'Precedence Order',
    subtitle: 'Earlier sources override later ones',
    Visual: VisualPrecedence,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Understanding the order in which environment variables are applied is important:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Variables defined in the service&apos;s <R>environment</R> section in <R>docker-compose.yml</R>.</li>
          <li>Variables passed via the command line using <C>docker-compose run -e VARIABLE=value ...</C> (applies only to <R>run</R>).</li>
          <li>Variables defined using the <R>env_file</R> directive.</li>
          <li>Variables from the automatically loaded <R>.env</R> file (used for substitution in <R>docker-compose.yml</R>).</li>
          <li>Variables defined in the host environment (used for substitution in <R>docker-compose.yml</R>).</li>
          <li>Variables defined using the <R>ENV</R> instruction in the Dockerfile.</li>
        </ol>
        <p>Variables set later in this list are overridden by those set earlier.</p>
      </div>
    ),
  },
  {
    id: 'env-dollar',
    title: 'Passing Literal Dollar Signs',
    subtitle: '$$ in the file becomes a single $ in the container',
    Visual: VisualLiteralDollar,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>If you need an environment variable within the container to actually contain a dollar sign ($), you need to escape it using <R>$$</R> in your <R>docker-compose.yml</R> file.</p>
        <CodeBlock code={`# docker-compose.yml
services:
  my_service:
    image: some_image
    environment:
      - CONFIG_VAR=uses_a_literal_$$VAR # Becomes CONFIG_VAR=uses_a_literal_$VAR inside container`} />
        <p>By leveraging the <R>environment</R> key, host variable substitution, <R>.env</R> files, and the <R>env_file</R> directive, Docker Compose offers flexible and secure methods for configuring your multi-container ML applications. This allows you to separate configuration from your application code and Docker images, making your setup more portable and easier to manage across different development and deployment stages.</p>
      </div>
    ),
  },
  {
    id: 'build-intro',
    title: 'Building Images with Compose',
    subtitle: 'build: replaces a separate docker build',
    Visual: VisualBuildIntro,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>While Docker Compose excels at defining and running multi-container applications using pre-built images specified via the <R>image</R> directive, it also offers a direct way to build your container images as part of the application setup. This integration simplifies development workflows, especially when your application components require custom environments defined by Dockerfiles. Instead of manually building each image with <C>docker build</C> and then referencing it in <R>docker-compose.yml</R>, you can instruct Compose to handle the build process itself.</p>
        <p>The primary mechanism for this is the <R>build</R> keyword within a service definition in your <R>docker-compose.yml</R> file. It replaces or complements the <R>image</R> keyword.</p>
      </div>
    ),
  },
  {
    id: 'build-path',
    title: 'Using the build Keyword',
    subtitle: 'A directory path is the build context',
    Visual: VisualBuildPath,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>At its simplest, you can provide the <R>build</R> keyword with a string value representing the path to the directory containing the <R>Dockerfile</R>. This directory is known as the <R>build context</R>. Docker Compose will look for a file named <R>Dockerfile</R> within that directory and use it to build the image for the service.</p>
        <p>For example, a service for a custom Flask API designed for model inference:</p>
        <CodeBlock code={`# docker-compose.yml
version: '3.8' # Or a later version

services:
  inference_api:
    build: ./inference_service # Path to the directory with the Dockerfile
    ports:
      - "5001:5000" # Map host port 5001 to container port 5000
    volumes:
      - ./models:/app/models # Mount local models directory
    environment:
      - MODEL_PATH=/app/models/my_model.pkl`} />
        <p>In this example, when you run <C>docker-compose up</C>, Compose will navigate to the <R>inference_service</R> directory relative to the <R>docker-compose.yml</R> file. It will then execute a build process similar to <C>docker build ./inference_service</C> and use the resulting image to start the <R>inference_api</R> container.</p>
      </div>
    ),
  },
  {
    id: 'build-context',
    title: 'Context and a Custom Dockerfile',
    subtitle: 'context picks the folder. dockerfile picks the file.',
    Visual: VisualBuildContext,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Specifying Build Context and Dockerfile Explicitly</h3>
        <p>Sometimes, your <R>Dockerfile</R> might have a different name, or you might want to specify the build context path more explicitly, perhaps relative to a different location. For these scenarios, the <R>build</R> keyword accepts an object with <R>context</R> and <R>dockerfile</R> keys:</p>
        <CodeBlock code={`# docker-compose.yml
version: '3.8'

services:
  data_processor:
    build:
      context: ./processing # The build context directory
      dockerfile: Dockerfile.processor # Specify a custom Dockerfile name
    volumes:
      - ./data:/data
    command: python process.py /data/input /data/output`} />
        <p>Here, Compose uses the <R>./processing</R> directory as the build context but looks specifically for a file named <R>Dockerfile.processor</R> inside that directory to build the image for the <R>data_processor</R> service.</p>
      </div>
    ),
  },
  {
    id: 'build-args',
    title: 'Passing Build Arguments',
    subtitle: 'args overrides ARG while the image is built',
    Visual: VisualBuildArgs,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Dockerfiles often use <R>ARG</R> instructions to allow customization during the build process (e.g., specifying versions or enabling optional features). Docker Compose allows you to pass values for these arguments using the <R>args</R> key within the <R>build</R> object.</p>
        <p>Imagine your <R>Dockerfile</R> for a training environment accepts a Python version:</p>
        <CodeBlock code={`# Dockerfile for training
ARG PYTHON_VERSION=3.9
FROM python:\${PYTHON_VERSION}-slim

# ... rest of the Dockerfile ...`} />
        <p>You can specify the <R>PYTHON_VERSION</R> in your <R>docker-compose.yml</R>:</p>
        <CodeBlock code={`# docker-compose.yml
version: '3.8'

services:
  training_env:
    build:
      context: ./training
      dockerfile: Dockerfile.train
      args:
        PYTHON_VERSION: 3.10 # Pass this value to the Dockerfile ARG
    # ... other service configurations ...`} />
        <p>When Compose builds the <R>training_env</R> service, it will pass <R>PYTHON_VERSION=3.10</R> to the Docker build process, overriding the default value specified in the <R>Dockerfile</R>.</p>
      </div>
    ),
  },
  {
    id: 'build-tag',
    title: 'Combining build and image',
    subtitle: 'Compose builds the image, then applies the image tag',
    Visual: VisualBuildTag,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>You can specify both <R>build</R> and <R>image</R> for a service. If you do this, Compose will build the image using the instructions in the <R>build</R> section and then tag the resulting image with the name (and optionally tag) provided in the <R>image</R> keyword.</p>
        <CodeBlock code={`# docker-compose.yml
version: '3.8'

services:
  inference_api:
    build: ./inference_service
    image: my_registry/my_ml_api:1.0 # Tag the built image
    ports:
      - "5001:5000"
    # ...`} />
        <p>This is particularly useful if you intend to push the image built by Compose to a container registry later. Running <C>docker-compose build</C> or <C>docker-compose up --build</C> will create the image and tag it as <R>my_registry/my_ml_api:1.0</R>. You can then use <C>docker push my_registry/my_ml_api:1.0</C> to share it.</p>
      </div>
    ),
  },
  {
    id: 'build-trigger',
    title: 'Triggering Builds',
    subtitle: 'up --build forces a rebuild. build leaves containers stopped.',
    Visual: VisualTriggerBuild,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Docker Compose attempts to be efficient. It typically only builds an image if one doesn&apos;t already exist with the expected characteristics or if the build context (files in the specified directory) appears to have changed. However, changes deep within dependencies might not always be detected automatically.</p>
        <p>To explicitly force Compose to rebuild the images for your services, use the <R>--build</R> flag with the <R>up</R> command:</p>
        <CodeBlock code="docker-compose up --build" />
        <p>Alternatively, you can build images without starting the containers using:</p>
        <CodeBlock code="docker-compose build" />
        <p>Integrating image building directly into your <R>docker-compose.yml</R> file provides a streamlined approach for managing custom container environments. It ensures that the image build process is tightly coupled with the application&apos;s service definitions, promoting consistency and simplifying the setup for anyone working on the project. Just define the build context and optional parameters, and let Docker Compose handle the rest.</p>
      </div>
    ),
  },
];

export default function StreamliningWorkflowsWithDockerComposePartTwo() {
  return <ChapterDeck slides={slides} />;
}
