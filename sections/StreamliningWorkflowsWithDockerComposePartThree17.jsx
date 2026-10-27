import ChapterDeck from '../components/ChapterDeck';
import CodeBlock from '../components/CodeBlock';
import {
  VisualApiDbFlow,
  VisualApiDbYaml,
  VisualCachePredict,
  VisualComposeBreakdown,
  VisualCurlAndDown,
  VisualDockerfileWalk,
  VisualDownStack,
  VisualHandsOnTree,
  VisualHealthRedis,
  VisualMlflowDeps,
  VisualMlflowFlow,
  VisualStackIntro,
  VisualUpBuild,
} from '../components/StreamliningWorkflowsWithDockerComposePartThreeVisualizers';

const C = ({ children }) => <span className="font-mono text-[13px] text-teal-200">{children}</span>;
const R = ({ children }) => <span className="font-mono text-[13px] text-rose-300">{children}</span>;

export const meta = {
  title: 'Streamlining Workflows with Docker Compose (Part 3)',
  subtitle: 'API + DB, MLflow tracking, and a Flask + Redis hands-on',
};

const slides = [
  {
    id: 'stack-intro',
    title: 'Common ML Stack Examples (e.g., API + DB)',
    subtitle: 'Services, volumes, and networks in one file',
    Visual: VisualStackIntro,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Individual services, volumes, and networks are integral to Docker Compose. These elements combine to define common application stacks encountered in Machine Learning projects. A <R>docker-compose.yml</R> file allows for the declarative definition and management of such multi-component systems efficiently for local development and testing, mirroring more complex deployment setups.</p>
      </div>
    ),
  },
  {
    id: 'api-db-pattern',
    title: 'Example 1: Inference API with a Database Backend',
    subtitle: 'A custom API service plus a persistent database',
    Visual: VisualApiDbFlow,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>A frequent pattern involves deploying a trained model as an API endpoint for making predictions. Often, this API needs to interact with a database to store prediction logs, retrieve user information, or manage other application state. Docker Compose makes setting up this API-plus-database stack straightforward.</p>
        <p>For example, an application consisting of:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>API Service (<R>api</R>):</strong> A custom container running a web framework (like Flask or FastAPI) that loads a trained model and exposes prediction endpoints. It needs access to the database.</li>
          <li><strong>Database Service (<R>db</R>):</strong> A standard database container (like PostgreSQL or MySQL) where the API service can read/write data. Its data needs to persist across container restarts.</li>
        </ol>
      </div>
    ),
  },
  {
    id: 'api-db-diagram',
    title: 'User Request, API, Database, Volume',
    subtitle: 'Queries travel the Compose network. Rows land on a volume.',
    Visual: VisualApiDbFlow,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>A diagram showing a user request hitting the API service, which communicates with the Database service over a shared Docker network. The database service uses a volume for data persistence.</p>
      </div>
    ),
  },
  {
    id: 'api-db-yaml',
    title: 'A Simplified API + Database Compose File',
    subtitle: 'build the API, pull Postgres, join app-net',
    Visual: VisualApiDbYaml,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Here&apos;s a simplified <R>docker-compose.yml</R> representing this stack:</p>
        <CodeBlock>{`version: '3.8' # Specify Compose file version

services:
  api:
    build: ./api # Path to the directory containing the API's Dockerfile
    ports:
      - "5000:5000" # Map host port 5000 to container port 5000
    volumes:
      - ./api:/app # Mount local API code into the container (for development)
      - ./models:/app/models # Mount models directory
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/mydatabase
      # Other API specific config...
    depends_on:
      - db # Wait for the db service to be healthy (if healthcheck is defined)
    networks:
      - app-net

  db:
    image: postgres:14-alpine # Use an official PostgreSQL image
    volumes:
      - postgres_data:/var/lib/postgresql/data # Mount named volume for data persistence
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=mydatabase
    networks:
      - app-net
    # Optional: Add a healthcheck for depends_on
    # healthcheck:
    #   test: ["CMD-SHELL", "pg_isready -U user -d mydatabase"]
    #   interval: 10s
    #   timeout: 5s
    #   retries: 5

volumes:
  postgres_data: # Define the named volume

networks:
  app-net: # Define the custom network
    driver: bridge`}</CodeBlock>
      </div>
    ),
  },
  {
    id: 'api-db-takeaways',
    title: 'Important Takeaways from the API + DB Stack',
    subtitle: 'Build vs image, app-net, bind mounts, and depends_on',
    Visual: VisualApiDbYaml,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Important takeaways from this example:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Services:</strong> We define two services: <R>api</R> and <R>db</R>.</li>
          <li><strong>Building vs. Image:</strong> The <R>api</R> service is built from a local <R>Dockerfile</R> using <R>build: ./api</R>, while the <R>db</R> service uses a pre-built image from Docker Hub (<R>image: postgres:14-alpine</R>).</li>
          <li><strong>Networking:</strong> Both services are connected to a custom network <R>app-net</R>. This allows the <R>api</R> service to connect to the database using the hostname <R>db</R> (the service name) and the standard PostgreSQL port <R>5432</R>. The connection string <R>postgresql://user:password@db:5432/mydatabase</R> demonstrates this.</li>
          <li><strong>Volumes:</strong> A bind mount (<R>./api:/app</R>) is used for the <R>api</R> service, allowing code changes on the host to be reflected immediately in the container during development. A named volume (<R>postgres_data</R>) is used for the <R>db</R> service to ensure that the database files persist even if the <R>db</R> container is removed and recreated.</li>
          <li><strong>Environment Variables:</strong> <R>environment</R> is used to pass configuration. The <R>db</R> service uses them to initialize the database (user, password, name). The <R>api</R> service uses them to know how to connect to the database.</li>
          <li><strong>Ports:</strong> The <R>ports</R> mapping <R>- &quot;5000:5000&quot;</R> makes the API accessible from the host machine on port 5000.</li>
          <li><strong><R>depends_on</R>:</strong> This ensures that the <R>db</R> service is started before the <R>api</R> service attempts to connect, although it doesn&apos;t guarantee the database <em>inside</em> the container is fully ready without a <R>healthcheck</R>.</li>
        </ul>
        <p>Running <C>docker compose up</C> in the directory containing this file will build the API image (if needed), pull the PostgreSQL image, create the network and volume, and start both containers.</p>
      </div>
    ),
  },
  {
    id: 'mlflow-intro',
    title: 'Example 2: Training Job with MLflow Tracking',
    subtitle: 'trainer, mlflow, and an optional Postgres backend',
    Visual: VisualMlflowFlow,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Another common scenario involves running a training script within a container while logging metrics, parameters, and artifacts to an experiment tracking server like MLflow. Docker Compose can manage the training container, the MLflow tracking server, and potentially a backend database for MLflow.</p>
        <p>Components:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Training Service (<R>trainer</R>):</strong> A container that runs the ML training script. It needs to know the URI of the MLflow server.</li>
          <li><strong>MLflow Server Service (<R>mlflow</R>):</strong> Runs the MLflow tracking server UI and API.</li>
          <li><strong>Backend Store Service (<R>db</R>):</strong> (Optional but recommended for robustness) A database (e.g., PostgreSQL) used by MLflow to store experiment metadata.</li>
        </ol>
      </div>
    ),
  },
  {
    id: 'mlflow-diagram',
    title: 'Logs, Artifacts, and the Tracking UI',
    subtitle: 'The trainer talks to MLflow. MLflow talks to Postgres and a volume.',
    Visual: VisualMlflowFlow,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>A diagram showing the Training service sending logs to the MLflow Server over the network. The MLflow Server stores metadata in the Backend DB and reads/writes artifacts to a shared volume/mount. A developer accesses the MLflow UI.</p>
      </div>
    ),
  },
  {
    id: 'mlflow-yaml',
    title: 'An MLflow Compose File',
    subtitle: 'service_healthy waits for Postgres before trainer and mlflow start',
    Visual: VisualMlflowDeps,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>A possible <R>docker-compose.yml</R> could look like this:</p>
        <CodeBlock>{`version: '3.8'

services:
  trainer:
    build: ./training # Path to training script's Dockerfile context
    command: python train.py --data /data/input.csv --model-output /artifacts
    volumes:
      - ./training/src:/app # Mount training code
      - ./data:/data # Mount input data
      - mlflow_artifacts:/artifacts # Mount artifact volume
    environment:
      - MLFLOW_TRACKING_URI=http://mlflow:5001 # Tell script where MLflow server is
    depends_on:
      mlflow:
        condition: service_started # Basic dependency
      db:
        condition: service_healthy # Wait for DB (requires healthcheck)
    networks:
      - ml-net

  mlflow:
    # Use an official or well-maintained MLflow image,
    # or build your own if customization is needed.
    # This example assumes a pre-built image exists that takes these args.
    image: ghcr.io/mlflow/mlflow:v2.10.0
    command: >
      mlflow server
      --backend-store-uri postgresql://mlflow_user:mlflow_pass@db:5432/mlflow_db
      --default-artifact-root /mlflow_artifacts
      --host 0.0.0.0
      --port 5001
    ports:
      - "5001:5001" # Expose MLflow UI port
    volumes:
      - mlflow_artifacts:/mlflow_artifacts # Share artifact volume
    depends_on:
      db:
        condition: service_healthy # Wait for DB
    networks:
      - ml-net

  db:
    image: postgres:14-alpine
    volumes:
      - mlflow_db_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=mlflow_user
      - POSTGRES_PASSWORD=mlflow_pass
      - POSTGRES_DB=mlflow_db
    networks:
      - ml-net
    healthcheck: # Essential for depends_on condition: service_healthy
      test: ["CMD-SHELL", "pg_isready -U mlflow_user -d mlflow_db"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mlflow_db_data:
  mlflow_artifacts: # Volume for storing model artifacts, parameters etc.

networks:
  ml-net:
    driver: bridge`}</CodeBlock>
      </div>
    ),
  },
  {
    id: 'mlflow-takeaways',
    title: 'How the MLflow Stack Fits Together',
    subtitle: 'Tracking URI, backend-store-uri, and a shared artifact volume',
    Visual: VisualMlflowDeps,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>In this setup:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>The <R>trainer</R> service runs the training script (<R>train.py</R>). It receives the location of the MLflow server (<R>http://mlflow:5001</R>) via the <R>MLFLOW_TRACKING_URI</R> environment variable. The MLflow client library within the script uses this URI to connect.</li>
          <li>The <R>mlflow</R> service runs the tracking server. Its <R>command</R> specifies the PostgreSQL database (<R>db</R> service) as the <R>--backend-store-uri</R> and a shared volume (<R>mlflow_artifacts</R>) as the <R>--default-artifact-root</R>.</li>
          <li>The <R>db</R> service provides the PostgreSQL database for MLflow metadata persistence, using its own named volume (<R>mlflow_db_data</R>). A <R>healthcheck</R> is added so other services can reliably wait for it using <R>depends_on</R>.</li>
          <li>A shared named volume <R>mlflow_artifacts</R> is mounted by both the <R>trainer</R> (to write artifacts) and <R>mlflow</R> (to read/serve artifacts).</li>
          <li><R>depends_on</R> with <R>condition: service_healthy</R> ensures the <R>trainer</R> and <R>mlflow</R> services wait for the <R>db</R> to be ready.</li>
        </ul>
        <p>These examples illustrate how Docker Compose defines interconnected services typical in ML development. You can extend these patterns by adding services for data preprocessing, message queues (like Redis or RabbitMQ) for asynchronous tasks, monitoring tools, or different types of databases, all managed within a single <R>docker-compose.yml</R> file. This approach significantly simplifies the setup and management of your local development environment, making it closely resemble a potential production deployment structure.</p>
      </div>
    ),
  },
  {
    id: 'hands-intro',
    title: 'Hands-on practical: Develop an ML App with Compose',
    subtitle: 'A Flask inference API and a Redis cache',
    Visual: VisualHandsOnTree,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>A simple multi-container Machine Learning application is built using Docker Compose. The application consists of two services:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Inference API:</strong> A simple web service (using Flask) that loads a dummy model and serves predictions.</li>
          <li><strong>Redis Cache:</strong> A Redis instance used by the API to cache prediction results, demonstrating inter-container communication.</li>
        </ol>
        <p>&quot;This setup mirrors common scenarios where an ML service might depend on other backend components like databases or caches.&quot;</p>
      </div>
    ),
  },
  {
    id: 'project-setup',
    title: 'Project Setup',
    subtitle: 'compose_ml_app with app code, a Dockerfile, and a Compose file',
    Visual: VisualHandsOnTree,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>First, create a directory for our project, let&apos;s call it <R>compose_ml_app</R>. Inside this directory, create the following structure:</p>
        <CodeBlock>{`compose_ml_app/
├── app/
│   ├── __init__.py
│   ├── main.py
│   └── requirements.txt
├── Dockerfile
└── docker-compose.yml`}</CodeBlock>
        <ul className="list-disc pl-5 space-y-2">
          <li><R>app/</R>: This directory will contain our Flask API code.</li>
          <li><R>app/main.py</R>: The main Python script for the Flask application.</li>
          <li><R>app/requirements.txt</R>: Lists the Python dependencies for the API.</li>
          <li><R>Dockerfile</R>: Defines how to build the image for our Inference API service.</li>
          <li><R>docker-compose.yml</R>: Defines the multi-container application stack.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'flask-reqs',
    title: 'Building the Inference API',
    subtitle: 'Pin Flask and redis-py',
    Visual: VisualCachePredict,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Let&apos;s create the components for our Flask API service.</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><R>app/requirements.txt</R>: List the necessary Python libraries. For this example, we need Flask to create the API and <R>redis-py</R> to interact with the Redis cache.</li>
        </ol>
        <CodeBlock>{`Flask==2.3.3
redis==5.0.1`}</CodeBlock>
        <p><em>Note: Using specific versions enhances reproducibility.</em></p>
      </div>
    ),
  },
  {
    id: 'flask-main',
    title: 'app/main.py',
    subtitle: 'Predict, cache the result, then serve it from Redis',
    Visual: VisualCachePredict,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>2. <R>app/main.py</R>: This script sets up a basic Flask app with one endpoint <R>/predict</R>. It simulates loading a model and making a prediction. Before predicting, it checks if the result for the given input data is already in the Redis cache. If so, it returns the cached result; otherwise, it computes the result, stores it in the cache, and then returns it.</p>
        <CodeBlock>{`import os
import time
import redis
from flask import Flask, request, jsonify

app = Flask(__name__)

# Connect to Redis - use the service name 'redis' defined in docker-compose.yml
# Docker Compose automatically provides DNS resolution between services on the same network.
redis_host = os.environ.get('REDIS_HOST', 'localhost')
redis_port = int(os.environ.get('REDIS_PORT', 6379))
cache = redis.StrictRedis(host=redis_host, port=redis_port, db=0, decode_responses=True)

# Simulate loading a model (replace with actual model loading if needed)
def load_model():
    print("Simulating model loading...")
    time.sleep(2) # Simulate time taken to load
    print("Model loaded.")
    # In a real app, you'd load your scikit-learn, TensorFlow, PyTorch model here
    return "dummy_model"

model = load_model()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data or 'input' not in data:
            return jsonify({"error": "Invalid input. Expecting JSON with 'input'."}), 400

        input_data = str(data['input']) # Use input as cache key

        # Check cache first
        cached_result = cache.get(input_data)
        if cached_result:
            print(f"Cache hit for input: {input_data}")
            return jsonify({"prediction": cached_result, "source": "cache"})

        # If not in cache, simulate prediction
        print(f"Cache miss for input: {input_data}. Predicting...")
        # Replace this with your actual model.predict() call
        time.sleep(0.5) # Simulate prediction time
        prediction_result = f"prediction_for_{input_data}"

        # Store result in cache with an expiration time (e.g., 1 hour)
        cache.setex(input_data, 3600, prediction_result)
        print(f"Stored prediction in cache for input: {input_data}")

        return jsonify({"prediction": prediction_result, "source": "computation"})

    except redis.exceptions.ConnectionError as e:
        print(f"Redis connection error: {e}")
        return jsonify({"error": "Could not connect to cache service."}), 503
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "An internal error occurred."}), 500`}</CodeBlock>
      </div>
    ),
  },
  {
    id: 'flask-health',
    title: 'Health Check and REDIS_HOST',
    subtitle: 'localhost outside Docker. redis inside Compose.',
    Visual: VisualHealthRedis,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <CodeBlock>{`@app.route('/health', methods=['GET'])
def health_check():
    # Basic health check
    try:
        # Check connection to Redis cache
        cache.ping()
        return jsonify({"status": "ok", "cache_connected": True}), 200
    except redis.exceptions.ConnectionError:
        return jsonify({"status": "degraded", "cache_connected": False}), 503

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)`}</CodeBlock>
        <p>Notice how the Redis host is retrieved from the environment variable <R>REDIS_HOST</R>. We will set this in our <R>docker-compose.yml</R> file. The default is <R>localhost</R> for potential local testing outside Docker. We also added a basic <R>/health</R> endpoint.</p>
        <p>3. <R>app/__init__.py</R>: Create an empty <R>__init__.py</R> file inside the <R>app</R> directory to make it a Python package. You can do this with <C>touch app/__init__.py</C> on Linux/macOS or create an empty file named <R>__init__.py</R> in Windows.</p>
      </div>
    ),
  },
  {
    id: 'api-dockerfile',
    title: 'Creating the Dockerfile for the API',
    subtitle: 'Python 3.9-slim, pip, EXPOSE 5000, REDIS_HOST=redis',
    Visual: VisualDockerfileWalk,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Now, define the <R>Dockerfile</R> in the project root (<R>compose_ml_app/</R>) to containerize the Flask application.</p>
        <CodeBlock>{`# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY app/requirements.txt .

# Install any needed packages specified in requirements.txt
# Use --no-cache-dir to reduce image size
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code into the container at /app
COPY ./app /app

# Make port 5000 available outside this container
EXPOSE 5000

# Define environment variable defaults (can be overridden by docker-compose)
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

# Run main.py when the container launches
CMD ["python", "main.py"]`}</CodeBlock>
        <p>This Dockerfile sets up a Python 3.9 environment, installs dependencies, copies the application code, exposes the port Flask will run on, sets default environment variables for Redis connection, and specifies the command to start the application.</p>
      </div>
    ),
  },
  {
    id: 'compose-yml',
    title: 'Defining the Multi-Container Application',
    subtitle: 'api is built here. redis is pulled. Both join ml_app_network.',
    Visual: VisualComposeBreakdown,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>This is where Docker Compose comes in. Create the <R>docker-compose.yml</R> file in the project root (<R>compose_ml_app/</R>).</p>
        <CodeBlock>{`version: '3.8' # Specify compose file version

services:
  # Service 1: The Inference API
  api:
    build: . # Build the image from the Dockerfile in the current directory
    ports:
      - "5001:5000" # Map host port 5001 to container port 5000
    environment:
      - REDIS_HOST=redis # Override default, ensuring it uses the redis service name
      - REDIS_PORT=6379
    volumes:
      # Mount the local 'app' directory to '/app' in the container
      # This allows code changes without rebuilding the image during development
      - ./app:/app
    depends_on:
      - redis # Ensures redis starts before the api service
    networks:
      - ml_app_network # Attach this service to the custom network

  # Service 2: The Redis Cache
  redis:
    image: "redis:6.2-alpine" # Use a standard Redis image from Docker Hub
    ports:
      - "6379:6379" # Expose Redis port for potential direct inspection (optional)
    volumes:
      - redis_data:/data # Mount a named volume for data persistence
    networks:
      - ml_app_network # Attach this service to the custom network

# Define named volumes
volumes:
  redis_data: # Persists Redis data even if the container is removed

# Define custom network
networks:
  ml_app_network:
    driver: bridge # Use the default bridge driver`}</CodeBlock>
      </div>
    ),
  },
  {
    id: 'compose-breakdown',
    title: 'Breaking Down the Hands-on Compose File',
    subtitle: 'Host port 5001, REDIS_HOST=redis, bind mount, redis_data',
    Visual: VisualComposeBreakdown,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Let&apos;s break down this <R>docker-compose.yml</R> file:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><R>version: &apos;3.8&apos;</R>: Specifies the version of the Compose file format.</li>
          <li><R>services:</R> Defines the containers that make up our application.
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li><R>api</R>: Defines our Flask application service.
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li><R>build: .</R>: Tells Compose to build an image using the <R>Dockerfile</R> in the current directory.</li>
                  <li><R>ports: - &quot;5001:5000&quot;</R>: Maps port 5001 on the host machine to port 5000 inside the <R>api</R> container (where Flask runs). We use 5001 on the host to avoid potential conflicts with other services running on 5000.</li>
                  <li><R>environment:</R> Sets environment variables inside the <R>api</R> container. Importantly, <R>REDIS_HOST=redis</R> tells our Flask app to connect to the service named <R>redis</R>. Compose handles the DNS resolution.</li>
                  <li><R>volumes: - ./app:/app</R>: Mounts the local <R>app</R> directory into the container&apos;s <R>/app</R> directory. Changes made locally to the Python code in <R>app/</R> will be reflected immediately in the running container, which is very useful for development.</li>
                  <li><R>depends_on: - redis</R>: Specifies that the <R>api</R> service depends on the <R>redis</R> service. Compose will start <R>redis</R> first and wait for it to be running before starting <R>api</R>. <em>Note: <R>depends_on</R> only waits for the container to start, not necessarily for the application inside it to be ready.</em> More checks often involve health checks or wait scripts.</li>
                  <li><R>networks: - ml_app_network</R>: Connects the service to our defined network.</li>
                </ul>
              </li>
              <li><R>redis</R>: Defines our Redis cache service.
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li><R>image: &quot;redis:6.2-alpine&quot;</R>: Tells Compose to pull the specified Redis image from Docker Hub. The <R>alpine</R> tag indicates a smaller image variant.</li>
                  <li><R>ports: - &quot;6379:6379&quot;</R>: Optionally map the standard Redis port for direct access from the host if needed for debugging.</li>
                  <li><R>volumes: - redis_data:/data</R>: Mounts a named volume <R>redis_data</R> to the <R>/data</R> directory inside the Redis container, which is where Redis stores its data. This ensures that cached data persists even if the <R>redis</R> container is stopped and restarted.</li>
                  <li><R>networks: - ml_app_network</R>: Connects the service to our defined network.</li>
                </ul>
              </li>
            </ul>
          </li>
          <li><R>volumes:</R> Declares the named volume <R>redis_data</R>. Docker manages this volume.</li>
          <li><R>networks:</R> Declares a custom bridge network <R>ml_app_network</R>. Using custom networks is recommended practice, providing better isolation and enabling DNS resolution between service names (<R>api</R>, <R>redis</R>).</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'run-up',
    title: 'Running the Application',
    subtitle: 'docker compose up --build creates the network, volume, and both services',
    Visual: VisualUpBuild,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Navigate to your <R>compose_ml_app</R> directory in the terminal.</p>
        <p>1. <strong>Build and Start Services:</strong> Run the following command:</p>
        <CodeBlock>docker compose up --build</CodeBlock>
        <ul className="list-disc pl-5 space-y-2">
          <li><C>docker compose up</C>: This command reads the <R>docker-compose.yml</R> file, creates the network and volume (if they don&apos;t exist), builds the image for the <R>api</R> service (because of <R>build: .</R>), pulls the <R>redis</R> image, and starts both containers.</li>
          <li><R>--build</R>: Forces Docker Compose to build the image for services defined with the <R>build</R> instruction, even if an image with the same name already exists. Useful when you&apos;ve changed the <R>Dockerfile</R> or application code dependencies.</li>
        </ul>
        <p>You will see logs from both the <R>api</R> and <R>redis</R> containers interleaved in your terminal. Look for lines indicating that Redis is ready and the Flask app is running (e.g., <R>* Running on http://0.0.0.0:5000/</R>).</p>
      </div>
    ),
  },
  {
    id: 'run-curl',
    title: 'Test the API',
    subtitle: 'First POST is a cache miss. The same POST is a cache hit.',
    Visual: VisualCurlAndDown,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>2. <strong>Test the API:</strong> Open another terminal window and use <R>curl</R> (or any HTTP client) to send a POST request to the <R>/predict</R> endpoint of your API service, which is accessible on port 5001 of your host machine:</p>
        <CodeBlock>{`# First request (cache miss)
curl -X POST -H "Content-Type: application/json" \\
     -d '{"input": "some_feature_vector_1"}' \\
     http://localhost:5001/predict

# Expected output (might vary slightly):
# {"prediction":"prediction_for_some_feature_vector_1","source":"computation"}`}</CodeBlock>
        <p>Check the logs from <C>docker compose up</C>. You should see messages from the Flask app indicating a &quot;Cache miss&quot; and then storing the result.</p>
        <p>Now, send the same request again:</p>
        <CodeBlock>{`# Second request (cache hit)
curl -X POST -H "Content-Type: application/json" \\
     -d '{"input": "some_feature_vector_1"}' \\
     http://localhost:5001/predict

# Expected output:
# {"prediction":"prediction_for_some_feature_vector_1","source":"cache"}`}</CodeBlock>
        <p>This time, the response indicates the result came from the &quot;cache&quot;, and the logs should show a &quot;Cache hit&quot; message. This confirms that the <R>api</R> service successfully communicated with the <R>redis</R> service over the Docker network defined by Compose.</p>
        <p>You can also test the health check endpoint:</p>
        <CodeBlock>{`curl http://localhost:5001/health
# Expected output:
# {"cache_connected":true,"status":"ok"}`}</CodeBlock>
      </div>
    ),
  },
  {
    id: 'run-down',
    title: 'Stopping the Application',
    subtitle: 'down keeps redis_data. down --volumes removes it.',
    Visual: VisualDownStack,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>3. <strong>Stopping the Application:</strong> Go back to the terminal where <C>docker compose up</C> is running and press <R>Ctrl+C</R>. This will stop the containers.</p>
        <p>To ensure the containers and the network are removed (the named volume <R>redis_data</R> will persist by default), run:</p>
        <CodeBlock>docker compose down</CodeBlock>
        <p>If you also want to remove the named volume, use:</p>
        <CodeBlock>docker compose down --volumes</CodeBlock>
      </div>
    ),
  },
  {
    id: 'visualize-setup',
    title: 'Visualizing the Setup',
    subtitle: 'curl to api:5001, then redis:6379, then redis_data',
    Visual: VisualCurlAndDown,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>We can represent our Compose setup with a simple diagram:</p>
        <p><em>This diagram shows the client (<R>curl</R>) interacting with the <R>api</R> service via the mapped host port. The <R>api</R> service communicates with the <R>redis</R> service using the service name over the internal Docker network (<R>ml_app_network</R>). The <R>redis</R> service uses a named volume (<R>redis_data</R>) for persistence.</em></p>
        <p>This practical exercise demonstrates how Docker Compose simplifies managing interconnected services. By defining our application stack in <R>docker-compose.yml</R>, we automated the creation of networks, volumes, builds, and container startup order, making our development workflow much more efficient and reproducible compared to managing individual <R>docker run</R> commands. You can adapt this pattern for more complex ML applications involving databases, message queues, monitoring tools, or other components.</p>
      </div>
    ),
  },
];

export default function StreamliningWorkflowsWithDockerComposePartThree() {
  return <ChapterDeck slides={slides} />;
}
