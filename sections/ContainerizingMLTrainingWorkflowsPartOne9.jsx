import React from 'react';
import ChapterDeck from '../components/ChapterDeck';
import CodeBlock from '../components/CodeBlock';
import {
  VisualArgparseEntrypoint,
  VisualBrittleVsFlexible,
  VisualComplexConfigYaml,
  VisualConfigHierarchy,
  VisualPathsAndLogging,
  VisualPrinciplesReady,
} from '../components/ContainerizingMLTrainingWorkflowsPartOneVisualizers';

const C = ({ children }) => <span className="font-mono text-[13px] text-teal-200">{children}</span>;
const R = ({ children }) => <span className="font-mono text-[13px] text-rose-300">{children}</span>;

export const meta = {
  title: 'Containerizing ML Training Workflows (Part 1)',
  subtitle: 'Scripts, arguments, and environment variables',
};

const slides = [
  {
    id: 'struct-intro',
    title: 'Structuring Training Scripts for Containers',
    subtitle: 'A hardcoded path breaks inside the container',
    Visual: VisualBrittleVsFlexible,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          Adapting machine learning training code to run effectively within Docker containers is essential for reliable ML deployments. While developers could simply copy an existing script into an image, treating the container environment like any other server often leads to brittle setups. Scripts hardcoding file paths or relying on specific user configurations will break when moved into the isolated, standardized environment of a container.
        </p>
        <p>
          To successfully containerize training, your scripts need to be designed or refactored with the container lifecycle and execution context in mind. This involves making them more flexible, configurable, and aware of how they receive inputs and produce outputs in a containerized setting.
        </p>
      </div>
    ),
  },
  {
    id: 'struct-principles',
    title: 'Designing for Container Execution',
    subtitle: 'Inputs, config, logs, and a fresh run',
    Visual: VisualPrinciplesReady,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Designing for Container Execution</h3>
        <p>Think of your containerized training script as a self-contained executable unit. It receives instructions and data, performs its task, and outputs results. To achieve this reliably, follow these principles:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Parameterize Inputs and Outputs:</strong> Avoid hardcoding file paths for datasets, model save locations, or configuration files within the script. These paths might differ depending on how volumes or bind mounts are configured when the container is run. Instead, the script should accept these locations as inputs.</li>
          <li><strong>Externalize Configuration:</strong> Hyperparameters, training settings (like epochs or batch size), and resource flags should not be embedded directly in the code. They should be passed to the script at runtime.</li>
          <li><strong>Standardize Logging:</strong> Direct log output to standard streams (<R>stdout</R> and <R>stderr</R>). This allows Docker&apos;s logging drivers to capture the output easily, making monitoring and debugging straightforward without requiring the script to manage log file locations explicitly.</li>
          <li><strong>Assume Statelessness (Generally):</strong> Each <C>docker run</C> command typically starts a fresh container instance. Unless you are specifically designing for incremental training using persistent volumes, your script should not rely on state left over from previous runs within the same container image. It should produce the same result given the same inputs and configuration each time it runs.</li>
        </ol>
      </div>
    ),
  },
  {
    id: 'struct-args',
    title: 'Using Command-Line Arguments',
    subtitle: 'argparse takes the paths and the learning rate',
    Visual: VisualArgparseEntrypoint,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Implementing Flexible Scripts</h3>
        <p>Let&apos;s look at practical ways to implement these principles, focusing on Python scripts, a common choice for ML training.</p>
        <h3 className="text-base font-semibold text-white">Using Command-Line Arguments</h3>
        <p>The standard way to pass parameters to a script in many environments, including Docker containers, is through command-line arguments. Python&apos;s <R>argparse</R> module is excellent for this.</p>
        <p>For example, a script that needs input data path, output model path, and learning rate.</p>
        <CodeBlock>{`# training_script.py
import argparse
import os
import pandas as pd
# Assume scikit-learn or other ML library is installed in the image
# from sklearn.linear_model import LogisticRegression

def train_model(data_path, model_path, learning_rate):
    print(f"Loading data from: \${data_path}")
    # Dummy data loading
    # df = pd.read_csv(data_path)
    print(f"Training model with learning rate: \${learning_rate}")
    # Dummy model training
    # model = LogisticRegression(C=1.0/learning_rate) # Example usage
    # model.fit(df[['feature1']], df['target'])
    print(f"Saving model to: \${model_path}")
    # Ensure output directory exists if necessary
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    # Dummy model saving
    with open(model_path, 'w') as f:
        f.write(f"dummy model trained with lr=\${learning_rate}")
    print("Training complete.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train a simple ML model.")

    parser.add_argument('--data-path',
                        type=str,
                        required=True,
                        help='Path to the input training data file (e.g., /data/train.csv)')

    parser.add_argument('--model-path',
                        type=str,
                        required=True,
                        help='Path to save the trained model artifact (e.g., /output/model.pkl)')

    parser.add_argument('--lr',
                        type=float,
                        default=0.01,
                        help='Learning rate for training.')

    args = parser.parse_args()

    train_model(args.data_path, args.model_path, args.lr)`}</CodeBlock>
      </div>
    ),
  },
  {
    id: 'struct-entrypoint',
    title: 'CMD and ENTRYPOINT',
    subtitle: 'The script runs, then the flags follow',
    Visual: VisualArgparseEntrypoint,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>When building your Docker image, you would typically set the <R>ENTRYPOINT</R> or <R>CMD</R> to execute this script. For example, in your Dockerfile:</p>
        <CodeBlock>{`# ... (Base image, dependencies installation) ...

WORKDIR /app
COPY training_script.py .

# Option 1: Using CMD (allows overriding the command easily)
# CMD ["python", "training_script.py"]
# User would supply arguments like: docker run my-image --data-path /data/input.csv --model-path /output/final_model.pkl --lr 0.005

# Option 2: Using ENTRYPOINT (makes the container behave like the script executable)
ENTRYPOINT ["python", "training_script.py"]
# User supplies arguments directly: docker run my-image --data-path /data/input.csv --model-path /output/final_model.pkl --lr 0.005`}</CodeBlock>
        <p>
          By using <R>argparse</R>, the script clearly defines its required inputs and how to provide them. Running the container then involves passing these arguments after the image name, mapping host directories or volumes to the expected container paths (like <C>/data</C> and <C>/output</C>).
        </p>
      </div>
    ),
  },
  {
    id: 'struct-env',
    title: 'Using Environment Variables',
    subtitle: 'The script reads os.environ',
    Visual: VisualConfigHierarchy,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Using Environment Variables</h3>
        <p>Environment variables offer another way to pass configuration, often suitable for settings like API keys, database connection strings, or flags that might be sensitive or differ across deployment environments (dev, staging, prod). Python&apos;s <R>os</R> module can access them.</p>
        <CodeBlock>{`# training_script_env.py
import os
import argparse

def load_config():
    config = {}
    # Get paths from environment variables, fall back to defaults or raise error
    config['data_path'] = os.environ.get('TRAINING_DATA_PATH')
    config['model_path'] = os.environ.get('MODEL_OUTPUT_PATH')

    if not config['data_path'] or not config['model_path']:
        raise ValueError("Missing required environment variables: TRAINING_DATA_PATH, MODEL_OUTPUT_PATH")

    # Get hyperparameters from environment variables, with defaults
    config['learning_rate'] = float(os.environ.get('LEARNING_RATE', 0.01))
    config['epochs'] = int(os.environ.get('EPOCHS', 10))

    return config

def train_model(config):
    print(f"Loading data from: \${config['data_path']}")
    print(f"Training model with learning rate: \${config['learning_rate']} for \${config['epochs']} epochs.")
    print(f"Saving model to: \${config['model_path']}")
    # ... (rest of training logic) ...
    print("Training complete.")

if __name__ == "__main__":
    # You might still use argparse for things less likely to change via env vars,
    # or just rely purely on environment variables.
    # parser = argparse.ArgumentParser()
    # parser.add_argument('--some-other-arg', default='value')
    # args = parser.parse_args()

    configuration = load_config()
    train_model(configuration)`}</CodeBlock>
      </div>
    ),
  },
  {
    id: 'struct-env-run',
    title: 'Passing variables with docker run',
    subtitle: '-e sets them, -v brings the files',
    Visual: VisualConfigHierarchy,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>You would then run the container passing the environment variables using the <C>-e</C> or <C>--env</C> flag:</p>
        <CodeBlock>{`docker run \\
  -e TRAINING_DATA_PATH=/data/train.csv \\
  -e MODEL_OUTPUT_PATH=/output/model.joblib \\
  -e LEARNING_RATE=0.005 \\
  -e EPOCHS=50 \\
  -v /path/on/host/data:/data \\
  -v /path/on/host/models:/output \\
  my-training-image
# Assumes the image's CMD or ENTRYPOINT runs training_script_env.py`}</CodeBlock>
      </div>
    ),
  },
  {
    id: 'struct-choose',
    title: 'Arguments or Environment Variables',
    subtitle: 'A run flag, or a setting that stays',
    Visual: VisualComplexConfigYaml,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Choosing between Arguments and Environment Variables:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Arguments:</strong> Often better for things directly related to a specific run, like file paths or primary hyperparameters that frequently change between experiments. They are explicit in the <C>docker run</C> command.</li>
          <li><strong>Environment Variables:</strong> Good for configuration that might be consistent across several runs or differs between environments (dev/prod), like database credentials, API endpoints, or fixed configuration paths expected by company standards. They can also be loaded from files (<C>--env-file</C>).</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'struct-paths',
    title: 'Handling File Paths Correctly',
    subtitle: 'Use the path, join it, then make the directory',
    Visual: VisualPathsAndLogging,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Handling File Paths Correctly</h3>
        <p>Regardless of whether paths are passed via arguments or environment variables, the script needs to use them correctly.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Use the Provided Paths:</strong> Always reference data and output locations using the variables populated from arguments or environment variables.</li>
          <li><strong>Join Paths Safely:</strong> If constructing sub-paths (e.g., for logs or checkpoints within an output directory), use <R>os.path.join()</R> to ensure cross-platform compatibility (though less critical inside a Linux container, it&apos;s good practice).</li>
          <li><strong>Create Output Directories:</strong> The directory specified for saving models or logs might not exist, especially when mapping volumes. Use <R>os.makedirs(path, exist_ok=True)</R> before writing files to ensure the target directory is present.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'struct-logs',
    title: 'Logging to Standard Streams',
    subtitle: 'The lines leave through stdout',
    Visual: VisualPathsAndLogging,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Logging to Standard Streams</h3>
        <p>Configure Python&apos;s standard <R>logging</R> module (or just use <R>print</R> for simple cases) to output messages. Avoid configuring file handlers within the script unless absolutely necessary.</p>
        <CodeBlock>{`import logging
import sys

# Configure basic logging to stdout
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    stream=sys.stdout) # Explicitly direct to stdout

# Use the logger
logging.info("Starting training process...")
# ... perform training steps ...
logging.warning("Encountered a minor issue...")
logging.info("Training finished.")`}</CodeBlock>
        <p>Docker automatically captures <R>stdout</R> and <R>stderr</R>, making these logs accessible via <C>docker logs &lt;container_id&gt;</C>.</p>
        <p>
          By structuring your training scripts according to these principles, you create code that is portable, configurable, and integrates smoothly with Docker&apos;s mechanisms for data management and execution. This forms the foundation for building reproducible and scalable ML training workflows using containers, which we will build upon in subsequent sections discussing configuration, execution, and GPU usage.
        </p>
      </div>
    ),
  },
  {
    id: 'config-intro',
    title: 'Passing Configuration and Hyperparameters',
    subtitle: 'The image stays fixed, the run changes',
    Visual: VisualConfigHierarchy,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          Packaging a training environment into a Docker image helps standardize deployments. A primary challenge that follows is effectively running specific training jobs without constant modifications to the image for every experiment. Embedding values such as learning rates, dataset paths, or the number of training epochs directly into scripts hinders reuse and reproducibility. The objective is to manage the container image as an immutable artifact, providing configuration from an external source for each distinct training run.
        </p>
        <p>There are two primary mechanisms for passing configuration parameters into a Docker container when you start it: environment variables and command-line arguments. Let&apos;s examine how to use these effectively for ML training workflows.</p>
      </div>
    ),
  },
  {
    id: 'config-env-default',
    title: 'Defining Defaults in the Dockerfile',
    subtitle: 'ENV stamps a path onto the image',
    Visual: VisualConfigHierarchy,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Using Environment Variables</h3>
        <p>Environment variables are key-value pairs that exist within the container&apos;s operating environment. They are a standard way to provide configuration details to applications running inside containers.</p>
        <p><strong>Defining Defaults in the Dockerfile</strong></p>
        <p>You can set default values for environment variables directly in your Dockerfile using the <R>ENV</R> instruction. This is useful for setting sensible defaults or defining paths that are standard within the container&apos;s structure.</p>
        <CodeBlock>{`# Base image (e.g., Python or a framework-specific image)
FROM python:3.9-slim

# Set a default path for training data within the container
ENV TRAINING_DATA_PATH=/data/train.csv
ENV MODEL_OUTPUT_DIR=/output

# Copy application code
WORKDIR /app
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Default command (assuming train.py reads environment variables)
CMD ["python", "train.py"]`}</CodeBlock>
      </div>
    ),
  },
  {
    id: 'config-env-override',
    title: 'Overriding Defaults at Runtime',
    subtitle: '-e replaces the path for this run',
    Visual: VisualConfigHierarchy,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p><strong>Overriding Defaults at Runtime</strong></p>
        <p>The real flexibility comes from overriding these defaults or providing new environment variables when you launch the container using the <C>-e</C> or <C>--env</C> flag with <C>docker run</C>.</p>
        <CodeBlock>{`# Run training using the default data path
docker run my_training_image

# Run training, specifying a different data path
docker run -e TRAINING_DATA_PATH=/data/augmented_train.csv my_training_image

# Specify multiple variables, including one not defined in the Dockerfile
docker run \\
  -e TRAINING_DATA_PATH=/data/subset_train.csv \\
  -e MODEL_OUTPUT_DIR=/models/run123 \\
  -e LEARNING_RATE=0.001 \\
  my_training_image`}</CodeBlock>
      </div>
    ),
  },
  {
    id: 'config-getenv',
    title: 'Accessing Environment Variables in Python',
    subtitle: 'os.getenv reads them at the start',
    Visual: VisualConfigHierarchy,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p><strong>Accessing Environment Variables in Python</strong></p>
        <p>Inside your Python training script, you can access these environment variables using the <R>os</R> module. It&apos;s good practice to retrieve these values at the beginning of your script.</p>
        <CodeBlock>{`import os
import argparse

# --- Configuration ---
# Get paths from environment variables, providing defaults if not set
data_path = os.getenv('TRAINING_DATA_PATH', '/data/train.csv') # Default fallback
model_dir = os.getenv('MODEL_OUTPUT_DIR', '/output')
# Get hyperparameters from environment variables (can also use argparse)
learning_rate = float(os.getenv('LEARNING_RATE', 0.01)) # Default fallback
epochs = int(os.getenv('EPOCHS', 10)) # Default fallback

print(f"--- Training Configuration ---")
print(f"Data Path: \${data_path}")
print(f"Model Output Directory: \${model_dir}")
print(f"Learning Rate: \${learning_rate}")
print(f"Epochs: \${epochs}")
print(f"---------------------------------")

# --- Placeholder for actual training logic ---
# Load data from data_path
# Train model using learning_rate, epochs
# Save model to model_dir
print("Simulating model training...")
# --- End Placeholder ---

print("Training finished.")`}</CodeBlock>
        <p>Environment variables are well-suited for configuration parameters like file paths, API keys (handle secrets carefully, perhaps using Docker secrets or managed services in production), or simple flags and settings.</p>
      </div>
    ),
  },
  {
    id: 'config-args',
    title: 'Using Command-Line Arguments',
    subtitle: 'argparse can fall back to the environment',
    Visual: VisualConfigHierarchy,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Using Command-Line Arguments</h3>
        <p>Another common way to configure applications is through command-line arguments passed when the program starts. This method is particularly effective for parameters that define a specific experiment, like hyperparameters.</p>
        <p><strong>Designing Scripts to Accept Arguments</strong></p>
        <p>Your training script needs to be designed to parse arguments passed to it. Python&apos;s built-in <R>argparse</R> module is excellent for this.</p>
        <CodeBlock>{`import os
import argparse
# --- Argument Parsing ---
parser = argparse.ArgumentParser(description='ML Model Training Script')

# Define command-line arguments
parser.add_argument('--data-path', type=str, default=os.getenv('TRAINING_DATA_PATH', '/data/train.csv'),
                    help='Path to the training data file')
parser.add_argument('--model-dir', type=str, default=os.getenv('MODEL_OUTPUT_DIR', '/output'),
                    help='Directory to save the trained model')
parser.add_argument('--learning-rate', type=float, default=float(os.getenv('LEARNING_RATE', 0.01)),
                    help='Learning rate for the optimizer')
parser.add_argument('--epochs', type=int, default=int(os.getenv('EPOCHS', 10)),
                    help='Number of training epochs')

# Parse the arguments
args = parser.parse_args()

print(f"--- Training Configuration (via ArgParse) ---")
print(f"Data Path: \${args.data_path}")
print(f"Model Output Directory: \${args.model_dir}")
print(f"Learning Rate: \${args.learning_rate}")
print(f"Epochs: \${args.epochs}")
print(f"---------------------------------------------")

# --- Placeholder for actual training logic ---
# Load data from args.data_path
# Train model using args.learning_rate, args.epochs
# Save model to args.model_dir
print("Simulating model training...")
# --- End Placeholder ---

print("Training finished.")`}</CodeBlock>
        <p>Notice how we can combine methods: <R>argparse</R> can define default values fetched from environment variables, providing flexibility.</p>
      </div>
    ),
  },
  {
    id: 'config-run-args',
    title: 'Passing Arguments via docker run',
    subtitle: 'The flags sit after the image name',
    Visual: VisualConfigHierarchy,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p><strong>Passing Arguments via <C>docker run</C></strong></p>
        <p>To pass command-line arguments to the script inside the container, you simply append them to your <C>docker run</C> command after the image name. These arguments are passed to the container&apos;s <R>ENTRYPOINT</R> or <R>CMD</R>.</p>
        <p>Assuming your Dockerfile has an <R>ENTRYPOINT</R> like:</p>
        <CodeBlock>{`# ... (rest of Dockerfile)
ENTRYPOINT ["python", "train.py"]`}</CodeBlock>
        <p>Or a <R>CMD</R> (though <R>ENTRYPOINT</R> is often preferred for scripts):</p>
        <CodeBlock>{`# ... (rest of Dockerfile)
CMD ["python", "train.py"]`}</CodeBlock>
        <p>You would run it like this:</p>
        <CodeBlock>{`# Run training with specific hyperparameters
docker run my_training_image \\
  --learning-rate 0.005 \\
  --epochs 25 \\
  --data-path /data/processed_features.pkl \\
  --model-dir /output/experiment_abc`}</CodeBlock>
        <p>These arguments (<C>--learning-rate 0.005</C>, etc.) are appended to the <R>ENTRYPOINT</R> (or override the <R>CMD</R>) and parsed by <R>argparse</R> within your <C>train.py</C> script.</p>
      </div>
    ),
  },
  {
    id: 'config-choose',
    title: 'Choosing the Right Method',
    subtitle: 'Context on the environment, task on the command',
    Visual: VisualComplexConfigYaml,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Choosing the Right Method</h3>
        <p>Both environment variables and command-line arguments are valid ways to pass configuration. Here&apos;s a general guideline:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Environment Variables</strong> (<C>ENV</C>, <C>-e</C>): Better suited for environment-specific settings (like paths that might differ between dev, staging, prod), secrets (though dedicated secret management is better), or configurations that are less likely to change with every single training run. They define the <em>context</em> in which the script runs.</li>
          <li><strong>Command-Line Arguments</strong> (<C>docker run ... &lt;args&gt;</C>): Ideal for parameters specific to a particular execution or experiment, such as hyperparameters (<C>learning_rate</C>, <C>batch_size</C>), run identifiers, or flags controlling script behavior (<C>--evaluate-only</C>). They define the <em>task</em> the script should perform.</li>
        </ul>
        <p>Using command-line arguments often makes the purpose of a specific <C>docker run</C> command clearer, as the experimental parameters are explicitly listed.</p>
      </div>
    ),
  },
  {
    id: 'config-file',
    title: 'Handling Complex Configurations',
    subtitle: 'Mount the file, pass its path',
    Visual: VisualComplexConfigYaml,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Handling Complex Configurations</h3>
        <p>For intricate configurations involving nested parameters or long lists, passing everything via environment variables or command-line arguments can become cumbersome. A common pattern is to use a configuration file (e.g., <C>config.yaml</C> or <C>params.json</C>).</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Create a configuration file on your host machine.</li>
          <li>Mount the file into the container using a bind mount (Chapter 3).</li>
          <li>Pass the path to the configuration file inside the container using an environment variable or a command-line argument.</li>
          <li>Modify your script to load and parse this configuration file.</li>
        </ol>
        <CodeBlock>{`# Example: Mount config.yaml and tell the script where to find it
docker run -v $(pwd)/config.yaml:/app/config.yaml \\
  my_training_image --config /app/config.yaml`}</CodeBlock>
        <p>Your Python script would then use libraries like <R>PyYAML</R> or <R>json</R> to load <C>/app/config.yaml</C>.</p>
        <p>
          By externalizing configuration using environment variables, command-line arguments, or mounted configuration files, you create flexible and reusable training containers. This separation allows you to run numerous experiments with different parameters using the exact same Docker image, significantly improving the reproducibility and manageability of your ML training workflows.
        </p>
      </div>
    ),
  },
];

export default function ContainerizingMLTrainingWorkflowsPartOne() {
  return <ChapterDeck slides={slides} />;
}
