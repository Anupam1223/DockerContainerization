import React from 'react';
import ChapterDeck from '../components/ChapterDeck';
import CodeBlock from '../components/CodeBlock';
import {
  VisualBasicRun,
  VisualBindTrain,
  VisualCentralLogs,
  VisualComposeGpu,
  VisualDaemonFlow,
  VisualDetached,
  VisualFileLogger,
  VisualGpuBridge,
  VisualGpuCheck,
  VisualGpuPrep,
  VisualGpuRun,
  VisualGpuToolkit,
  VisualLifecycle,
  VisualNamedVolumes,
  VisualOverrideCmd,
  VisualPersistLog,
  VisualResources,
  VisualRunConfig,
  VisualStdoutCapture,
  VisualStructured,
} from '../components/ContainerizingMLTrainingWorkflowsPartTwoVisualizers';

const C = ({ children }) => <span className="font-mono text-[13px] text-teal-200">{children}</span>;
const R = ({ children }) => <span className="font-mono text-[13px] text-rose-300">{children}</span>;

export const meta = {
  title: 'Containerizing ML Training Workflows (Part 2)',
  subtitle: 'docker run, logs, and GPU access',
};

const slides = [
  {
    id: 'run-basic',
    title: 'Running Training Jobs with docker run',
    subtitle: 'Find the image, create a container, start the script',
    Visual: VisualBasicRun,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          To execute a machine learning training process, <C>docker run</C> is the primary command for creating and running a container instance from a Docker image. This command enables the execution of your training script and all its dependencies within an isolated environment. Utilizing <C>docker run</C> ensures the training environment precisely matches the configuration specified in the Dockerfile, preventing variations from the host machine and enhancing reproducibility of results.
        </p>
        <p>This section focuses on using the <C>docker run</C> command effectively to launch, manage, and configure containerized machine learning training jobs.</p>
        <h3 className="text-base font-semibold text-white">Basic Training Execution</h3>
        <p><C>docker run</C> creates and starts a new container from a specified image. If your Dockerfile includes an <R>ENTRYPOINT</R> or <R>CMD</R> instruction that points to your training script, running the container might be as simple as:</p>
        <CodeBlock>docker run your-ml-training-image:latest</CodeBlock>
        <p>This command instructs Docker to:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Find the image named <R>your-ml-training-image</R> with the tag <R>latest</R>.</li>
          <li>Create a new container based on this image.</li>
          <li>Start the container, executing the command specified by <R>ENTRYPOINT</R> or <R>CMD</R> in the Dockerfile.</li>
        </ol>
      </div>
    ),
  },
  {
    id: 'run-override',
    title: 'Appending a command',
    subtitle: 'A command after the image replaces CMD',
    Visual: VisualOverrideCmd,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Often, you&apos;ll want to provide specific arguments to your training script, such as hyperparameters or data paths, or even run a different script within the image. You can do this by appending the command and its arguments after the image name:</p>
        <CodeBlock>{`# Run train.py with specific arguments
docker run your-ml-training-image:latest python train.py --epochs 20 --batch-size 64

# Run a different script, e.g., data preprocessing
docker run your-ml-training-image:latest python preprocess_data.py --input /raw_data --output /processed_data`}</CodeBlock>
        <p>When you provide a command after the image name, it typically overrides the <R>CMD</R> instruction in the Dockerfile. If an <R>ENTRYPOINT</R> is defined, the command you provide might be passed as arguments to the <R>ENTRYPOINT</R>.</p>
      </div>
    ),
  },
  {
    id: 'data-bind',
    title: 'Providing Data and Retrieving Results',
    subtitle: 'Bind-mount the data read-only, and the output read-write',
    Visual: VisualBindTrain,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Providing Data and Retrieving Results</h3>
        <p>Training jobs are rarely self-contained; they need access to datasets and produce outputs like trained models, logs, or evaluation metrics. As discussed in Chapter 3, Docker volumes and bind mounts are the standard mechanisms for this.</p>
        <p>You integrate these data management techniques using the <C>-v</C> or <C>--mount</C> flag with <C>docker run</C>.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Using Bind Mounts:</strong> Useful for development or when data resides directly on the host machine.
            <CodeBlock>{`# Mount local ./data to /app/data in the container
# Mount local ./output to /app/output in the container
docker run \\
  -v $(pwd)/data:/app/data:ro \\
  -v $(pwd)/output:/app/output \\
  your-ml-training-image:latest \\
  python train.py --data-dir /app/data --model-dir /app/output/models`}</CodeBlock>
            <p>In this example, <C>$(pwd)/data</C> (the <R>data</R> directory in the current host working directory) is mounted read-only (<C>:ro</C>) inside the container at <C>/app/data</C>. The <C>$(pwd)/output</C> directory is mounted read-write at <C>/app/output</C>. The training script inside the container accesses data via <C>/app/data</C> and saves models to <C>/app/output/models</C>, which appear directly in the <C>./output/models</C> directory on the host.</p>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'data-volumes',
    title: 'Using Docker Volumes',
    subtitle: 'The disks are named, not tied to a host path',
    Visual: VisualNamedVolumes,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Using Docker Volumes:</strong> Preferred for managing persistent data independent of the host filesystem structure.
            <CodeBlock>{`# Assume volumes 'training_data_v1' and 'model_artifacts_v1' exist
docker run \\
  -v training_data_v1:/app/data:ro \\
  -v model_artifacts_v1:/app/output \\
  your-ml-training-image:latest \\
  python train.py --data-dir /app/data --model-dir /app/output/models`}</CodeBlock>
            <p>Here, Docker-managed volumes are mounted into the container. This decouples data storage from the host&apos;s directory layout.</p>
          </li>
        </ul>
        <p>Remember to ensure the paths inside the container (<C>/app/data</C>, <C>/app/output/models</C>) match what your training script expects.</p>
      </div>
    ),
  },
  {
    id: 'config-runs',
    title: 'Configuring Training Runs',
    subtitle: 'Secrets on -e, hyperparameters on the command',
    Visual: VisualRunConfig,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Configuring Training Runs</h3>
        <p>As covered previously, environment variables and command-line arguments are common ways to configure training jobs. <C>docker run</C> provides flags for both:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Environment Variables (<C>-e</C> or <C>--env</C>):</strong> Suitable for passing configuration like API keys, learning rates, or flags.
            <CodeBlock>{`docker run \\
  -e LEARNING_RATE=0.005 \\
  -e NUM_EPOCHS=30 \\
  -e WANDB_API_KEY=your_secret_key \\
  -v ... \\
  your-ml-training-image:latest \\
  python train.py
# Assumes train.py reads LEARNING_RATE, NUM_EPOCHS from environment`}</CodeBlock>
          </li>
          <li>
            <strong>Command-Line Arguments:</strong> Passed directly after the image name (or after the overriding command).
            <CodeBlock>{`docker run \\
  -v ... \\
  your-ml-training-image:latest \\
  python train.py --learning-rate 0.005 --epochs 30 --log-to-wandb`}</CodeBlock>
          </li>
        </ul>
        <p>The choice between them often depends on the training script&apos;s design. Environment variables are useful for secrets or settings that might apply across different script executions, while command-line arguments are explicit and often used for run-specific parameters like hyperparameters.</p>
      </div>
    ),
  },
  {
    id: 'detached',
    title: 'Detached vs. Interactive Execution',
    subtitle: '-d returns the prompt; docker logs follows the job',
    Visual: VisualDetached,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Detached vs. Interactive Execution</h3>
        <p>By default, <C>docker run</C> attaches your terminal to the container&apos;s standard input, output, and error streams. You&apos;ll see the training logs directly in your terminal, and the command prompt will block until the container exits. This is useful for short jobs or interactive debugging.</p>
        <p>For long-running training jobs, you&apos;ll typically want to run the container in <strong>detached mode</strong> using the <C>-d</C> flag:</p>
        <CodeBlock>{`docker run -d \\
  --name long_training_run \\
  -v training_data_v1:/app/data:ro \\
  -v model_artifacts_v1:/app/output \\
  -e LEARNING_RATE=0.001 \\
  your-ml-training-image:latest \\
  python train.py --data-dir /app/data --model-dir /app/output/models`}</CodeBlock>
        <p>This command starts the container in the background and prints the container ID. Your terminal prompt returns immediately.</p>
        <p>To view the logs of a detached container, use the <C>docker logs</C> command:</p>
        <CodeBlock>{`# Follow logs in real-time
docker logs -f long_training_run

# Show all existing logs
docker logs long_training_run`}</CodeBlock>
      </div>
    ),
  },
  {
    id: 'resources',
    title: 'Resource Constraints',
    subtitle: 'Cap the cores and the memory',
    Visual: VisualResources,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Resource Constraints</h3>
        <p>Machine learning training can be computationally intensive. <C>docker run</C> allows you to limit the resources a container can consume, preventing a single job from monopolizing host resources.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>CPU Limits (<C>--cpus</C>):</strong> Specify the number of CPU cores the container can use.</li>
          <li><strong>Memory Limits (<C>--memory</C>):</strong> Set a maximum amount of RAM.</li>
        </ul>
        <CodeBlock>{`docker run \\
  --cpus="4" \\
  --memory="16g" \\
  --name resource_limited_training \\
  -v ... \\
  your-ml-training-image:latest \\
  python train.py ...`}</CodeBlock>
        <p>This ensures the container uses at most 4 CPU cores and 16 GB of RAM.</p>
      </div>
    ),
  },
  {
    id: 'lifecycle',
    title: 'Managing Container Lifecycle',
    subtitle: 'Name it, or let --rm delete it',
    Visual: VisualLifecycle,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Managing Container Lifecycle</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Naming Containers (<C>--name</C>):</strong> Assigning a memorable name makes it easier to manage containers (e.g., view logs, stop, remove) instead of relying on auto-generated IDs.
            <CodeBlock>{`docker run -d --name my_experiment_run_001 ...
docker logs my_experiment_run_001
docker stop my_experiment_run_001`}</CodeBlock>
          </li>
          <li>
            <strong>Automatic Cleanup (<C>--rm</C>):</strong> For training jobs that are typically run once and don&apos;t need to be inspected after completion, the <C>--rm</C> flag is very useful. It automatically removes the container&apos;s filesystem when the container exits. This prevents cluttering your system with stopped containers.
            <CodeBlock>{`# Container will be removed automatically upon completion or error
docker run --rm \\
  --name transient_training \\
  -v ... \\
  your-ml-training-image:latest \\
  python train.py ...`}</CodeBlock>
          </li>
        </ul>
        <p>Note: <C>--rm</C> cannot be used with <C>-d</C>. If you run a job detached and want it removed after completion, you&apos;ll need to remove it manually using <C>docker rm &lt;container_name_or_id&gt;</C>.</p>
      </div>
    ),
  },
  {
    id: 'run-flow',
    title: 'Visualizing the docker run Process for Training',
    subtitle: 'Daemon, image, mounts, then the script',
    Visual: VisualDaemonFlow,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Visualizing the <C>docker run</C> Process for Training</h3>
        <p>The <C>docker run</C> command orchestrates several components to launch your training job within an isolated environment.</p>
        <p>Diagram illustrating the flow when using <C>docker run</C> for a training job. The command initiates the process, instructing the Docker daemon to create a container from an image, mount requested data volumes or directories, inject environment variables, and execute the specified training script.</p>
      </div>
    ),
  },
  {
    id: 'logs-capture',
    title: 'Managing Training Logs',
    subtitle: 'stdout and stderr, until the container is removed',
    Visual: VisualStdoutCapture,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>When your machine learning training script runs inside a container, it generates output that is essential for monitoring progress, debugging issues, and ensuring the reproducibility of your experiments. Effectively managing these logs is a fundamental part of containerized ML workflows. Without proper management, valuable information can be lost when the container stops.</p>
        <h3 className="text-base font-semibold text-white">Capturing Container Output: <R>stdout</R> and <R>stderr</R></h3>
        <p>By default, applications running inside a Docker container send their standard output (<R>stdout</R>) and standard error (<R>stderr</R>) streams to the container&apos;s logging driver. Docker captures these streams, allowing you to inspect them later.</p>
        <p>The most direct way to access these logs is using the <C>docker logs</C> command followed by the container ID or name:</p>
        <CodeBlock>{`# Start a training container in the background
docker run -d --name training_job my_ML_image python train.py --epochs 10

# Fetch the logs from the container
docker logs training_job

# Follow the log output in real-time (like tail -f)
docker logs -f training_job`}</CodeBlock>
        <p>This method is straightforward for simple cases or quick debugging. However, relying solely on the default logging driver has limitations:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Persistence:</strong> Logs captured this way are typically stored on the Docker host. If the container is removed (<C>docker rm</C>), the logs associated with it are usually lost unless a different logging driver is configured.</li>
          <li><strong>Scalability:</strong> Managing logs via <C>docker logs</C> becomes cumbersome with many containers or in distributed environments.</li>
          <li><strong>Format:</strong> The raw stream output might not be easily parseable or searchable.</li>
        </ol>
      </div>
    ),
  },
  {
    id: 'logs-file',
    title: 'Logging to Files within the Container',
    subtitle: 'A file inside, and a copy on stdout',
    Visual: VisualFileLogger,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Logging to Files within the Container</h3>
        <p>A common and more direct practice is to configure your training script to write logs to specific files <em>inside</em> the container, rather than just printing to <R>stdout</R>/<R>stderr</R>. Most programming languages provide standard logging libraries for this purpose.</p>
        <p>For instance, in Python, you can use the built-in <R>logging</R> module:</p>
        <CodeBlock>{`# Example snippet within train.py
import logging
import sys

# Configure logging to file and console
log_file = '/app/logs/training.log'
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler(sys.stdout) # Also log to console
    ]
)

logging.info("Starting training process...")
# ... training code ...
logging.info("Training finished.")`}</CodeBlock>
        <p>This script now writes timestamped log messages to <C>/app/logs/training.log</C> inside the container&apos;s filesystem and duplicates them to <R>stdout</R>.</p>
      </div>
    ),
  },
  {
    id: 'logs-persist',
    title: 'Persisting Log Files',
    subtitle: 'The file survives after the container is gone',
    Visual: VisualPersistLog,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Persisting Log Files with Volumes or Bind Mounts</h3>
        <p>Writing logs to a file inside the container solves the formatting issue but not the persistence problem. If the container is removed, the <C>/app/logs/training.log</C> file disappears with it. To preserve these logs, you need to store them outside the container&apos;s ephemeral filesystem using Docker volumes or bind mounts, which you encountered in the previous chapter.</p>
        <p><strong>Using Bind Mounts:</strong></p>
        <p>Bind mounts map a directory from your host machine directly into the container. This is often convenient during development.</p>
        <CodeBlock>{`# Create a directory on the host to store logs
mkdir -p /path/on/host/training_logs

# Run the container, mounting the host directory to the container's log directory
docker run -d \\
  --name training_job \\
  -v /path/on/host/training_logs:/app/logs \\
  my_ml_image \\
  python train.py --epochs 10`}</CodeBlock>
        <p>Now, the <C>training.log</C> file generated inside the container at <C>/app/logs/training.log</C> will actually be written to <C>/path/on/host/training_logs/training.log</C> on your host machine, persisting even after the container is stopped and removed.</p>
        <p><strong>Using Docker Volumes:</strong></p>
        <p>Volumes are managed by Docker and are the preferred method for persisting data in production or when you don&apos;t want to tie the data storage to a specific host directory structure.</p>
        <CodeBlock>{`# Create a Docker volume (optional, Docker creates it if it doesn't exist)
docker volume create ml_training_logs

# Run the container, mounting the named volume to the container's log directory
docker run -d \\
  --name training_job \\
  -v ml_training_logs:/app/logs \\
  my_ml_image \\
  python train.py --epochs 10`}</CodeBlock>
        <p>Logs are now stored in the <R>ml_training_logs</R> volume, managed by Docker. You can inspect the volume&apos;s contents or back it up independently of the container or host filesystem specifics.</p>
        <p>Diagram illustrating how bind mounts and Docker volumes connect the log file inside the container to storage on the Docker host.</p>
      </div>
    ),
  },
  {
    id: 'logs-structured',
    title: 'Structured Logging',
    subtitle: 'One line becomes a JSON object',
    Visual: VisualStructured,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Structured Logging</h3>
        <p>For easier automated processing and analysis, format your logs in a structured way, such as JSON. Many logging libraries support custom formatters.</p>
        <CodeBlock>{`# Example using Python's logging with a JSON formatter (requires python-json-logger)
# pip install python-json-logger

import logging
from pythonjsonlogger import jsonlogger

log_handler = logging.FileHandler('/app/logs/training.log')
formatter = jsonlogger.JsonFormatter('%(asctime)s %(levelname)s %(message)s')
log_handler.setFormatter(formatter)

logger = logging.getLogger()
logger.addHandler(log_handler)
logger.setLevel(logging.INFO)

logger.info("Training started", extra={'learning_rate': 0.01, 'epochs': 10})
# Output in training.log: {"asctime": "...", "levelname": "INFO", "message": "Training started",
# "learning_rate": 0.01, "epochs": 10}`}</CodeBlock>
        <p>Structured logs are much easier to ingest into log analysis platforms.</p>
      </div>
    ),
  },
  {
    id: 'logs-central',
    title: 'Centralized Logging Systems',
    subtitle: 'Many containers, one place to search',
    Visual: VisualCentralLogs,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Centralized Logging Systems</h3>
        <p>While persisting logs to host files via volumes or bind mounts works well for single experiments or small setups, managing logs across numerous containers or in production environments often involves <strong>centralized logging systems</strong>.</p>
        <p>Tools like the ELK Stack (Elasticsearch, Logstash, Kibana), Splunk, Graylog, Grafana Loki, or cloud-provider services (AWS CloudWatch Logs, Google Cloud Logging, Azure Monitor Logs) are designed to aggregate logs from multiple sources (including Docker containers). They provide powerful searching, visualization, and alerting capabilities.</p>
        <p>Configuring Docker to forward logs directly to these systems usually involves setting up a specific logging driver either globally for the Docker daemon or per container using the <C>--log-driver</C> and <C>--log-opt</C> flags with <C>docker run</C>. While configuring these systems is outside the scope of this intermediate course, it&apos;s important to know they exist as the standard solution for large-scale log management.</p>
        <p>In summary, managing logs from containerized training jobs involves going past the basic <C>docker logs</C> command. Configuring your application to log to files and then using Docker volumes or bind mounts to persist these files outside the container provides a reliable way to capture and retain training history for debugging, analysis, and reproducibility. For more complex setups, you should adopt structured logging and explore centralized logging solutions.</p>
      </div>
    ),
  },
  {
    id: 'gpu-intro',
    title: 'GPU Acceleration for Training',
    subtitle: 'The container cannot see the GPU yet',
    Visual: VisualGpuBridge,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Training machine learning models, especially deep learning models, often involves significant computational effort. While CPUs can handle smaller tasks, large datasets and complex architectures demand the parallel processing power of Graphics Processing Units (GPUs) to complete training in a reasonable timeframe. Running these demanding training jobs within containers introduces a specific challenge: ensuring your containerized training script can access the host machine&apos;s powerful GPU. By default, standard Docker containers are isolated from the host&apos;s hardware.</p>
        <p>Fortunately, NVIDIA provides a solution specifically for this: the NVIDIA Container Toolkit. This toolkit extends Docker, allowing containers to access NVIDIA GPUs installed on the host system safely and efficiently. It manages the interaction between the container, the Docker runtime, and the host&apos;s NVIDIA drivers.</p>
      </div>
    ),
  },
  {
    id: 'gpu-prereq',
    title: 'Prerequisites for GPU Acceleration',
    subtitle: 'GPU, drivers, Docker, then the toolkit',
    Visual: VisualGpuPrep,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Prerequisites for GPU Acceleration</h3>
        <p>Before you can leverage GPUs within your Docker containers, your host system must meet a few requirements:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>NVIDIA GPU:</strong> You need one or more compatible NVIDIA GPUs installed on the machine where you&apos;ll run the Docker containers.</li>
          <li><strong>NVIDIA Drivers:</strong> The appropriate NVIDIA drivers for your GPU(s) and operating system must be installed correctly on the <em>host</em> system. The container will interact with these host drivers.</li>
          <li><strong>Docker Engine:</strong> A recent version of Docker must be installed.</li>
          <li><strong>NVIDIA Container Toolkit:</strong> You need to install the <R>nvidia-container-toolkit</R> package (or its predecessors like <R>nvidia-docker2</R> depending on your setup, though the toolkit is the modern standard). Installation instructions vary by Linux distribution and are available on the NVIDIA documentation website.</li>
        </ol>
      </div>
    ),
  },
  {
    id: 'gpu-toolkit',
    title: 'How the NVIDIA Container Toolkit Works',
    subtitle: 'Drivers stay on the host; libraries come from the image',
    Visual: VisualGpuToolkit,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">How the NVIDIA Container Toolkit Works</h3>
        <p>The NVIDIA Container Toolkit acts as a bridge. When you instruct Docker to run a container with GPU access, the toolkit intercepts the command. It automatically mounts the necessary NVIDIA driver libraries and GPU device files from the host system into the container&apos;s filesystem. It also ensures the container has the correct permissions to interact with the GPU hardware. This way, the application running inside the container (like TensorFlow or PyTorch) can discover and utilize the GPU just as if it were running directly on the host, but without requiring the full NVIDIA drivers to be installed <em>inside</em> the container image itself.</p>
        <p>Interaction between host components, the NVIDIA Container Toolkit, and a GPU-enabled Docker container.</p>
      </div>
    ),
  },
  {
    id: 'gpu-image',
    title: 'Building GPU-Aware Docker Images',
    subtitle: 'The base image brings CUDA; the run flag brings the device',
    Visual: VisualGpuRun,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Building GPU-Aware Docker Images</h3>
        <p>While the NVIDIA Container Toolkit handles the runtime access, your Docker image still needs the necessary software libraries to use the GPU, primarily the CUDA toolkit and potentially libraries like cuDNN. The easiest way to achieve this is by using official base images provided by NVIDIA or popular ML frameworks:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><C>nvidia/cuda:[version]-base-[os]</C> or <C>nvidia/cuda:[version]-cudnn[version]-devel-[os]</C>: These provide CUDA and cuDNN environments.</li>
          <li><C>pytorch/pytorch:[version]-cuda[version]-cudnn[version]-runtime</C>: Official PyTorch images with specific CUDA/cuDNN versions.</li>
          <li><C>tensorflow/tensorflow:[version]-gpu</C>: Official TensorFlow images built with GPU support.</li>
        </ul>
        <p>Choosing one of these as your base image in the Dockerfile significantly simplifies setup, as they come pre-packaged with compatible versions of the required GPU libraries.</p>
        <p>Here&apos;s a simple Dockerfile snippet using a TensorFlow GPU base image:</p>
        <CodeBlock>{`# Use an official TensorFlow GPU base image
FROM tensorflow/tensorflow:2.10.0-gpu

# Set the working directory
WORKDIR /app

# Copy requirements file first for layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Command to run the training script by default
CMD ["python", "train.py"]`}</CodeBlock>
        <p>This Dockerfile doesn&apos;t contain explicit instructions about the GPU itself. The base image <C>tensorflow/tensorflow:2.10.0-gpu</C> handles the inclusion of CUDA and cuDNN. The runtime configuration connects it to the host&apos;s GPU.</p>
      </div>
    ),
  },
  {
    id: 'gpu-run',
    title: 'Running Training Containers with GPU Access',
    subtitle: '--gpus all exposes every device',
    Visual: VisualGpuRun,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Running Training Containers with GPU Access</h3>
        <p>To grant a container access to the host&apos;s GPUs when you run it, you use the <C>--gpus</C> flag with the <C>docker run</C> command. This flag, managed by the NVIDIA Container Toolkit integration, tells Docker which GPUs to expose to the container.</p>
        <p>Common usage patterns for <C>--gpus</C>:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><C>--gpus all</C>: Expose all available NVIDIA GPUs to the container.</li>
          <li><C>--gpus device=0</C>: Expose only the GPU with index 0.</li>
          <li><C>--gpus device=1,2</C>: Expose GPUs with indices 1 and 2.</li>
          <li><C>--gpus &quot;device=0,1&quot;</C>: Another syntax for multiple specific GPUs.</li>
          <li><C>--gpus count=2</C>: Expose the first 2 available GPUs.</li>
        </ul>
        <p>Here&apos;s how you might run the training container built from the Dockerfile above, giving it access to all available GPUs:</p>
        <CodeBlock>{`docker run --rm --gpus all \\
  -v $(pwd)/data:/app/data \\
  -v $(pwd)/output:/app/output \\
  my-gpu-training-image:latest \\
  python train.py --data_dir /app/data --output_dir /app/output --epochs 50`}</CodeBlock>
        <p>This command:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Runs the container using <C>docker run</C>.</li>
          <li>Uses <C>--gpus all</C> to enable access to all host GPUs.</li>
          <li>Mounts local <C>./data</C> and <C>./output</C> directories using bind mounts (as covered in Chapter 3) to provide input data and store trained models/logs.</li>
          <li>Specifies the image name (<C>my-gpu-training-image:latest</C>).</li>
          <li>Overrides the default <R>CMD</R> to pass specific arguments to the training script.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'gpu-verify',
    title: 'Verifying GPU Access Inside the Container',
    subtitle: 'nvidia-smi, then the framework',
    Visual: VisualGpuCheck,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Verifying GPU Access Inside the Container</h3>
        <p>Once your container is running, you&apos;ll want to confirm it can actually see and use the GPU.</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong>Using <R>nvidia-smi</R>:</strong> The NVIDIA System Management Interface (<R>nvidia-smi</R>) utility is usually included in the NVIDIA base images. You can run it inside the container:
            <CodeBlock>docker run --rm --gpus all nvidia/cuda:11.8.0-base-ubuntu22.04 nvidia-smi</CodeBlock>
            <p>If successful, this command will print the familiar <R>nvidia-smi</R> output, listing the GPUs visible to <em>the container</em>.</p>
          </li>
          <li>
            <strong>Framework-Specific Checks:</strong> Your ML framework typically provides functions to check for GPU availability.
            <p>TensorFlow:</p>
            <CodeBlock>{`import tensorflow as tf
gpus = tf.config.list_physical_devices('GPU')
print("Num GPUs Available: ", len(gpus))
if gpus:
    try:
        # Currently, memory growth needs to be the same across GPUs
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
        print("Memory growth enabled.")
    except RuntimeError as e:
        # Memory growth must be set before GPUs have been initialized
        print(e)`}</CodeBlock>
            <p>PyTorch:</p>
            <CodeBlock>{`import torch
available = torch.cuda.is_available()
count = torch.cuda.device_count()
name = torch.cuda.get_device_name(0) if available else "N/A"
print(f"CUDA Available: \${available}")
print(f"Device Count: \${count}")
print(f"Device Name (GPU 0): \${name}")`}</CodeBlock>
          </li>
        </ol>
        <p>Running these code snippets within your container (e.g., in an interactive session or as part of your script&apos;s startup) will confirm if the framework detects the GPU passed through by Docker and the NVIDIA Container Toolkit.</p>
      </div>
    ),
  },
  {
    id: 'gpu-compose',
    title: 'Using GPUs with Docker Compose',
    subtitle: 'The service asks for one GPU',
    Visual: VisualComposeGpu,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Using GPUs with Docker Compose</h3>
        <p>If you&apos;re managing your training environment with Docker Compose (covered in more detail later), you can request GPU resources within your <C>docker-compose.yml</C> file using the <R>deploy</R> specification (available in Compose specification version 3.8+ and Docker Engine 19.03+).</p>
        <CodeBlock>{`version: '3.8'

services:
  training:
    build: .
    image: my-gpu-training-image:latest
    volumes:
      - ./data:/app/data
      - ./output:/app/output
    environment:
      - NVIDIA_VISIBLE_DEVICES=all # Optional, often handled by deploy section
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1 # Request one GPU
              # Or specify capabilities:
              # capabilities: [gpu]
              # Or specific device IDs:
              # device_ids: ['0']
    command: python train.py --data_dir /app/data --output_dir /app/output`}</CodeBlock>
        <p>This configuration requests one NVIDIA GPU for the <R>training</R> service. When you run <C>docker compose up</C>, Compose will instruct the Docker Engine to allocate the GPU resource via the NVIDIA Container Toolkit.</p>
        <p>By using the NVIDIA Container Toolkit and appropriate base images, you can integrate GPU acceleration into your containerized ML training workflows. This ensures your computationally intensive training jobs run efficiently while benefiting from the consistency and portability that Docker provides.</p>
      </div>
    ),
  },
];

export default function ContainerizingMLTrainingWorkflowsPartTwo() {
  return <ChapterDeck slides={slides} />;
}
