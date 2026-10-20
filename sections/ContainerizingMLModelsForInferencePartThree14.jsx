import React from 'react';
import ChapterDeck from '../components/ChapterDeck';
import CodeBlock from '../components/CodeBlock';
import {
  VisualBuild,
  VisualCompare,
  VisualCurlHealth,
  VisualDeps,
  VisualExit,
  VisualHcDockerfile,
  VisualLayers,
  VisualModelHealth,
  VisualPrefix,
  VisualProbe,
  VisualPs,
  VisualRoutes,
  VisualRun,
  VisualTest,
  VisualTiming,
  VisualTree,
} from '../components/ContainerizingMLModelsForInferencePartThreeVisualizers';

const C = ({ children }) => <span className="font-mono text-[13px] text-teal-200">{children}</span>;
const R = ({ children }) => <span className="font-mono text-[13px] text-rose-300">{children}</span>;

export const meta = {
  title: 'Containerizing ML Models for Inference (Part 3)',
  subtitle: 'Health checks, then a Flask API in a container',
};

const slides = [
  {
    id: 'health-why',
    title: 'Health Checks for Inference Containers',
    subtitle: 'The container can be up while the model is not',
    Visual: VisualProbe,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>An inference container, even when running and with its API ports exposed, can harbor issues where the application <em>inside</em> it is not functioning correctly. The application within the container could have crashed, become unresponsive, or failed to load the model properly. For these scenarios, health checks become essential.</p>
        <p>Health checks provide a way for Docker (and container orchestrators like Kubernetes) to periodically verify that your application is not just running, but is actually healthy and capable of serving requests. If a container fails its health check, Docker can report its status as <R>unhealthy</R>, allowing monitoring systems or orchestrators to take corrective action, such as restarting the container.</p>
      </div>
    ),
  },
  {
    id: 'health-syntax',
    title: 'The HEALTHCHECK Dockerfile Instruction',
    subtitle: 'Exit 0 is healthy. Exit 1 is not.',
    Visual: VisualExit,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">The HEALTHCHECK Dockerfile Instruction</h3>
        <p>Docker provides the <R>HEALTHCHECK</R> instruction in the Dockerfile to define how a container&apos;s health should be assessed. Its basic syntax is:</p>
        <CodeBlock>HEALTHCHECK [OPTIONS] CMD command</CodeBlock>
        <p>Or, to disable any health check inherited from a base image:</p>
        <CodeBlock>HEALTHCHECK NONE</CodeBlock>
        <p>The <R>CMD command</R> is executed inside the container. Docker interprets the exit status of this command:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><R>0</R>: Success – the container is healthy.</li>
          <li><R>1</R>: Unhealthy – the container is not working correctly.</li>
          <li><R>2</R>: Reserved – do not use this exit code.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'http-check',
    title: 'Simple HTTP Check',
    subtitle: 'curl --fail, and || exit 1 if curl itself fails',
    Visual: VisualCurlHealth,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Implementing Health Checks for Inference APIs</h3>
        <p>For a typical inference API built with Flask or FastAPI, a common strategy is to expose a simple endpoint, like <R>/health</R> or <R>/ping</R>, specifically for health checks. The <R>HEALTHCHECK</R> command can then query this endpoint.</p>
        <h3 className="text-base font-semibold text-white">Simple HTTP Check</h3>
        <p>You can use tools available within the container, like <R>curl</R> or <R>wget</R>, to check if the API endpoint responds successfully (HTTP status 2xx or 3xx).</p>
        <CodeBlock>{`# Example using curl (ensure curl is installed in the image)
# Assumes the API runs on port 8000
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl --fail http://localhost:8000/health || exit 1`}</CodeBlock>
        <p>In this example:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><C>curl --fail http://localhost:8000/health</C> attempts to fetch the <R>/health</R> endpoint.</li>
          <li><R>--fail</R> tells <R>curl</R> to return an error exit code (non-zero) on server errors (HTTP 4xx or 5xx), which signals failure.</li>
          <li><R>|| exit 1</R> ensures that if <R>curl</R> itself fails (e.g., cannot connect), the command still exits with <R>1</R> (unhealthy).</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'app-health',
    title: 'Application-Level Health Endpoint',
    subtitle: '/health only succeeds when the model loaded',
    Visual: VisualModelHealth,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Application-Level Health Endpoint</h3>
        <p>Relying solely on a successful HTTP response might not be enough. The web server could be running, but perhaps the ML model failed to load, or a required resource is unavailable. A better approach is to implement logic within your <R>/health</R> endpoint to perform internal checks.</p>
        <p>Here&apos;s a minimal example using FastAPI:</p>
        <CodeBlock>{`# main.py (FastAPI example)
from fastapi import FastAPI, HTTPException
import os

app = FastAPI()

# Placeholder: Simulate loading a model
model_loaded = os.path.exists("./model.pkl")

@app.get("/health")
def health_check():
    # Add more checks here: database connection, model status, etc.
    if not model_loaded:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return {"status": "ok"}

@app.post("/predict")
def predict(data: dict):
    # Prediction logic...
    if not model_loaded:
        raise HTTPException(status_code=500, detail="Prediction service unavailable")
    # ... actual prediction ...
    return {"prediction": "some_result"}

# Add other endpoints as needed`}</CodeBlock>
        <p>Now, the <R>HEALTHCHECK</R> command querying <R>/health</R> will only succeed if the endpoint returns a 200 OK status, which in this case, requires <R>model_loaded</R> to be true.</p>
      </div>
    ),
  },
  {
    id: 'timing',
    title: 'Configuring Health Check Timing',
    subtitle: 'Interval, timeout, start period, and retries',
    Visual: VisualTiming,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Configuring Health Check Timing</h3>
        <p>The <R>HEALTHCHECK</R> instruction allows several options to control its behavior:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><R>--interval=DURATION</R> (default: 30s): Specifies the time to wait between running health checks.</li>
          <li><R>--timeout=DURATION</R> (default: 30s): Sets the maximum time allowed for the health check command to complete before it fails.</li>
          <li><R>--start-period=DURATION</R> (default: 0s): Provides a grace period for the container to initialize before the first health check failure counts towards the maximum number of retries. This is useful for applications that take some time to start up.</li>
          <li><R>--retries=N</R> (default: 3): Defines the number of consecutive health check failures required to mark the container as <R>unhealthy</R>.</li>
        </ul>
        <p>Choosing appropriate values depends on your application. A simple API might use shorter intervals and timeouts, while a service loading a large model might need a longer <R>start-period</R>.</p>
      </div>
    ),
  },
  {
    id: 'dockerfile-hc',
    title: 'Example Dockerfile with Health Check',
    subtitle: 'curl is installed, then it probes /health',
    Visual: VisualHcDockerfile,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Example Dockerfile with Health Check</h3>
        <p>Let&apos;s integrate a health check into a Dockerfile for a FastAPI inference service:</p>
        <CodeBlock>{`# Use an appropriate Python base image
FROM python:3.9-slim

WORKDIR /app

# Install dependencies (ensure curl is included if using it for health check)
RUN apt-get update && apt-get install -y curl --no-install-recommends && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code and model
COPY ./app /app
COPY ./model.pkl /app/model.pkl # Example model file

# Expose the port the API runs on
EXPOSE 8000

# Define the health check
# Check every 10 seconds after an initial 5-second grace period
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl --fail http://localhost:8000/health || exit 1

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`}</CodeBlock>
      </div>
    ),
  },
  {
    id: 'ps-inspect',
    title: 'Checking Container Health Status',
    subtitle: 'docker ps shows the state. inspect shows the last probe.',
    Visual: VisualPs,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Checking Container Health Status</h3>
        <p>After building an image with a <R>HEALTHCHECK</R> instruction and running a container from it, you can monitor its health status.</p>
        <p>The <C>docker ps</C> command will show the status, including the health state (e.g., <R>(healthy)</R>, <R>(unhealthy)</R>, <R>(starting)</R>) after a short delay.</p>
        <CodeBlock>{`$ docker ps
CONTAINER ID   IMAGE                     COMMAND                  CREATED          STATUS                     PORTS                    NAMES
a1b2c3d4e5f6   my-inference-api:latest   "uvicorn main:app --h…"  15 seconds ago   Up 14 seconds (healthy)    0.0.0.0:8000->8000/tcp   upbeat_raman`}</CodeBlock>
        <p>For more detailed information, including the output of the last health check, use <C>docker inspect</C>:</p>
        <CodeBlock>{`$ docker inspect --format='{{json .State.Health}}' a1b2c3d4e5f6
{
    "Status": "healthy",
    "FailingStreak": 0,
    "Log": [
        {
            "Start": "2023-10-27T10:30:00.123Z",
            "End": "2023-10-27T10:30:00.456Z",
            "ExitCode": 0,
            "Output": "{\\"status\\":\\"ok\\"}\\n"
        }
        # ... more log entries
    ]
}`}</CodeBlock>
        <p>By implementing health checks, you create more resilient containerized inference services. They provide a clear signal about the application&apos;s operational status, enabling automated systems to manage container lifecycles effectively and ensuring your ML models are consistently available to serve predictions.</p>
      </div>
    ),
  },
  {
    id: 'hands-intro',
    title: 'Hands-on practical: Containerize a Simple Inference API',
    subtitle: 'model.pkl, Flask, and a Dockerfile',
    Visual: VisualTree,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Building and containerizing a simple machine learning inference API, we&apos;ll take a pre-trained model, wrap it in a lightweight web application using Flask, and then create a Dockerfile to package everything into an efficient, runnable container.</p>
        <h3 className="text-base font-semibold text-white">Prerequisites:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>A pre-trained machine learning model saved to a file. For this example, we&apos;ll assume you have a scikit-learn model saved as <R>model.pkl</R>. You can train a simple model (e.g., Logistic Regression on the Iris dataset) and save it using <R>joblib</R> or <R>pickle</R>.</li>
          <li>Basic familiarity with Python and Flask.</li>
          <li>Docker installed and running on your system.</li>
        </ul>
        <h3 className="text-base font-semibold text-white">Project Structure:</h3>
        <p>Organize your project files as follows:</p>
        <CodeBlock>{`.
├── app.py                 # Flask application code
├── model.pkl              # Your pre-trained model file
├── requirements.txt       # Python dependencies
└── Dockerfile             # Instructions to build the Docker image`}</CodeBlock>
      </div>
    ),
  },
  {
    id: 'app-py',
    title: '1. Create the Inference API (app.py)',
    subtitle: 'POST /predict and GET /health',
    Visual: VisualRoutes,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">1. Create the Inference API (<R>app.py</R>)</h3>
        <p>This Python script will use Flask to create a web server. It loads our pre-trained model and exposes an endpoint (e.g., <R>/predict</R>) that accepts data, uses the model to make predictions, and returns the results.</p>
        <CodeBlock>{`# app.py
import joblib
import numpy as np
from flask import Flask, request, jsonify
import os

# Initialize Flask app
app = Flask(__name__)

# Load the pre-trained model
# Ensure model.pkl is in the same directory or provide the correct path
model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
try:
    model = joblib.load(model_path)
    print("Model loaded successfully.")
except FileNotFoundError:
    print(f"Error: Model file not found at {model_path}")
    model = None
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500

    try:
        # Get data from POST request
        data = request.get_json(force=True)

        # Ensure data is in the expected format (e.g., list of features)
        # Adapt this part based on your model's input requirements
        if 'features' not in data:
            return jsonify({'error': 'Missing "features" key in JSON payload'}), 400

        features = np.array(data['features'])

        # Perform prediction
        # Reshape if your model expects a 2D array (e.g., for a single sample)
        if features.ndim == 1:
            features = features.reshape(1, -1)

        prediction = model.predict(features)
        prediction_proba = None
        if hasattr(model, 'predict_proba'):
            # Get probabilities if the model supports it
            prediction_proba = model.predict_proba(features).tolist()

        # Return prediction as JSON response
        response = {
            'prediction': prediction.tolist(),
        }
        if prediction_proba:
            response['probabilities'] = prediction_proba

        return jsonify(response)

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': f'An error occurred during prediction: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    # Simple health check endpoint
    # You could add checks here (e.g., model loaded)
    if model is not None:
        return jsonify({'status': 'ok'}), 200
    else:
        return jsonify({'status': 'error', 'reason': 'Model not loaded'}), 500

if __name__ == '__main__':
    # Run the app using Flask's built-in server for development
    # For production, use a WSGI server like Gunicorn (configured in Dockerfile)
    app.run(host='0.0.0.0', port=5000, debug=False) # Set debug=False for production simulation`}</CodeBlock>
        <p>This script defines two routes:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><R>/predict</R>: Accepts POST requests with JSON data containing a <R>features</R> key. It uses the loaded <R>model.pkl</R> to predict and returns the result.</li>
          <li><R>/health</R>: A simple GET endpoint to check if the service is running and the model loaded.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'reqs',
    title: '2. Define Dependencies (requirements.txt)',
    subtitle: 'flask, the model stack, and gunicorn',
    Visual: VisualDeps,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">2. Define Dependencies (<R>requirements.txt</R>)</h3>
        <p>List the Python libraries needed for your API. For production, we include <R>gunicorn</R>, a WSGI server.</p>
        <CodeBlock>{`# requirements.txt
flask
scikit-learn  # Or the library used for your model (e.g., tensorflow, torch)
numpy
joblib        # Or pickle if you used that for saving the model
gunicorn      # WSGI server for production`}</CodeBlock>
      </div>
    ),
  },
  {
    id: 'basic-df',
    title: '3. Create the Dockerfile',
    subtitle: 'A basic image, then a cached pip layer',
    Visual: VisualLayers,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">3. Create the Dockerfile</h3>
        <p>This file contains the instructions Docker uses to build your image. We&apos;ll start with a basic version and then show an optimized multi-stage build.</p>
        <h3 className="text-base font-semibold text-white">Basic Dockerfile:</h3>
        <CodeBlock>{`# Dockerfile (Basic)
# 1. Base Image: Start with an official Python runtime
FROM python:3.9-slim

# 2. Set Working Directory: Define the context for subsequent instructions
WORKDIR /app

# 3. Copy Dependencies File: Copy requirements first for layer caching
COPY requirements.txt .

# 4. Install Dependencies: Install Python packages
#    --no-cache-dir: Reduces image size by not storing the pip cache
#    --upgrade pip: Ensure pip is up-to-date
RUN pip install --no-cache-dir --upgrade pip && \\
    pip install --no-cache-dir -r requirements.txt

# 5. Copy Application Code and Model: Copy the rest of your application
COPY . .

# 6. Expose Port: Inform Docker the container listens on port 5000
EXPOSE 5000

# 7. Define Run Command: Specify command to run the application using Gunicorn
#    --bind 0.0.0.0:5000: Listen on all network interfaces inside the container
#    app:app: Refers to the Flask app object named 'app' within the 'app.py' file
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]`}</CodeBlock>
        <h3 className="text-base font-semibold text-white">Explanation:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><R>FROM python:3.9-slim</R>: Uses a lightweight official Python image.</li>
          <li><R>WORKDIR /app</R>: Sets the current directory inside the container to <R>/app</R>.</li>
          <li><R>COPY requirements.txt .</R>: Copies only the requirements file first. Docker caches layers, so if <R>requirements.txt</R> doesn&apos;t change, the <R>pip install</R> layer won&apos;t need to be rebuilt, speeding up subsequent builds.</li>
          <li><C>RUN pip install…</C>: Installs the dependencies using <R>pip</R>. <R>--no-cache-dir</R> prevents pip from storing downloaded packages, saving space.</li>
          <li><R>COPY . .</R>: Copies the rest of the project files (<R>app.py</R>, <R>model.pkl</R>) into the <R>/app</R> directory in the container.</li>
          <li><R>EXPOSE 5000</R>: Documents that the application inside the container will listen on port 5000. This doesn&apos;t publish the port; it&apos;s metadata.</li>
          <li><R>CMD [&quot;gunicorn&quot;, …]</R>: Specifies the default command to run when the container starts. We use Gunicorn for a production-ready server, binding it to <R>0.0.0.0</R> so it&apos;s accessible from outside the container (when mapped) and specifying our Flask application object (<R>app</R> inside <R>app.py</R>).</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'build',
    title: '4. Build the Docker Image',
    subtitle: 'Tag ml-inference-api:basic from the current directory',
    Visual: VisualBuild,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">4. Build the Docker Image</h3>
        <p>Open your terminal in the project directory (where the <R>Dockerfile</R> is) and run the build command:</p>
        <CodeBlock>docker build -t ml-inference-api:basic .</CodeBlock>
        <ul className="list-disc pl-5 space-y-2">
          <li><C>docker build</C>: The command to build an image.</li>
          <li><R>-t ml-inference-api:basic</R>: Tags the image with a name (<R>ml-inference-api</R>) and a tag (<R>basic</R>).</li>
          <li><R>.</R>: Specifies the build context (the current directory). Docker sends files from this directory to the Docker daemon.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'run',
    title: '5. Run the Container',
    subtitle: 'Detach it, name it, and map 5001 to 5000',
    Visual: VisualRun,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">5. Run the Container</h3>
        <p>Now, run a container from the image you just built:</p>
        <CodeBlock>docker run -d -p 5001:5000 --name my_api ml-inference-api:basic</CodeBlock>
        <ul className="list-disc pl-5 space-y-2">
          <li><C>docker run</C>: The command to create and start a container.</li>
          <li><R>-d</R>: Runs the container in detached mode (in the background).</li>
          <li><R>-p 5001:5000</R>: Maps port 5001 on your host machine to port 5000 inside the container. This allows you to access the API via <R>localhost:5001</R>.</li>
          <li><R>--name my_api</R>: Assigns a name to the running container for easier management.</li>
          <li><R>ml-inference-api:basic</R>: The image to run.</li>
        </ul>
        <p>You can check if the container is running using <C>docker ps</C>.</p>
      </div>
    ),
  },
  {
    id: 'test',
    title: '6. Test the API',
    subtitle: 'Predict on four Iris features, then check /health',
    Visual: VisualTest,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">6. Test the API</h3>
        <p>You can test the running API using <R>curl</R> or a simple Python script. Assuming your model expects 4 features:</p>
        <p>Using <R>curl</R> from your terminal:</p>
        <CodeBlock>{`curl -X POST http://localhost:5001/predict \\
-H "Content-Type: application/json" \\
-d '{"features": [5.1, 3.5, 1.4, 0.2]}' # Example Iris features

# Expected output (will vary based on your model):
# {"prediction":[0]} or {"prediction":[0], "probabilities":[[0.98, 0.01, 0.01]]}`}</CodeBlock>
        <p>Check the health endpoint:</p>
        <CodeBlock>{`curl http://localhost:5001/health
# Expected output:
# {"status":"ok"}`}</CodeBlock>
      </div>
    ),
  },
  {
    id: 'multistage',
    title: '7. Optimizing with Multi-Stage Builds',
    subtitle: 'Install into /install, then copy that directory only',
    Visual: VisualPrefix,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">7. Optimizing with Multi-Stage Builds</h3>
        <p>The basic image includes build tools and potentially large libraries not strictly needed for <em>running</em> the inference service. A multi-stage build creates smaller, more secure production images.</p>
        <h3 className="text-base font-semibold text-white">Optimized Dockerfile (Multi-Stage):</h3>
        <CodeBlock>{`# Dockerfile (Multi-Stage)
# ---- Build Stage ----
# Use a full Python image to install dependencies, including any build-time needs
FROM python:3.9 as builder

WORKDIR /build

# Install build essentials if needed (e.g., for C extensions)
# RUN apt-get update && apt-get install -y --no-install-recommends build-essential && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install dependencies into a specific directory
RUN pip install --no-cache-dir --upgrade pip && \\
    pip install --no-cache-dir --prefix="/install" -r requirements.txt

# ---- Runtime Stage ----
# Use a minimal base image for the final runtime environment
FROM python:3.9-slim

WORKDIR /app

# Copy only the installed packages from the build stage
COPY --from=builder /install /usr/local

# Copy application code and model
COPY app.py .
COPY model.pkl .

# Expose port
EXPOSE 5000

# Define run command (same as before)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]`}</CodeBlock>
        <h3 className="text-base font-semibold text-white">Explanation of Changes:</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li><R>FROM python:3.9 as builder</R>: Defines the first stage named <R>builder</R>. This stage can use a larger image if needed for compilation.</li>
          <li><C>pip install --prefix=&quot;/install&quot;</C>: Installs packages into a specific directory (<R>/install</R>) within the <R>builder</R> stage, rather than the default system Python location.</li>
          <li><R>FROM python:3.9-slim</R>: Starts a new, clean, minimal base image for the final runtime stage.</li>
          <li><R>COPY --from=builder /install /usr/local</R>: This is the significant part. It copies <em>only</em> the contents of the <R>/install</R> directory (where our dependencies were installed) from the <R>builder</R> stage into the final image&apos;s standard library location (<R>/usr/local</R>). Build tools and caches from the <R>builder</R> stage are discarded.</li>
          <li><R>COPY app.py .</R>, <R>COPY model.pkl .</R>: Copies the necessary application files.</li>
        </ol>
      </div>
    ),
  },
  {
    id: 'compare',
    title: 'Build and Compare',
    subtitle: 'The optimized tag should be the smaller image',
    Visual: VisualCompare,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Build and Compare:</h3>
        <p>Build the optimized image:</p>
        <CodeBlock>docker build -t ml-inference-api:optimized .</CodeBlock>
        <p>Compare image sizes:</p>
        <CodeBlock>docker images ml-inference-api</CodeBlock>
        <p>You should see that <R>ml-inference-api:optimized</R> is significantly smaller than <R>ml-inference-api:basic</R>. Run it just like the basic version (adjusting port if needed):</p>
        <CodeBlock>{`# Stop and remove the previous container first if running
docker stop my_api
docker rm my_api

# Run the optimized version
docker run -d -p 5001:5000 --name my_api_optimized ml-inference-api:optimized`}</CodeBlock>
        <p>Test it again using <R>curl</R> as before.</p>
        <h3 className="text-base font-semibold text-white">Summary:</h3>
        <p>In this hands-on exercise, you successfully:</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Created a simple Flask API to serve predictions from a pre-trained model.</li>
          <li>Defined Python dependencies in <R>requirements.txt</R>.</li>
          <li>Wrote a <R>Dockerfile</R> to package the API, model, and dependencies.</li>
          <li>Built a basic Docker image containing the inference service.</li>
          <li>Implemented a multi-stage build to create a significantly smaller, optimized production image.</li>
          <li>Ran the containerized API and tested its functionality.</li>
        </ol>
        <p>You now have a practical workflow for turning a trained model into a distributable, containerized inference service, ready for further deployment steps. Remember to adapt the <R>app.py</R> logic and <R>requirements.txt</R> based on your specific model and its dependencies.</p>
      </div>
    ),
  },
];

export default function ContainerizingMLModelsForInferencePartThree() {
  return <ChapterDeck slides={slides} />;
}
