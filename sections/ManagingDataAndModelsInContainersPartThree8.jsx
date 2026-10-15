import React from 'react';
import ChapterDeck from '../components/ChapterDeck';
import CodeBlock from '../components/CodeBlock';
import {
  VisualBindPractice,
  VisualBindVerify,
  VisualBuildPractice,
  VisualCleanupPractice,
  VisualDatasetFile,
  VisualKeepOutside,
  VisualPracticeImage,
  VisualSeedVolume,
  VisualTrainScript,
  VisualVolumePractice,
} from '../components/ManagingDataAndModelsPartThreeVisualizers';

const C = ({ children }) => <span className="font-mono text-[13px] text-teal-200">{children}</span>;
const R = ({ children }) => <span className="font-mono text-[13px] text-rose-300">{children}</span>;

export const meta = {
  title: 'Managing Data and Models in Containers (Part 3)',
  subtitle: 'Mount a dataset, train, and save the model',
};

const slides = [
  {
    id: 'hands-on-intro',
    title: 'Hands-on practical: Mounting Datasets and Saving Models',
    subtitle: 'Data and the model stay out of the image',
    Visual: VisualKeepOutside,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          This hands-on exercise applies bind mounts and Docker volumes to a common Machine Learning workflow: training a simple model using a dataset from the host machine and saving the resulting model artifact back to the host or a persistent volume.
        </p>
        <p>
          We&apos;ll work through a scenario where you have a dataset locally and a Python script designed to train a model. Our goal is to run this script inside a container, feeding it the data and retrieving the trained model without permanently embedding either within the container image itself.
        </p>
      </div>
    ),
  },
  {
    id: 'prereq-data',
    title: 'Prerequisites',
    subtitle: 'Docker, plus a small data.csv',
    Visual: VisualDatasetFile,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Prerequisites</h3>
        <p>Before starting, ensure you have:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Docker Desktop or Docker Engine installed and running.</strong></li>
          <li>
            <strong>A simple dataset file.</strong> Create a file named <R>data.csv</R> in a local directory (e.g., <C>project/data</C>) with the following content:
            <CodeBlock>{`feature1,feature2,target
1.0,2.0,0
1.5,2.5,0
3.0,4.0,1
3.5,4.5,1`}</CodeBlock>
          </li>
        </ol>
      </div>
    ),
  },
  {
    id: 'train-script',
    title: 'The training script',
    subtitle: 'Read a data path, write a model path',
    Visual: VisualTrainScript,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          <strong>3. A basic Python training script.</strong> Create a file named <R>train.py</R> in your project directory (e.g., <C>project/train.py</C>):
        </p>
        <CodeBlock>{`import argparse
import pandas as pd
from sklearn.linear_model import LogisticRegression
import joblib
import os

# Set up argument parser
parser = argparse.ArgumentParser(description='Simple scikit-learn model training script.')
parser.add_argument('--data_path', type=str, required=True, help='Path to the input CSV dataset.')
parser.add_argument('--model_dir', type=str, required=True, help='Directory to save the trained model.')

# Parse arguments
args = parser.parse_args()

# Ensure model directory exists
os.makedirs(args.model_dir, exist_ok=True)
model_save_path = os.path.join(args.model_dir, 'model.joblib')

print(f"Loading data from: \${args.data_path}")
try:
    # Load data
    df = pd.read_csv(args.data_path)
    X = df[['feature1', 'feature2']]
    y = df['target']

    # Train a simple model
    print("Training model...")
    model = LogisticRegression()
    model.fit(X, y)

    # Save the model
    print(f"Saving model to: \${model_save_path}")
    joblib.dump(model, model_save_path)

    print("Training complete and model saved.")

except FileNotFoundError:
    print(f"Error: Data file not found at \${args.data_path}")
    exit(1)
except Exception as e:
    print(f"An error occurred: \${e}")
    exit(1)`}</CodeBlock>
      </div>
    ),
  },
  {
    id: 'dockerfile',
    title: 'The Dockerfile',
    subtitle: 'Python, libraries, and train.py',
    Visual: VisualPracticeImage,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          <strong>4. A Dockerfile.</strong> Create a file named <R>Dockerfile</R> in your project directory (e.g., <C>project/Dockerfile</C>):
        </p>
        <CodeBlock>{`# Use a standard Python base image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Install necessary Python libraries
RUN pip install --no-cache-dir scikit-learn==1.0.2 pandas==1.3.5 joblib==1.1.0

# Copy the training script into the container
COPY train.py .

# Define the entrypoint for the container
ENTRYPOINT ["python", "train.py"]`}</CodeBlock>
        <p>Your project directory should look something like this:</p>
        <CodeBlock>{`project/
├── Dockerfile
├── train.py
└── data/
    └── data.csv`}</CodeBlock>
      </div>
    ),
  },
  {
    id: 'build-image',
    title: 'Building the Docker Image',
    subtitle: 'Tag it ml-data-practice',
    Visual: VisualBuildPractice,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Building the Docker Image</h3>
        <p>First, navigate to your project directory in your terminal and build the Docker image:</p>
        <CodeBlock>{`cd /path/to/project
docker build -t ml-data-practice .`}</CodeBlock>
        <p>
          This command builds an image tagged <R>ml-data-practice</R> based on your <R>Dockerfile</R>, including Python, required libraries, and the <R>train.py</R> script.
        </p>
      </div>
    ),
  },
  {
    id: 'bind-run',
    title: 'Method 1: Using Bind Mounts',
    subtitle: 'Host data and models appear inside',
    Visual: VisualBindPractice,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Method 1: Using Bind Mounts</h3>
        <p>Bind mounts directly map a directory from your host machine into the container. This is often convenient during development as changes on the host are immediately reflected inside the container.</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong>Create an output directory:</strong> On your host machine, create a directory where the model will be saved, for example, <C>project/models</C>.
            <CodeBlock>mkdir /path/to/project/models</CodeBlock>
          </li>
          <li>
            <strong>Run the container with bind mounts:</strong> Execute the training script within the container, mounting the local <R>data</R> directory to <C>/app/data</C> inside the container and the local <R>models</R> directory to <C>/app/output</C> inside the container.
            <CodeBlock>{`docker run --rm \\
  -v "$(pwd)/data":/app/data \\
  -v "$(pwd)/models":/app/output \\
  ml-data-practice \\
  --data_path /app/data/data.csv \\
  --model_dir /app/output`}</CodeBlock>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><C>--rm</C>: Automatically removes the container when it exits.</li>
              <li><C>-v &quot;$(pwd)/data&quot;:/app/data</C>: Mounts the <R>data</R> subdirectory from your current working directory (host) to <C>/app/data</C> (container).</li>
              <li><C>-v &quot;$(pwd)/models&quot;:/app/output</C>: Mounts the <R>models</R> subdirectory from your current working directory (host) to <C>/app/output</C> (container).</li>
              <li><C>ml-data-practice</C>: The name of the image to use.</li>
              <li><C>--data_path /app/data/data.csv</C>: Argument passed to <R>train.py</R>, specifying the path <em>inside the container</em> where the data file is mounted.</li>
              <li><C>--model_dir /app/output</C>: Argument passed to <R>train.py</R>, specifying the path <em>inside the container</em> where the model should be saved.</li>
            </ul>
          </li>
        </ol>
      </div>
    ),
  },
  {
    id: 'bind-verify',
    title: 'Verify the bind-mount output',
    subtitle: 'model.joblib is on the host',
    Visual: VisualBindVerify,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          <strong>3. Verify the output:</strong> After the container finishes, check your local <C>project/models</C> directory. You should find the <R>model.joblib</R> file saved there.
        </p>
        <CodeBlock>{`ls /path/to/project/models
# Output should include: model.joblib`}</CodeBlock>
        <p>
          Bind mounts provide a direct link between the host and container, making data access straightforward for local development. However, they create a dependency on the host&apos;s file structure and can sometimes lead to permission issues depending on the operating system and user configurations.
        </p>
      </div>
    ),
  },
  {
    id: 'volume-seed',
    title: 'Method 2: Using Docker Volumes',
    subtitle: 'Create two volumes, then copy the CSV in',
    Visual: VisualSeedVolume,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Method 2: Using Docker Volumes</h3>
        <p>Docker volumes are managed by Docker itself and are the preferred way to handle persistent data in containers, especially in production or when you want to decouple the data lifecycle from the host machine.</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong>Create Docker volumes:</strong> We need one volume for the input data and another for the output model.
            <CodeBlock>{`docker volume create ml-input-data
docker volume create ml-output-models`}</CodeBlock>
          </li>
          <li>
            <strong>Populate the input volume:</strong> Unlike bind mounts, volumes don&apos;t automatically see host files. We need to copy our dataset into the <R>ml-input-data</R> volume. A common way is using a temporary helper container:
            <CodeBlock>{`docker run --rm \\
  -v ml-input-data:/volume_data \\
  -v "$(pwd)/data":/host_data \\
  alpine \\
  cp /host_data/data.csv /volume_data/`}</CodeBlock>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>This command runs a lightweight <R>alpine</R> container.</li>
              <li>It mounts our new <R>ml-input-data</R> volume to <C>/volume_data</C>.</li>
              <li>It <em>also</em> bind mounts our local <R>data</R> directory to <C>/host_data</C>.</li>
              <li>The <R>cp</R> command copies the dataset from the host bind mount path to the volume path <em>inside this temporary container</em>. Once the container exits (<C>--rm</C>), the data persists in the <R>ml-input-data</R> volume.</li>
            </ul>
          </li>
        </ol>
      </div>
    ),
  },
  {
    id: 'volume-train',
    title: 'Train and verify with volumes',
    subtitle: 'The model is in the volume, not on the host',
    Visual: VisualVolumePractice,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          <strong>3. Run the container with volumes:</strong> Now, run the training container, mounting the Docker volumes.
        </p>
        <CodeBlock>{`docker run --rm \\
  -v ml-input-data:/app/data \\
  -v ml-output-models:/app/output \\
  ml-data-practice \\
  --data_path /app/data/data.csv \\
  --model_dir /app/output`}</CodeBlock>
        <ul className="list-disc pl-5 space-y-1">
          <li><C>-v ml-input-data:/app/data</C>: Mounts the Docker volume <R>ml-input-data</R> to <C>/app/data</C> inside the container.</li>
          <li><C>-v ml-output-models:/app/output</C>: Mounts the Docker volume <R>ml-output-models</R> to <C>/app/output</C> inside the container.</li>
        </ul>
        <p>
          <strong>4. Verify the output:</strong> The model is now saved inside the <R>ml-output-models</R> volume, not directly on your host filesystem. To verify, you can inspect the volume&apos;s contents using another temporary container:
        </p>
        <CodeBlock>{`docker run --rm \\
  -v ml-output-models:/volume_data \\
  alpine \\
  ls /volume_data`}</CodeBlock>
        <ul className="list-disc pl-5 space-y-1">
          <li>This command mounts the <R>ml-output-models</R> volume to <C>/volume_data</C> in a temporary <R>alpine</R> container and lists its contents. You should see <R>model.joblib</R>.</li>
        </ul>
        <p>
          Volumes provide better isolation and are managed by Docker, making them more portable and less prone to host-specific issues. The initial step of populating the volume adds a bit more complexity compared to bind mounts.
        </p>
      </div>
    ),
  },
  {
    id: 'cleanup',
    title: 'Cleaning Up (Optional)',
    subtitle: 'Drop the volumes and the image',
    Visual: VisualCleanupPractice,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Cleaning Up (Optional)</h3>
        <p>You can remove the Docker volumes if you no longer need them:</p>
        <CodeBlock>docker volume rm ml-input-data ml-output-models</CodeBlock>
        <p>You can also remove the Docker image:</p>
        <CodeBlock>docker image rm ml-data-practice</CodeBlock>
        <p>
          This practical exercise demonstrated how to use both bind mounts and Docker volumes to supply input data to a containerized ML script and retrieve the output model artifact. Choosing between them depends on your specific needs: bind mounts offer convenience for development by directly linking to host files, while volumes provide persistence suitable for more structured workflows and deployment scenarios. Understanding how to manage data is key to containerizing ML applications.
        </p>
      </div>
    ),
  },
];

export default function ManagingDataAndModelsPartThree() {
  return <ChapterDeck slides={slides} />;
}
