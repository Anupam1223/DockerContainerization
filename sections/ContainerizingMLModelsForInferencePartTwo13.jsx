import React from 'react';
import ChapterDeck from '../components/ChapterDeck';
import CodeBlock from '../components/CodeBlock';
import {
  VisualArtifactPicker,
  VisualBasePicker,
  VisualBenefits,
  VisualBindHost,
  VisualCopyAcross,
  VisualCurlPredict,
  VisualDockerfilePass,
  VisualDropDeps,
  VisualExposeOnly,
  VisualHistory,
  VisualImageWeight,
  VisualLeaveBehind,
  VisualPortExamples,
  VisualPublishBridge,
  VisualPrune,
  VisualStageWalk,
  VisualTrainVsInfer,
} from '../components/ContainerizingMLModelsForInferencePartTwoVisualizers';

const C = ({ children }) => <span className="font-mono text-[13px] text-teal-200">{children}</span>;
const R = ({ children }) => <span className="font-mono text-[13px] text-rose-300">{children}</span>;

export const meta = {
  title: 'Containerizing ML Models for Inference (Part 2)',
  subtitle: 'Shrink the image, then publish the port',
};

const slides = [
  {
    id: 'size-why',
    title: 'Optimizing Image Size: Multi-Stage Builds',
    subtitle: 'Build tools do not belong in the image you ship',
    Visual: VisualImageWeight,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>When deploying machine learning models for inference, the size of the Docker image becomes a significant factor. Larger images take longer to download, consume more storage, and can potentially increase the attack surface by including unnecessary build tools or libraries. A common cause for large images is the inclusion of build-time dependencies, such as compilers, headers, or even entire SDKs, that are needed to install libraries but are not required to run the final application.</p>
        <p>Multi-stage builds offer an effective solution to this problem. They allow you to use multiple <R>FROM</R> instructions within a single Dockerfile. Each <R>FROM</R> instruction can use a different base image and begins a new &quot;stage&quot; of the build. You can selectively copy artifacts, like compiled code, installed dependencies, or model files, from one stage to another, leaving behind everything you don&apos;t need in the final image.</p>
      </div>
    ),
  },
  {
    id: 'how-stages',
    title: 'How Multi-Stage Builds Work',
    subtitle: 'A fat build stage, a slim final stage, then copy',
    Visual: VisualStageWalk,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">How Multi-Stage Builds Work</h3>
        <p>The strategy involves creating distinct stages for building and running the application:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Build Stage:</strong> This stage typically starts with a larger base image that includes all necessary compilers, build tools, and development headers. You perform tasks like installing dependencies (which might involve compilation), downloading models, or preprocessing data within this stage. You often label this stage using <R>AS &lt;stage_name&gt;</R> (e.g., <R>AS builder</R>).</li>
          <li><strong>Final Stage:</strong> This stage starts with a minimal base image suitable for runtime (like <R>python:3.9-slim</R> or a distroless image). It contains only the components essential for running your inference service.</li>
          <li><strong>Copying Artifacts:</strong> The critical step is using the <R>COPY --from=&lt;stage_name&gt;</R> instruction in the final stage. This command copies specific files or directories from the designated earlier stage (e.g., <R>builder</R>) to the final stage&apos;s filesystem.</li>
        </ol>
        <p>This process ensures that the final image only includes the runtime application, its direct dependencies, and any necessary data files, discarding the intermediate build environment and its associated bloat.</p>
      </div>
    ),
  },
  {
    id: 'dockerfile-example',
    title: 'Example: Optimizing a Python Inference Service',
    subtitle: 'FastAPI, a venv in the builder, slim at runtime',
    Visual: VisualDockerfilePass,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Example: Optimizing a Python Inference Service</h3>
        <p>For example, an inference service built with FastAPI that requires libraries which might have complex build dependencies. A multi-stage Dockerfile could look like this:</p>
        <CodeBlock>{`# Stage 1: Builder stage with build tools
FROM python:3.9 AS builder

WORKDIR /app

# Install build essentials if needed (example for Debian-based images)
# RUN apt-get update && apt-get install -y --no-install-recommends build-essential

# Copy only requirements first to leverage Docker cache
COPY requirements.txt .

# Install all dependencies, including build-time ones
# Using a virtual environment within the build stage can help isolate packages
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Optional: Download model artifacts if they aren't copied with the code
# RUN python download_model.py

# Stage 2: Final stage with a slim runtime environment
FROM python:3.9-slim

WORKDIR /app

# Copy the virtual environment from the builder stage
COPY --from=builder /opt/venv /opt/venv

# Copy the application code (adjust path if needed)
COPY --from=builder /app /app

# Copy model files if they were downloaded or part of the app code in builder
# COPY --from=builder /app/models /app/models

# Make port 80 available outside this container
EXPOSE 80

# Define environment variable
ENV NAME

# Set the path to include the virtual environment's binaries
ENV PATH="/opt/venv/bin:$PATH"

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]`}</CodeBlock>
      </div>
    ),
  },
  {
    id: 'example-walk',
    title: 'What the Final Image Keeps',
    subtitle: 'venv and app cross over. Build tools do not.',
    Visual: VisualCopyAcross,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>In this example:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>The <R>builder</R> stage uses the standard <R>python:3.9</R> image, installs dependencies from <R>requirements.txt</R> into a virtual environment (<R>/opt/venv</R>), and copies the application code.</li>
          <li>The final stage starts from the much smaller <R>python:3.9-slim</R> image.</li>
          <li><R>COPY --from=builder /opt/venv /opt/venv</R> copies the <em>entire</em> virtual environment, containing only the installed Python packages, from the builder stage to the final stage.</li>
          <li><R>COPY --from=builder /app /app</R> copies the application source code.</li>
          <li>The final image contains the slim Python runtime, the necessary installed packages within the virtual environment, and the application code, but <em>not</em> the build tools or intermediate layers from the <R>builder</R> stage.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'benefits',
    title: 'Benefits of Multi-Stage Builds for Inference',
    subtitle: 'Size, security, separation, and a cached builder',
    Visual: VisualBenefits,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Benefits of Multi-Stage Builds for Inference</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Reduced Image Size:</strong> This is the primary advantage. Removing build tools, temporary files, and unnecessary libraries can drastically shrink the final image size, leading to faster deployments and lower storage costs.</li>
          <li><strong>Improved Security:</strong> By excluding build tools and development libraries from the final image, you reduce the potential attack surface. Fewer components mean fewer potential vulnerabilities.</li>
          <li><strong>Clear Separation:</strong> It enforces a clean separation between the build environment and the runtime environment, making Dockerfiles easier to understand and maintain.</li>
          <li><strong>Optimized Caching:</strong> Docker can cache individual stages. If the build stage dependencies haven&apos;t changed, Docker can reuse the cached build stage, speeding up subsequent builds even if the final stage requires changes.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'build-strategies',
    title: 'Build Strategies',
    subtitle: 'Choose the files, then choose how small the base is',
    Visual: VisualArtifactPicker,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Build Strategies</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Identifying Artifacts:</strong> You need to carefully identify exactly which files and directories are required for runtime and ensure you copy them correctly using <R>COPY --from</R>. This might include installed packages (like the <R>site-packages</R> directory or a virtual environment), compiled binaries, static assets, and model files. Inspecting the filesystem of an intermediate build stage container can be helpful (<C>docker run --rm -it &lt;builder_image_id&gt; bash</C>).</li>
          <li><strong>Base Image Selection:</strong> Choose appropriate base images for each stage. The build stage might need a full OS distribution or specific SDK image, while the final stage should be as minimal as possible (e.g., <R>slim</R>, <R>alpine</R>, or <R>distroless</R>).</li>
        </ul>
        <p>Multi-stage builds are a standard practice for creating production-ready container images, particularly important for ML inference services where efficiency and security are significant concerns. By separating build-time requirements from runtime necessities, you create leaner, faster, and more secure containers for serving your models.</p>
      </div>
    ),
  },
  {
    id: 'reduce-why',
    title: 'Reducing Dependencies for Inference',
    subtitle: 'Training needs a workshop. Serving needs the model.',
    Visual: VisualTrainVsInfer,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>When deploying machine learning models for inference, the efficiency and security of your container image are significant factors. A large image consumes more disk space, takes longer to download and start, and potentially includes unnecessary software, increasing the attack surface. Reducing dependencies in your final inference image is therefore a critical optimization step. This reduction can often be achieved through methods such as multi-stage builds.</p>
        <p>While a development or training environment might require a wide array of tools, compilers, data manipulation libraries like pandas, plotting libraries, full ML framework installations, and testing utilities, an inference container typically needs far less. Its primary job is usually to load a pre-trained model and run predictions, often via a lightweight web API.</p>
      </div>
    ),
  },
  {
    id: 'drop-deps',
    title: 'Identifying Unnecessary Dependencies',
    subtitle: 'Compilers, headers, plots, tests, and leftover files',
    Visual: VisualDropDeps,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Identifying Unnecessary Dependencies</h3>
        <p>The first step is to carefully analyze what your inference service actually needs to run. Common dependencies that can often be excluded from the final inference stage include:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Build Tools:</strong> Compilers (<R>gcc</R>, <R>g++</R>), build systems (<R>make</R>, <R>cmake</R>), and package manager caches (<R>apt</R>, <R>pip</R>, <R>conda</R>). These are essential for <em>building</em> software or installing packages but not for <em>running</em> the compiled application or installed libraries.</li>
          <li><strong>Development Headers and Libraries:</strong> Packages ending in <R>-dev</R> or <R>-devel</R> (e.g., <R>python3-dev</R>, <R>libssl-dev</R>) are needed for compiling certain Python packages with C extensions but are rarely required at runtime.</li>
          <li><strong>Full Data Science Libraries:</strong> While you might use libraries like Pandas or Matplotlib extensively during training and experimentation, your inference code might only require NumPy for numerical operations or specific functions from the ML framework. If you only need a subset of a large library, examine whether you can refactor your inference code to avoid the heavy dependency.</li>
          <li><strong>Testing Frameworks:</strong> Libraries like <R>pytest</R> or <R>unittest</R> are essential for development but have no place in a production inference image.</li>
          <li><strong>Unused Code and Assets:</strong> Ensure only the specific inference script, model artifacts, and essential configuration files are copied into the final image, excluding datasets, notebooks, or training scripts.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'strategy-multistage',
    title: '1. Leverage Multi-Stage Builds Aggressively',
    subtitle: 'gcc and the pip cache stay in the builder',
    Visual: VisualLeaveBehind,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Strategies for Minimizing Dependencies</h3>
        <p>Several techniques, often used in combination, help create lean inference images:</p>
        <h3 className="text-base font-semibold text-white">1. Leverage Multi-Stage Builds Aggressively</h3>
        <p>Multi-stage builds are the primary mechanism for separating build-time needs from runtime requirements.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Build Stage:</strong> Use a base image with all necessary build tools (e.g., <R>python:3.9</R> which is Debian-based and includes build essentials). Install dependencies using <R>pip</R> or <R>conda</R>, compile any necessary code, and prepare your application.</li>
          <li>
            <strong>Final Stage:</strong> Start from a minimal base image (e.g., <R>python:3.9-slim-buster</R> or even <R>python:3.9-alpine</R>, being mindful of potential compatibility issues with Alpine&apos;s <R>musl libc</R>). Copy only the required artifacts from the build stage:
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>The installed Python packages (e.g., the virtual environment&apos;s <R>site-packages</R> directory).</li>
              <li>Your compiled application code or inference scripts.</li>
              <li>The trained model file(s).</li>
              <li>Any necessary configuration files.</li>
            </ul>
          </li>
        </ul>
        <CodeBlock>{`# ---- Build Stage ----
FROM python:3.9 AS builder

WORKDIR /app

# Install build dependencies if needed (e.g., for C extensions)
# RUN apt-get update && apt-get install -y --no-install-recommends gcc build-essential

# Create a virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy requirements and install packages
COPY requirements.txt .
# Use --no-cache-dir to reduce layer size
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY ./src ./src
COPY ./models ./models

# ---- Final Stage ----
FROM python:3.9-slim-buster

WORKDIR /app

# Copy only the virtual environment from the build stage
COPY --from=builder /opt/venv /opt/venv

# Copy only the necessary application code and models
COPY --from=builder /app/src ./src
COPY --from=builder /app/models ./models

# Set path to use the virtual environment
ENV PATH="/opt/venv/bin:$PATH"

# Expose port if it's an API
EXPOSE 8000

# Define the command to run the application
CMD ["python", "src/inference_api.py"]`}</CodeBlock>
        <p>In this example, tools like <R>gcc</R> (if installed in the builder) and the <R>pip</R> cache are left behind in the <R>builder</R> stage and are not present in the final, leaner image.</p>
      </div>
    ),
  },
  {
    id: 'minimal-base',
    title: '2. Choose Minimal Base Images',
    subtitle: 'slim, alpine, or distroless for the final stage',
    Visual: VisualBasePicker,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">2. Choose Minimal Base Images</h3>
        <p>The base image for your <em>final</em> stage significantly impacts size. Here are your options:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><R>python:&lt;version&gt;-slim</R>: These are based on Debian but have many non-essential OS packages removed compared to the standard <R>python:&lt;version&gt;</R> images. They offer a good balance between size and compatibility.</li>
          <li><R>python:&lt;version&gt;-alpine</R>: Based on the lightweight Alpine Linux distribution. These images are significantly smaller but use <R>musl libc</R> instead of the more common <R>glibc</R>. This can sometimes lead to subtle issues or incompatibility with pre-compiled Python wheels expecting <R>glibc</R>. Test thoroughly if you choose Alpine.</li>
          <li><strong>Distroless Images:</strong> Google&apos;s Distroless images contain only your application and its runtime dependencies. They don&apos;t include package managers, shells, or other standard OS utilities, drastically reducing the attack surface and size. Building these often requires more complex multi-stage setups, copying application binaries and dependencies meticulously.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'prune-reqs',
    title: '3. Prune Package Installations',
    subtitle: 'Pin, drop, swap the runtime, and skip the caches',
    Visual: VisualPrune,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">3. Prune Package Installations</h3>
        <p>Be explicit and minimal in your <R>requirements.txt</R> for the inference environment.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Pin versions (<R>==</R>) to ensure reproducibility and avoid accidentally pulling in newer, potentially larger, versions of dependencies.</li>
          <li>Only include packages strictly necessary for inference. Review your inference code and remove imports/dependencies not used in the prediction path.</li>
          <li>Use framework-specific inference runtimes if available (e.g., <R>tensorflow-lite-runtime</R> instead of the full <R>tensorflow</R> package if you&apos;re using a TFLite model).</li>
          <li>Use <C>pip install --no-cache-dir</C> to avoid caching downloaded packages within the image layer, reducing its size.</li>
          <li>Clean up package manager caches if not using multi-stage builds effectively (e.g., <C>apt-get clean &amp;&amp; rm -rf /var/lib/apt/lists/*</C> for Debian/Ubuntu-based images). Multi-stage builds usually make this less critical for the final image.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'history',
    title: '4. Analyze Your Image Layers',
    subtitle: 'The fat layer is usually a copy or a cache',
    Visual: VisualHistory,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">4. Analyze Your Image Layers</h3>
        <p>Tools like <C>docker history &lt;image_name&gt;</C> can show the size contribution of each layer in your image. Third-party tools like <R>docker-explore</R> provide a more interactive way to explore image layers and identify files that contribute most to the size. This can help pinpoint large files or directories that were perhaps copied unintentionally or caches that weren&apos;t cleaned.</p>
        <p>By diligently applying these techniques, particularly multi-stage builds and careful dependency selection, you can significantly reduce the size and complexity of your inference container images. This leads to faster deployments, improved security posture, and more efficient resource utilization in production environments.</p>
      </div>
    ),
  },
  {
    id: 'bind-host',
    title: 'Exposing Ports for API Access',
    subtitle: 'The server has to listen on 0.0.0.0',
    Visual: VisualBindHost,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>To make a containerized inference API reachable from outside, specifically from a host machine or other machines on a network, port exposure is essential. An application, such as a Flask or FastAPI web server running inside a Docker container, listens on a specific port <em>within</em> the container&apos;s isolated network environment. By default, this port is not accessible from the host machine. Bridging this gap requires mapping a port on the host machine to the port inside the container.</p>
        <h3 className="text-base font-semibold text-white">Understanding Container Networking and Ports</h3>
        <p>Think of a Docker container as having its own private network interface and IP address. When your Python web server (like Uvicorn for FastAPI or the development server for Flask) starts, it binds to a port within this container network. For example, FastAPI with Uvicorn often defaults to port 8000, while Flask defaults to 5000.</p>
        <p>If your server inside the container binds only to <R>127.0.0.1</R> (localhost) within the container, it will only accept connections originating from <em>inside</em> that same container. To allow connections from the Docker host network (and thus, through port mapping, from the outside), you must configure your server to listen on <R>0.0.0.0</R>. This tells the server to accept connections on all available network interfaces within the container.</p>
        <p>Here&apos;s how you typically run Uvicorn (for FastAPI) to listen on all interfaces within the container on port 8000:</p>
        <CodeBlock>uvicorn main:app --host 0.0.0.0 --port 8000</CodeBlock>
        <p>Or for Flask&apos;s development server:</p>
        <CodeBlock>flask run --host=0.0.0.0 --port=5000</CodeBlock>
      </div>
    ),
  },
  {
    id: 'expose-doc',
    title: 'Documenting Ports with EXPOSE',
    subtitle: 'The instruction is a label, not a published port',
    Visual: VisualExposeOnly,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Documenting Ports with EXPOSE</h3>
        <p>The Dockerfile provides the <R>EXPOSE</R> instruction. Its primary purpose is to document which port(s) the application inside the container is intended to listen on. It acts as metadata for image consumers (including yourself) and can be used by other tools.</p>
        <p>For instance, if your FastAPI application listens on port 8000, you would add this line to your Dockerfile.</p>
        <CodeBlock>{`# ... other instructions (FROM, COPY, RUN pip install ...)

# Document that the application uses port 8000
EXPOSE 8000

# Command to run the application, listening on 0.0.0.0
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`}</CodeBlock>
        <p>It is significant to understand that <R>EXPOSE</R> does <em>not</em> actually publish the port or make it accessible from the host machine. It&apos;s purely informational. The actual connection is established when you run the container.</p>
      </div>
    ),
  },
  {
    id: 'publish-flag',
    title: 'Publishing Ports with docker run -p',
    subtitle: 'Host port on the left, container port on the right',
    Visual: VisualPublishBridge,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Publishing Ports with docker run -p</h3>
        <p>To make the container&apos;s port reachable from your host machine, you use the <R>-p</R> or <R>--publish</R> flag when executing the <C>docker run</C> command. This flag maps a port on the host machine to a port inside the container.</p>
        <p>The format is: <C>-p &lt;host_port&gt;:&lt;container_port&gt;</C></p>
        <ul className="list-disc pl-5 space-y-2">
          <li><R>&lt;host_port&gt;</R>: The port number on your Docker host machine (your computer). You will use this port to access the service.</li>
          <li><R>&lt;container_port&gt;</R>: The port number inside the container that the application is listening on (the one specified in <R>EXPOSE</R> and used by your application server).</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'port-examples',
    title: 'Examples',
    subtitle: '8080 to 8000, same port, or a random host port',
    Visual: VisualPortExamples,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Examples:</h3>
        <p>1. Map host port 8080 to container port 8000:</p>
        <CodeBlock>docker run -d -p 8080:8000 --name my_inference_api my_inference_image:latest</CodeBlock>
        <p>In this case, you would access your API via <R>http://localhost:8080</R> on your host machine. Docker forwards the traffic from host port 8080 to container port 8000.</p>
        <p>2. Map host port 8000 to container port 8000:</p>
        <CodeBlock>docker run -d -p 8000:8000 --name my_inference_api my_inference_image:latest</CodeBlock>
        <p>Here, the host port and container port are the same. Access would be via <R>http://localhost:8000</R>. This only works if port 8000 is not already in use on your host machine.</p>
        <p>3. Map container port 8000 to a random host port:</p>
        <CodeBlock>docker run -d -p 8000 --name my_inference_api my_inference_image:latest</CodeBlock>
        <p>If you only specify the container port, Docker automatically assigns a random available port on the host machine. You can find out which port was assigned using the <C>docker ps</C> command:</p>
        <CodeBlock>docker ps</CodeBlock>
        <p>Look for the <R>PORTS</R> column in the output, which might show something like <R>0.0.0.0:32768-&gt;8000/tcp</R>. This means host port 32768 is mapped to container port 8000.</p>
        <p>The following diagram illustrates mapping host port 8080 to container port 8000.</p>
        <p>This diagram shows traffic directed to port 8080 on the host machine being forwarded by Docker to port 8000 inside the running container, where the inference API application is listening.</p>
      </div>
    ),
  },
  {
    id: 'curl-test',
    title: 'Testing the Connection',
    subtitle: 'curl the host port, not the container port',
    Visual: VisualCurlPredict,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Testing the Connection</h3>
        <p>Once your container is running with the ports correctly mapped, you can test the inference API using tools like <R>curl</R> or by simply navigating to the URL in your web browser (if your API supports GET requests at the root).</p>
        <p>Using the first example above (<R>-p 8080:8000</R>), you would send a request to the <em>host</em> port:</p>
        <CodeBlock>{`# Example: Sending a POST request with JSON data to a /predict endpoint
curl -X POST http://localhost:8080/predict \\
-H "Content-Type: application/json" \\
-d '{"features": [1.0, 2.5, 0.8]}'`}</CodeBlock>
        <p>If the mapping is successful and your API is running correctly inside the container, you should receive the prediction response.</p>
        <p>Remember to choose a host port that isn&apos;t already being used by another application on your system. Using <R>EXPOSE</R> in your Dockerfile documents the intended container port, and using <C>docker run -p &lt;host_port&gt;:&lt;container_port&gt;</C> makes your containerized inference service accessible for requests.</p>
      </div>
    ),
  },
];

export default function ContainerizingMLModelsForInferencePartTwo() {
  return <ChapterDeck slides={slides} />;
}
