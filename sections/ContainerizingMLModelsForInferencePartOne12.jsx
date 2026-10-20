import React from 'react';
import ChapterDeck from '../components/ChapterDeck';
import CodeBlock from '../components/CodeBlock';
import {
  VisualAsyncPath,
  VisualChoice,
  VisualContract,
  VisualDockerApi,
  VisualErrors,
  VisualFastFlow,
  VisualFlaskApp,
  VisualFlaskSteps,
  VisualGunicorn,
  VisualHttp,
  VisualLoadStrategy,
  VisualLogs,
  VisualShift,
  VisualStateless,
  VisualSyncPath,
  VisualUvicorn,
} from '../components/ContainerizingMLModelsForInferencePartOneVisualizers';

const C = ({ children }) => <span className="font-mono text-[13px] text-teal-200">{children}</span>;
const R = ({ children }) => <span className="font-mono text-[13px] text-rose-300">{children}</span>;

export const meta = {
  title: 'Containerizing ML Models for Inference (Part 1)',
  subtitle: 'Design the service, then Flask and FastAPI',
};

const slides = [
  {
    id: 'infer-shift',
    title: 'Designing Inference Services',
    subtitle: 'One request in, one prediction out',
    Visual: VisualShift,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Once a machine learning model is trained, the focus shifts from experimentation and discovery to operational deployment. Serving predictions requires a different approach than training. While training often involves batch processing over large datasets, inference typically involves handling individual or small batches of requests with low latency expectations. Containerizing the inference process provides a reliable and scalable way to deploy your models. Designing the inference service <em>before</em> writing the code is a significant step towards building a maintainable and effective system.</p>
      </div>
    ),
  },
  {
    id: 'infer-contract',
    title: 'Defining the Service Interface',
    subtitle: 'Path, method, JSON in, JSON out, and a status',
    Visual: VisualContract,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Defining the Service Interface</h3>
        <p>The first step in designing an inference service is defining its contract: how will clients interact with it? This involves specifying:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Endpoint:</strong> Where does the client send requests? For web services, this is typically a URL path (e.g., <R>/predict</R>).</li>
          <li><strong>Method:</strong> What HTTP method will be used? <R>POST</R> is overwhelmingly common for sending data to an inference endpoint.</li>
          <li><strong>Input Format:</strong> How should the client structure the input data? JSON is the de facto standard for web APIs due to its simplicity and broad support. Define the expected keys and data types (e.g., a dictionary mapping feature names to values). For performance-critical applications, alternatives like Protobuf or handling binary data (like images) directly via multipart/form-data may be more suitable.</li>
          <li><strong>Output Format:</strong> How will the service return predictions? Again, JSON is typical, containing the prediction(s) and potentially confidence scores or other metadata. Define the structure clearly.</li>
          <li><strong>Error Handling:</strong> How are errors communicated? Standard HTTP status codes (e.g., <R>400 Bad Request</R> for invalid input, <R>500 Internal Server Error</R> for model failures) along with a consistent JSON error message format are essential.</li>
        </ol>
        <p>A well-defined interface makes the service predictable and easier for client applications to integrate with.</p>
      </div>
    ),
  },
  {
    id: 'infer-sync',
    title: 'Synchronous vs. Asynchronous Processing',
    subtitle: 'Wait for the prediction, or take a job id',
    Visual: VisualSyncPath,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Synchronous vs. Asynchronous Processing</h3>
        <p>Here&apos;s how the service will handle requests:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Synchronous:</strong> The client sends a request and waits for the prediction to be computed and returned in the same connection. This is simpler to implement and suitable for low-latency models where predictions take milliseconds or a few seconds. Most real-time prediction APIs (e.g., fraud detection, recommendation snippets) use this pattern.</li>
          <li><strong>Asynchronous:</strong> The client sends a request, the service immediately acknowledges receipt (e.g., with a <R>202 Accepted</R> status and a job ID), and processes the prediction in the background. The client must poll an endpoint using the job ID or receive a callback (e.g., via a webhook) to get the results later. This pattern is better suited for long-running inference tasks (e.g., video analysis, large batch predictions) that would exceed typical web request timeouts.</li>
        </ul>
        <p>Your choice depends heavily on the model&apos;s inference time and the requirements of the consuming application. Containerized services can implement either pattern.</p>
      </div>
    ),
  },
  {
    id: 'infer-diagram',
    title: 'The two request paths',
    subtitle: 'A direct 200, or a queue and a later result',
    Visual: VisualAsyncPath,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Diagram comparing synchronous and asynchronous inference patterns. Synchronous provides immediate responses, while asynchronous handles longer tasks via background processing.</p>
      </div>
    ),
  },
  {
    id: 'infer-stateless',
    title: 'Statelessness and Scalability',
    subtitle: 'Any copy of the container can take the request',
    Visual: VisualStateless,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Statelessness and Scalability</h3>
        <p>For web-based inference services, statelessness is a fundamental design principle. Each incoming request should be processed independently, without relying on information stored from previous requests within the same container instance.</p>
        <p>Why is statelessness important?</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Scalability:</strong> Stateless services are easy to scale horizontally. If load increases, you simply run more identical container instances behind a load balancer. Each instance can handle any incoming request.</li>
          <li><strong>Reliability:</strong> If one container instance fails, requests can be routed to other healthy instances without loss of session information.</li>
          <li><strong>Simplicity:</strong> Managing state across multiple instances adds significant complexity (e.g., session replication, distributed locking).</li>
        </ul>
        <p>Avoid storing user-specific data or request history <em>inside</em> the container&apos;s memory or local filesystem between requests. If state <em>is</em> required (e.g., for user-specific model variations or caching complex lookups), use external services like databases, key-value stores (Redis), or dedicated state management systems.</p>
      </div>
    ),
  },
  {
    id: 'infer-load',
    title: 'Model Loading Strategy',
    subtitle: 'In memory before the first request',
    Visual: VisualLoadStrategy,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Model Loading Strategy</h3>
        <p>Decide when and how the machine learning model(s) will be loaded into memory:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Load at Startup:</strong> The model is loaded when the container starts, before it begins accepting requests. This results in slower container startup times but ensures that the first request is served quickly without incurring model loading latency. This is the most common approach for production services.</li>
          <li><strong>Lazy Load on First Request:</strong> The model is loaded only when the first request arrives. This leads to faster container startup but introduces significant latency for the very first request. This might be acceptable in development or low-traffic scenarios.</li>
          <li><strong>Dynamic Loading:</strong> Models are loaded/unloaded based on request parameters. This is more complex but can be useful if you need to serve many different models infrequently.</li>
        </ul>
        <p>Loading at startup is generally preferred for performance and predictability in production environments. Ensure your container has sufficient memory allocated to hold the model(s).</p>
      </div>
    ),
  },
  {
    id: 'infer-errors',
    title: 'Error Handling and Logging',
    subtitle: 'A clear status for each kind of failure',
    Visual: VisualErrors,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Error Handling and Logging</h3>
        <p>Error handling is essential. Your service must gracefully handle various failure modes:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Invalid Input:</strong> Malformed requests, missing data, incorrect data types. Return clear error messages and a <R>4xx</R> HTTP status code (e.g., <R>400 Bad Request</R>).</li>
          <li><strong>Model Errors:</strong> Issues during prediction (e.g., unexpected input values causing numerical instability, incompatible model version). Return a <R>5xx</R> HTTP status code (e.g., <R>500 Internal Server Error</R> or potentially <R>503 Service Unavailable</R>).</li>
          <li><strong>Resource Exhaustion:</strong> Running out of memory or CPU. This might manifest as slow responses or container crashes. Health checks (covered later) can help detect this.</li>
          <li><strong>Downstream Dependencies:</strong> Failure to connect to external databases or services needed for feature lookups.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'infer-logs',
    title: 'Where the service writes logs',
    subtitle: 'stdout and stderr stay with the container',
    Visual: VisualLogs,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Implement comprehensive logging within your service. Log important information for each request (input summary, prediction output, latency) and detailed stack traces for errors. Structure your logs (e.g., JSON format) to make them easily parseable by log aggregation systems. Standard output (<R>stdout</R>) and standard error (<R>stderr</R>) within the container are the typical destinations for logs managed by the Docker daemon or container orchestrators.</p>
        <p>Designing these aspects thoughtfully provides a solid foundation before you start building the Dockerfile and writing the API code, leading to a more reliable and maintainable containerized inference solution. The subsequent sections will cover the practical implementation of these design principles using tools like Flask/FastAPI and Dockerfile optimizations.</p>
      </div>
    ),
  },
  {
    id: 'api-why',
    title: 'Building Inference APIs (Flask/FastAPI)',
    subtitle: 'The client sends HTTP and never sees the model',
    Visual: VisualHttp,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Once your machine learning model is trained and saved, it needs an interface to receive input data and return predictions. Simply running a Python script on demand isn&apos;t practical for most deployment scenarios. Instead, we typically wrap the model loading and prediction logic within a web Application Programming Interface (API). This API acts as a standardized entry point, allowing other services or applications to request predictions over a network, usually via HTTP requests.</p>
        <p>For Python-based ML models, two popular microframeworks for building these APIs are Flask and FastAPI. They provide the tools to handle incoming web requests, process data, interact with your model, and send back responses, all with relatively little boilerplate code.</p>
        <h3 className="text-base font-semibold text-white">Why Use a Web Framework?</h3>
        <p>Creating an API standardizes interaction with your model. Instead of relying on custom scripts or specific execution environments, anyone (or any application) that can send an HTTP request can potentially use your model. This offers several advantages:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Decoupling:</strong> The service requesting predictions doesn&apos;t need to know the internal details of how the model runs, only how to structure the request and interpret the response.</li>
          <li><strong>Accessibility:</strong> Models become accessible over the network, enabling distributed systems and microservice architectures.</li>
          <li><strong>Scalability:</strong> Web frameworks often integrate with production-grade web servers (like Gunicorn for Flask, Uvicorn for FastAPI) that can handle multiple requests concurrently, forming the basis for scalable deployments.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'flask-shape',
    title: 'Flask: Simplicity and Maturity',
    subtitle: 'Load, route, JSON, predict, respond',
    Visual: VisualFlaskSteps,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Flask: Simplicity and Maturity</h3>
        <p>Flask is a lightweight WSGI (Web Server Gateway Interface) web application framework. It&apos;s known for its simplicity and minimal core, making it easy to get started. You add functionality through extensions as needed.</p>
        <p>A minimal Flask application for inference might look like this:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Load the Model:</strong> Load your serialized model (e.g., from a <R>.joblib</R> or <R>.pkl</R> file) when the application starts. Be mindful of where this model file resides, especially when running inside a container (often copied in during the build or mounted via a volume).</li>
          <li><strong>Define an Endpoint:</strong> Create a route (e.g., <R>/predict</R>) that listens for specific HTTP methods (typically <R>POST</R> for sending data).</li>
          <li><strong>Process Input:</strong> Extract data from the incoming request (often JSON), validate it, and preprocess it into the format your model expects (e.g., a NumPy array or Pandas DataFrame).</li>
          <li><strong>Get Prediction:</strong> Pass the processed data to the loaded model&apos;s <R>predict()</R> or <R>predict_proba()</R> method.</li>
          <li><strong>Return Response:</strong> Format the model&apos;s output (e.g., predictions, probabilities) into a JSON response and send it back to the client.</li>
        </ol>
      </div>
    ),
  },
  {
    id: 'flask-app',
    title: 'Example: Flask API for a Scikit-learn Model',
    subtitle: 'model.joblib is loaded when the app starts',
    Visual: VisualFlaskApp,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Example: Flask API for a Scikit-learn Model</h3>
        <p>Let&apos;s assume you have a trained Scikit-learn model saved as <R>model.joblib</R>.</p>
        <p><R>app.py</R> (Flask):</p>
        <CodeBlock>{`import joblib
from flask import Flask, request, jsonify
import pandas as pd

# Initialize Flask app
app = Flask(__name__)

# Load the trained model
# Ensure 'model.joblib' is accessible in the container's working directory
# or mounted via a volume.
try:
    model = joblib.load('model.joblib')
    print("Model loaded successfully.")
except FileNotFoundError:
    print("Error: model.joblib not found. Ensure it's in the correct path.")
    model = None # Handle gracefully or exit
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Define the prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        # Get JSON data from the request
        data = request.get_json(force=True)

        # Basic input validation (example: check for 'features' key)
        if 'features' not in data:
            return jsonify({"error": "Missing 'features' key in JSON payload"}), 400

        # Convert input data to DataFrame (adjust columns as per your model)
        # This assumes input is like: {"features": [[val1, val2, ...], [val1, val2, ...]]}
        # Or: {"features": [{"col1": val1, "col2": val2}, {"col1": val1, "col2": val2}]}
        input_df = pd.DataFrame(data['features'])

        # Make prediction
        predictions = model.predict(input_df)

        # Convert predictions to list for JSON serialization
        output = predictions.tolist()

        # Return predictions as JSON
        return jsonify({"predictions": output})

    except Exception as e:
        # Basic error handling
        print(f"Prediction error: {e}")
        return jsonify({"error": "Prediction failed", "details": str(e)}), 500

# Run the app (for local development)
# In production, use a WSGI server like Gunicorn:
# gunicorn --bind 0.0.0.0:5000 app:app
if __name__ == '__main__':
    # Use port 5000 by default, or configure as needed
    app.run(host='0.0.0.0', port=5000, debug=False) # Set debug=False for production`}</CodeBlock>
      </div>
    ),
  },
  {
    id: 'flask-serve',
    title: 'Running the Flask API',
    subtitle: 'python app.py locally, gunicorn in the container',
    Visual: VisualGunicorn,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p><R>requirements.txt</R>:</p>
        <CodeBlock>{`flask
pandas
scikit-learn
joblib
# Add gunicorn if using it as the server
gunicorn`}</CodeBlock>
        <p>To run this locally: <C>python app.py</C>. To run it with a production server: <C>gunicorn --bind 0.0.0.0:5000 app:app</C>. Inside a Docker container, the <R>CMD</R> or <R>ENTRYPOINT</R> would typically invoke <R>gunicorn</R>.</p>
      </div>
    ),
  },
  {
    id: 'fastapi-why',
    title: 'FastAPI: Performance and Modern Features',
    subtitle: 'Validation happens before predict()',
    Visual: VisualFastFlow,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">FastAPI: Performance and Modern Features</h3>
        <p>FastAPI is a modern, high-performance web framework built on Starlette (for web parts) and Pydantic (for data validation). It uses ASGI (Asynchronous Server Gateway Interface), enabling support for asynchronous code (<R>async</R>/<R>await</R>), which can significantly improve throughput for I/O-bound tasks often found in web services.</p>
        <p>Main advantages of FastAPI for inference APIs include:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Performance:</strong> Often faster than Flask due to its asynchronous nature and underlying libraries (Starlette, Uvicorn).</li>
          <li><strong>Data Validation:</strong> Uses Python type hints and Pydantic for automatic request/response data validation and serialization, reducing boilerplate code and catching errors early.</li>
          <li><strong>Automatic Docs:</strong> Generates interactive API documentation (Swagger UI and ReDoc) automatically from your code.</li>
          <li><strong>Async Support:</strong> Naturally handles asynchronous operations, useful if your preprocessing or postprocessing involves I/O (like fetching additional data).</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'fastapi-app',
    title: 'Example: FastAPI API for a Scikit-learn Model',
    subtitle: 'The same model.joblib, with a typed request',
    Visual: VisualFastFlow,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Example: FastAPI API for a Scikit-learn Model</h3>
        <p>Using the same <R>model.joblib</R>:</p>
        <p><R>app.py</R> (FastAPI):</p>
        <CodeBlock>{`import joblib
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Union, Dict, Any
import pandas as pd
import uvicorn # Required for running locally

# Define input data schema using Pydantic
# Option 1: List of lists for features
# class PredictionInput(BaseModel):
#     features: List[List[Union[float, int, str]]]

# Option 2: List of dictionaries for features (more explicit)
class FeatureRow(BaseModel):
    # Define expected feature names and types explicitly
    # Example:
    feature1: float
    feature2: int
    feature3: str
    # Add all features your model expects...

class PredictionInput(BaseModel):
    features: List[FeatureRow]

# Define output data schema
class PredictionOutput(BaseModel):
    predictions: List[Any] # Adjust 'Any' to the specific type if known (int, float, str)

# Initialize FastAPI app
app = FastAPI(title="ML Model Inference API", version="1.0")

# Load the trained model
try:
    model = joblib.load('model.joblib')
    print("Model loaded successfully.")
except FileNotFoundError:
    print("Error: model.joblib not found. Ensure it's in the correct path.")
    model = None
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.on_event("startup")
async def startup_event():
    # You can also load the model here if preferred
    # Global 'model' variable needs to be accessible
    if model is None:
        print("Model could not be loaded on startup.")
        # Optionally raise an error or handle differently

@app.get("/")
def read_root():
    return {"message": "To the ML Inference API"}

# Define the prediction endpoint
@app.post("/predict", response_model=PredictionOutput)
async def predict(input_data: PredictionInput):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        # Pydantic automatically validated the input based on PredictionInput schema
        # Convert Pydantic model to list of dicts, then to DataFrame
        input_dict_list = [row.dict() for row in input_data.features]
        input_df = pd.DataFrame(input_dict_list)

        # Ensure column order matches model's training if necessary
        # input_df = input_df[expected_column_order]

        # Make prediction
        predictions = model.predict(input_df)

        # Convert predictions to list
        output = predictions.tolist()

        # Return predictions (FastAPI validates against PredictionOutput)
        return PredictionOutput(predictions=output)

    except Exception as e:
        print(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")

# Run the app (for local development)
# In production, use Uvicorn directly or via Gunicorn with Uvicorn workers:
# uvicorn app:app --host 0.0.0.0 --port 8000
# gunicorn -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 app:app
if __name__ == '__main__':
    # Use port 8000 by default for FastAPI
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=False) # reload=True for dev`}</CodeBlock>
      </div>
    ),
  },
  {
    id: 'fastapi-serve',
    title: 'Running the FastAPI app',
    subtitle: 'uvicorn on port 8000, and /docs in the browser',
    Visual: VisualUvicorn,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p><R>requirements.txt</R>:</p>
        <CodeBlock>{`fastapi
uvicorn[standard] # Includes performance extras
pandas
scikit-learn
joblib
pydantic
# Add gunicorn if using it as the server
gunicorn`}</CodeBlock>
        <p>To run this locally: <C>uvicorn app:app --reload --port 8000</C>. For production: <C>uvicorn app:app --host 0.0.0.0 --port 8000</C>. Inside Docker, the <R>CMD</R> would typically invoke <R>uvicorn</R> or <R>gunicorn</R> with Uvicorn workers. Accessing <R>http://localhost:8000/docs</R> in your browser will show the automatically generated interactive documentation.</p>
      </div>
    ),
  },
  {
    id: 'docker-api',
    title: 'Integrating with Docker',
    subtitle: 'The image holds the app; -p publishes the port',
    Visual: VisualDockerApi,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Integrating with Docker</h3>
        <p>Regardless of whether you choose Flask or FastAPI, the process of containerizing the API is similar:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Dockerfile:</strong> Create a <R>Dockerfile</R> starting from a suitable base image (e.g., <R>python:3.9-slim</R>).</li>
          <li><strong>Install Dependencies:</strong> Copy your <R>requirements.txt</R> file and run <C>pip install -r requirements.txt</C>.</li>
          <li><strong>Copy Application Code:</strong> Copy your <R>app.py</R> and any other necessary scripts or modules.</li>
          <li><strong>Copy Model Artifact:</strong> Copy the <R>model.joblib</R> (or other model file) into the image. Alternatively, plan to mount it using a volume if the model is large or updated frequently.</li>
          <li><strong>Expose Port:</strong> Use the <R>EXPOSE</R> instruction to document the port your application listens on (e.g., <R>EXPOSE 5000</R> for Flask, <R>EXPOSE 8000</R> for FastAPI). Note that <R>EXPOSE</R> is documentation; you still need to publish the port with <R>-p</R> when running the container (<C>docker run -p 8080:8000 ...</C>).</li>
          <li><strong>Define Command:</strong> Use <R>CMD</R> or <R>ENTRYPOINT</R> to specify the command that starts your web server (e.g., <R>CMD [&quot;gunicorn&quot;, &quot;--bind&quot;, &quot;0.0.0.0:5000&quot;, &quot;app:app&quot;]</R> or <R>CMD [&quot;uvicorn&quot;, &quot;app:app&quot;, &quot;--host&quot;, &quot;0.0.0.0&quot;, &quot;--port&quot;, &quot;8000&quot;]</R>). Using <R>0.0.0.0</R> as the host ensures the server listens on all available network interfaces inside the container, making it accessible from the outside when the port is published.</li>
        </ol>
      </div>
    ),
  },
  {
    id: 'docker-choice',
    title: 'Flask or FastAPI',
    subtitle: 'Either one ships in a container',
    Visual: VisualChoice,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Building an API with Flask or FastAPI provides a standard way to serve your ML models. The choice between them often comes down to project requirements: Flask&apos;s simplicity is great for smaller projects or when performance isn&apos;t the primary concern, while FastAPI&apos;s performance, built-in validation, and async capabilities make it attractive for more demanding applications. Both integrate well with Docker for creating portable and scalable inference services.</p>
      </div>
    ),
  },
];

export default function ContainerizingMLModelsForInferencePartOne() {
  return <ChapterDeck slides={slides} />;
}
