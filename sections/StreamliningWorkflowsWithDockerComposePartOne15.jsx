import React from 'react';
import ChapterDeck from '../components/ChapterDeck';
import CodeBlock from '../components/CodeBlock';
import {
  VisualBuildSource,
  VisualComposeUp,
  VisualDeclareVolumes,
  VisualDownFlag,
  VisualHostnames,
  VisualInsideOutside,
  VisualManyRuns,
  VisualMixSources,
  VisualMlVolumes,
  VisualMountVolumes,
  VisualPullImages,
  VisualRedisStack,
  VisualSameStack,
  VisualServiceDns,
  VisualVolumeSurvive,
} from '../components/StreamliningWorkflowsWithDockerComposePartOneVisualizers';

const C = ({ children }) => <span className="font-mono text-[13px] text-teal-200">{children}</span>;
const R = ({ children }) => <span className="font-mono text-[13px] text-rose-300">{children}</span>;

export const meta = {
  title: 'Streamlining Workflows with Docker Compose (Part 1)',
  subtitle: 'One file for services, networks, and volumes',
};

const slides = [
  {
    id: 'compose-manual',
    title: 'Introduction to Docker Compose',
    subtitle: 'Many docker run commands become one file',
    Visual: VisualManyRuns,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Managing interconnected services like an API, a database, or a processing worker using individual <R>docker run</R> commands quickly becomes cumbersome. You need to manually configure networks for them to communicate, manage the startup order, handle port mappings consistently, and repeat these steps every time you need to start or stop your application environment. This manual process is not only tedious but also prone to errors, especially as the number of services grows.</p>
        <p>Docker Compose offers a more structured and efficient approach. It is a tool specifically built for defining and running multi-container Docker applications. Instead of issuing multiple <R>docker run</R> commands with complex flags, you describe your entire application stack, including all its services, networks, and volumes, in a single configuration file.</p>
      </div>
    ),
  },
  {
    id: 'compose-up',
    title: 'One File, One Command',
    subtitle: 'docker-compose up creates the stack. down removes it.',
    Visual: VisualComposeUp,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>This configuration file, by convention named <R>docker-compose.yml</R>, uses the YAML (YAML Ain&apos;t Markup Language) format, which is designed to be human-readable. Within this file, you declaratively define what your application should look like. You specify which images to use for each service (like your ML inference API or a PostgreSQL database), how they should be networked together, which ports should be exposed, and how data should persist using volumes.</p>
        <p>The primary advantage of using Docker Compose is simplification. With a single command, typically <R>docker-compose up</R>, Compose reads your <R>docker-compose.yml</R> file and takes care of creating (and optionally building) the necessary images, setting up networks, creating volumes, and starting all the defined containers in the correct order and with the right configuration. Similarly, <R>docker-compose down</R> stops and removes the containers, networks, and volumes associated with your application stack.</p>
        <p>Diagram illustrating the shift from multiple <R>docker run</R> commands to a single <R>docker-compose up</R> command managing an application defined in <R>docker-compose.yml</R>.</p>
      </div>
    ),
  },
  {
    id: 'compose-local',
    title: 'Local Multi-Component ML Stacks',
    subtitle: 'The same file brings up the same stack',
    Visual: VisualSameStack,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>While Docker Compose can be used in various environments, it is particularly effective for setting up local development and testing environments for multi-component ML applications. It allows developers to quickly spin up the entire stack required for their work, ensuring consistency across different machines. In the following sections, we will examine the structure of the <R>docker-compose.yml</R> file and learn how to define services, networks, and volumes for typical Machine Learning workflows.</p>
      </div>
    ),
  },
  {
    id: 'services-name',
    title: 'Defining Services in docker-compose.yml',
    subtitle: 'The service name becomes a hostname',
    Visual: VisualHostnames,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>At the core of a Docker Compose configuration is the <R>services</R> top-level element in your <R>docker-compose.yml</R> file. This element acts as a container for defining each independent component, or &quot;service,&quot; that constitutes your application. Think of a service as the blueprint for a container within your multi-container setup. Each service will typically run in its own container, isolated yet capable of communicating with other services defined in the same file, a topic that will be covered later.</p>
        <p>Let&apos;s examine a common scenario in Machine Learning development: you might have a web application (perhaps a Flask or FastAPI API serving predictions) and a separate database service (like PostgreSQL or Redis) to store model metadata or user information. In Docker Compose, each of these would be defined as a distinct service under the <R>services</R> key.</p>
        <p>The name you give each service (e.g., <R>api</R>, <R>db</R>, <R>worker</R>) is significant. It becomes a hostname within the Docker network created by Compose, allowing services to discover and communicate with each other easily.</p>
      </div>
    ),
  },
  {
    id: 'service-image',
    title: '1. Using a Pre-built Image',
    subtitle: 'image: is the same idea as docker pull',
    Visual: VisualPullImages,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>To define a service, you start by specifying its name, followed by its configuration details. The most fundamental piece of configuration is telling Compose what container image to use for the service. There are two primary ways to do this:</p>
        <p><strong>1. Using a Pre-built Image (<R>image</R>):</strong> If your service relies on a standard, publicly available image (like the official Python image, a database image like <R>postgres</R>, or a pre-built ML framework image from Docker Hub), you use the <R>image</R> directive. You specify the image name and tag, just as you would with <C>docker pull</C> or <C>docker run</C>.</p>
        <CodeBlock>{`# docker-compose.yml
version: '3.8' # Specify Compose file version (optional but recommended)

services:
  database:
    image: postgres:14-alpine # Use the official PostgreSQL 14 Alpine image
    # ... other configuration for the database service ...

  redis_cache:
    image: redis:7-alpine # Use the official Redis 7 Alpine image
    # ... other configuration for the Redis service ...`}</CodeBlock>
      </div>
    ),
  },
  {
    id: 'service-build',
    title: '2. Building from a Dockerfile',
    subtitle: 'build: . or a context plus a Dockerfile name',
    Visual: VisualBuildSource,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p><strong>2. Building from a Dockerfile (<R>build</R>):</strong> If your service requires a custom environment, such as your specific ML application code, dependencies defined in <R>requirements.txt</R>, or particular configurations, you&apos;ll typically build an image from a Dockerfile. The <R>build</R> directive tells Compose where to find the build context (the directory containing the Dockerfile and any files needed for the build).</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>If the Dockerfile is named <R>Dockerfile</R> and located in the same directory as <R>docker-compose.yml</R>, you can simply specify the context path:</li>
        </ul>
        <CodeBlock>{`# docker-compose.yml
version: '3.8'

services:
  ml_api:
    build: . # Build the image using Dockerfile in the current directory
    # ... other configuration for the API service ...`}</CodeBlock>
        <ul className="list-disc pl-5 space-y-2">
          <li>If your project structure is more complex, or your Dockerfile has a different name, you can provide more details within the <R>build</R> directive:</li>
        </ul>
        <CodeBlock>{`# docker-compose.yml
version: '3.8'

services:
  training_job:
    build:
      context: ./training_module # Path to the directory containing Dockerfile and source code
      dockerfile: Dockerfile.train # Specify a custom Dockerfile name
    # ... other configuration for the training service ...`}</CodeBlock>
      </div>
    ),
  },
  {
    id: 'service-mix',
    title: 'Build One Service, Pull Another',
    subtitle: 'prediction_api is built. metadata_db is postgres:14-alpine.',
    Visual: VisualMixSources,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>It&apos;s common to mix these approaches in a single <R>docker-compose.yml</R> file. You might build your custom API service using <R>build</R> while pulling a standard database image using <R>image</R>.</p>
        <p>Here is a combined example:</p>
        <CodeBlock>{`# docker-compose.yml
version: '3.8'

services:
  # Service for the ML prediction API
  prediction_api:
    build: ./api # Assumes ./api/Dockerfile exists
    # Configuration like ports, volumes, env vars will be added here later

  # Service for the database
  metadata_db:
    image: postgres:14-alpine
    # Configuration like volumes, env vars for DB setup will be added here later`}</CodeBlock>
        <p>This simple structure defines two services: <R>prediction_api</R>, which will be built from the Dockerfile located in the <R>./api</R> directory, and <R>metadata_db</R>, which will use the pre-built <R>postgres:14-alpine</R> image.</p>
        <p>The <R>docker-compose.yml</R> file defines services, specifying whether to build them from a local Dockerfile (<R>prediction_api</R>) or pull a pre-existing image (<R>metadata_db</R>).</p>
        <p>While specifying the image source (<R>image</R> or <R>build</R>) is fundamental, defining a service involves much more. In the following sections, we will discuss how to configure networking between these services, manage persistent data using volumes, expose ports, set environment variables, and control the startup order and dependencies between services, all within the <R>docker-compose.yml</R> file under each service definition.</p>
      </div>
    ),
  },
  {
    id: 'net-auto',
    title: 'Networking Between Containers',
    subtitle: 'Compose makes the service name a hostname',
    Visual: VisualServiceDns,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>When you manage multiple containers individually with <R>docker run</R>, enabling communication between them requires manual steps. You might need to find container IP addresses, which can change, or use legacy linking mechanisms. This process is tedious and not ideal for defining reproducible application stacks.</p>
        <p>Docker Compose addresses this by automatically setting up networking for your application. When you launch an application using <R>docker-compose up</R>, Compose performs several networking steps behind the scenes:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Creates a Network:</strong> By default, Compose creates a dedicated bridge network for your application (often named <R>&lt;project_name&gt;_default</R>). Each project defined by a <R>docker-compose.yml</R> file gets its own isolated network.</li>
          <li><strong>Connects Services:</strong> Every service (container) defined in your <R>docker-compose.yml</R> file is attached to this default network.</li>
          <li><strong>Enables Service Discovery:</strong> Containers within the same Compose network can find and communicate with each other simply by using the service name as a hostname.</li>
        </ol>
        <p>This built-in service discovery is a significant advantage. You don&apos;t need to worry about container IP addresses. If you have a service named <R>db</R> and another named <R>api</R>, the <R>api</R> container can reach the <R>db</R> container by connecting to the hostname <R>db</R> on the appropriate port.</p>
      </div>
    ),
  },
  {
    id: 'net-redis',
    title: 'An App and a Redis Cache',
    subtitle: 'REDIS_HOST is the service name cache',
    Visual: VisualRedisStack,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Let&apos;s examine a simple example involving a Python application (<R>app</R>) that needs to connect to a Redis cache (<R>cache</R>).</p>
        <CodeBlock>{`# docker-compose.yml
version: '3.8'

services:
  app:
    build: . # Assumes a Dockerfile in the current directory
    ports:
      - "5000:5000" # Expose port 5000 externally
    environment:
      # The app can connect to Redis using 'cache' as the hostname
      REDIS_HOST: cache
    depends_on:
      - cache

  cache:
    image: redis:alpine
    # No 'ports' needed here for internal communication`}</CodeBlock>
        <p>In this example:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Compose creates a network.</li>
          <li>It builds the <R>app</R> service using a local <R>Dockerfile</R> and starts a container.</li>
          <li>It pulls the <R>redis:alpine</R> image and starts the <R>cache</R> service container.</li>
          <li>Both <R>app</R> and <R>cache</R> containers are attached to the same Compose-managed network.</li>
          <li>The <R>app</R> container can connect to the Redis service using the hostname <R>cache</R> (as specified by <R>REDIS_HOST: cache</R>). The standard Redis port is 6379, so the connection string within the application code would likely target <R>cache:6379</R>.</li>
          <li>The <R>depends_on</R> ensures the <R>cache</R> service is started before the <R>app</R> service, although it doesn&apos;t guarantee Redis is fully ready <em>within</em> the container, just that the container has started.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'net-ports',
    title: 'Internal Names and Published Ports',
    subtitle: 'cache:6379 stays inside. Host :5000 is the app.',
    Visual: VisualInsideOutside,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Diagram illustrating how the <R>app</R> service container uses the service name <R>cache</R> to connect to the <R>cache</R> service container over the automatically created Docker Compose network. External access to the <R>app</R> service occurs via the host&apos;s mapped port.</p>
        <p>It&apos;s important to distinguish between internal network communication and exposing ports externally.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Internal Communication:</strong> Services within the same Compose network can communicate directly using service names and the ports the target service listens on <em>internally</em> (e.g., Redis listens on 6379 inside its container). You do <em>not</em> need to use the <R>ports</R> directive in <R>docker-compose.yml</R> for this internal traffic.</li>
          <li><strong>External Access:</strong> The <R>ports</R> directive (e.g., <R>&quot;5000:5000&quot;</R> for the <R>app</R> service) maps a port on the host machine to a port inside a container. This is only necessary if you need to access a service <em>from outside</em> the Docker host (e.g., from your web browser or another application not managed by this Compose file). In our example, the Redis <R>cache</R> service doesn&apos;t need external access, so it has no <R>ports</R> section.</li>
        </ul>
        <p>While the default network is sufficient for most applications, Docker Compose also allows you to define and use custom networks if you need more granular control over network topology or want to connect services across different Compose files. However, for typical ML development stacks involving components like an API, a database, or a worker queue defined within a single <R>docker-compose.yml</R>, the default network provides a straightforward and effective solution for inter-service communication. This automatic networking and service discovery significantly streamline the process of defining and running multi-container applications.</p>
      </div>
    ),
  },
  {
    id: 'vol-why',
    title: 'Using Volumes with Compose',
    subtitle: 'A removed container takes its filesystem with it',
    Visual: VisualVolumeSurvive,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Containers are ephemeral by default. Any data written inside a container&apos;s filesystem is lost when the container is removed. For multi-container applications, managing persistent data like datasets, trained models, logs, or database files becomes essential. While <R>docker run</R> allows mounting volumes using the <R>-v</R> flag, Docker Compose provides a more structured and manageable way to define and attach volumes to your services.</p>
        <p>In Docker Compose, you manage volumes in two main steps:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Declare Named Volumes:</strong> You define named volumes at the top level of your <R>docker-compose.yml</R> file under the <R>volumes:</R> section. This tells Compose about the volumes your application stack requires.</li>
          <li><strong>Mount Volumes into Services:</strong> Within each service definition, you specify which declared volumes should be mounted into that container and where they should appear in the container&apos;s filesystem, again using a <R>volumes:</R> specification specific to that service.</li>
        </ol>
      </div>
    ),
  },
  {
    id: 'vol-declare',
    title: 'Defining Top-Level Volumes',
    subtitle: 'Name them once. Compose creates them on up.',
    Visual: VisualDeclareVolumes,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Defining Top-Level Volumes</h3>
        <p>Named volumes are the preferred mechanism for persisting data generated by and used by Docker containers. Docker manages the storage area on the host machine, and you only need to refer to the volume by its name.</p>
        <p>To declare a named volume, add a top-level <R>volumes:</R> section to your <R>docker-compose.yml</R>:</p>
        <CodeBlock>{`version: '3.8' # Or a later version

services:
  # ... your service definitions go here ...

volumes:
  postgres_data: # Declares a named volume called 'postgres_data'
  ml_models:     # Declares another named volume called 'ml_models'`}</CodeBlock>
        <p>In this example, we&apos;ve declared two named volumes: <R>postgres_data</R> and <R>ml_models</R>. Compose will create these volumes automatically the first time you run <C>docker-compose up</C> if they don&apos;t already exist on your Docker host. You can also specify driver options here if needed, but the default local driver is usually sufficient.</p>
      </div>
    ),
  },
  {
    id: 'vol-mount',
    title: 'Mounting Volumes in Services',
    subtitle: 'volume-name, then the path inside the container',
    Visual: VisualMountVolumes,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Mounting Volumes in Services</h3>
        <p>Once a volume is declared, you can mount it into one or more services. Under the specific service definition, use the <R>volumes:</R> key (note: this is different from the top-level key). The syntax is typically <R>volume-name:/path/in/container</R>.</p>
        <p>Let&apos;s extend the previous example. Imagine you have a PostgreSQL database service for storing experiment metadata and an inference API service that needs access to trained models.</p>
        <CodeBlock>{`version: '3.8'

services:
  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: ml_metadata
    volumes:
      - postgres_data:/var/lib/postgresql/data # Mount 'postgres_data' volume

  inference_api:
    build: ./inference_service # Assumes a Dockerfile here
    ports:
      - "8000:8000"
    volumes:
      - ml_models:/app/models # Mount 'ml_models' volume
    depends_on:
      - db

volumes:
  postgres_data:
  ml_models:`}</CodeBlock>
        <p>Here&apos;s what&apos;s happening:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>db service:</strong> We mount the <R>postgres_data</R> volume (declared at the top level) to the standard PostgreSQL data directory <R>/var/lib/postgresql/data</R> inside the container. Now, all database files created by PostgreSQL will persist in this Docker-managed volume, surviving container restarts or removals.</li>
          <li><strong>inference_api service:</strong> We mount the <R>ml_models</R> volume to <R>/app/models</R> inside the container. If a training service (perhaps run separately or defined in the same Compose file) saves models into this volume, the <R>inference_api</R> service can load them from <R>/app/models</R>.</li>
        </ul>
        <p>This setup ensures data persistence and allows data sharing between containers if needed (though in this specific example, each volume is used by one service).</p>
        <p>Diagram showing two services defined in Docker Compose, each mounting a distinct named volume managed by Docker.</p>
      </div>
    ),
  },
  {
    id: 'vol-advantages',
    title: 'Advantages of Using Volumes with Compose',
    subtitle: 'down leaves the data. down -v removes it.',
    Visual: VisualDownFlag,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Managing volumes through Docker Compose offers several benefits:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Centralized Definition:</strong> All volumes required by the application stack are defined in one place (<R>docker-compose.yml</R>), making the configuration easy to understand and manage.</li>
          <li><strong>Automatic Creation:</strong> Compose handles the creation of named volumes when the application starts (<R>docker-compose up</R>).</li>
          <li><strong>Lifecycle Management:</strong> Volumes persist even when containers are stopped and removed. To explicitly remove the volumes along with the containers and networks defined in the Compose file, you use the command <C>docker-compose down -v</C>. This simplifies cleanup.</li>
          <li><strong>Decoupling:</strong> Volumes decouple the data&apos;s lifecycle from the container&apos;s lifecycle, which is important for databases, model storage, and datasets.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'vol-usecases',
    title: 'Common ML Use Cases',
    subtitle: 'Databases, models, datasets, artifacts, and logs',
    Visual: VisualMlVolumes,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Common ML Use Cases</h3>
        <p>In ML workflows managed with Compose, volumes are frequently used for:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Databases:</strong> Persisting data for databases like PostgreSQL or MySQL used for experiment tracking, metadata storage, or feature stores.</li>
          <li><strong>Model Storage:</strong> Saving trained models from a training service to a volume, which can then be mounted read-only by an inference service.</li>
          <li><strong>Datasets:</strong> Mounting large datasets into training or processing containers. While bind mounts are sometimes used during development for easy access to local files, named volumes can be useful for datasets managed within the Docker environment, especially if they are generated by another container service (e.g., a data download/preprocessing service).</li>
          <li><strong>Shared Artifacts:</strong> Storing intermediate artifacts (like preprocessed data) generated by one service and consumed by another.</li>
          <li><strong>Logs:</strong> Persisting application logs generated by different services to a central volume for later analysis or shipping to a logging system.</li>
        </ul>
        <p>By defining and mounting volumes within your <R>docker-compose.yml</R> file, you gain a manageable way to handle persistent data for your multi-container ML applications, ensuring that important information like models, datasets, and configurations survives the lifespan of individual containers. This approach simplifies setup, enhances reproducibility, and aligns with containerization best practices.</p>
      </div>
    ),
  },
];

export default function StreamliningWorkflowsWithDockerComposePartOne() {
  return <ChapterDeck slides={slides} />;
}
