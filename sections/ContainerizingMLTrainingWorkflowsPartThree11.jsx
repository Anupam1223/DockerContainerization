import React from 'react';
import ChapterDeck from '../components/ChapterDeck';
import CodeBlock from '../components/CodeBlock';
import {
  VisualBuild,
  VisualComposeDiagram,
  VisualComposeExplain,
  VisualComposeFile,
  VisualComposeLifecycle,
  VisualComposeOps,
  VisualFourNeeds,
  VisualLayers,
  VisualManyRuns,
  VisualPin,
  VisualPrereqs,
  VisualRunTrain,
  VisualShareStack,
  VisualSummarySteps,
  VisualTrainLogs,
  VisualTrainScript,
  VisualTree,
  VisualVerifyModel,
} from '../components/ContainerizingMLTrainingWorkflowsPartThreeVisualizers';

const C = ({ children }) => <span className="font-mono text-[13px] text-teal-200">{children}</span>;
const R = ({ children }) => <span className="font-mono text-[13px] text-rose-300">{children}</span>;

export const meta = {
  title: 'Containerizing ML Training Workflows (Part 3)',
  subtitle: 'Compose stacks and a training script',
};

const slides = [
  {
    id: 'compose-intro',
    title: 'Introduction to Docker Compose for Training Stacks',
    subtitle: 'One file describes the whole stack',
    Visual: VisualManyRuns,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Running individual training jobs using <C>docker run</C> offers significant benefits for reproducibility. However, many machine learning workflows involve more than just a single training script container. You might need a database to fetch training data or log metrics, a message queue to trigger jobs, or perhaps a separate service to manage experiment configurations. Managing the lifecycle, networking, and data persistence for multiple interconnected containers using only <C>docker run</C> commands quickly becomes cumbersome and error-prone.</p>
        <p>This is where Docker Compose comes into play. Docker Compose is a tool specifically designed for defining and running multi-container Docker applications. Instead of issuing complex <C>docker run</C> commands for each container, you describe your entire application stack, including its services, networks, and volumes, in a single declarative YAML file, typically named <R>docker-compose.yml</R>.</p>
      </div>
    ),
  },
  {
    id: 'compose-needs',
    title: 'Defining Multi-Container Training Environments',
    subtitle: 'Config, data, training, then the results',
    Visual: VisualFourNeeds,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Defining Multi-Container Training Environments</h3>
        <p>Think of a scenario where your training script needs to:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Read hyperparameters from a configuration file served by a simple web service.</li>
          <li>Fetch training data identifiers from a database.</li>
          <li>Run the training process itself.</li>
          <li>Write output metrics and model artifacts back to a shared volume or perhaps log them to the database.</li>
        </ol>
        <p>Attempting to orchestrate this with individual <C>docker run</C> commands would involve manually setting up networks for communication, managing container startup order, and handling volume mounts consistently across containers. Docker Compose simplifies this significantly.</p>
      </div>
    ),
  },
  {
    id: 'compose-ops',
    title: 'What Compose handles',
    subtitle: 'A shared network, volumes, then up and down',
    Visual: VisualComposeOps,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>With Compose, you define each component (the training script container, the database container, the configuration service container) as a separate service within the <R>docker-compose.yml</R> file. Compose handles the underlying Docker operations, such as:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Creating a shared network:</strong> Services defined in the same Compose file are automatically placed on a shared network, allowing them to easily discover and communicate with each other using their service names as hostnames.</li>
          <li><strong>Managing volumes:</strong> You can define volumes within the Compose file and attach them to the relevant services, ensuring data persistence and sharing.</li>
          <li><strong>Orchestrating startup and shutdown:</strong> Commands like <C>docker-compose up</C> start all defined services in the correct dependency order (if specified), and <C>docker-compose down</C> stops and removes them cleanly.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'compose-file',
    title: 'A Basic Example Structure',
    subtitle: 'training builds locally; db is Postgres',
    Visual: VisualComposeFile,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">A Basic Example Structure</h3>
        <p>For example, a simplified training setup involving just the training container and a PostgreSQL database for logging results. A <R>docker-compose.yml</R> file might look something like this:</p>
        <CodeBlock>{`version: '3.8' # Specifies the Compose file version

services:
  # Service for the training script
  training:
    build: . # Instructs Compose to build an image from the Dockerfile in the current directory
    volumes:
      - ./data:/app/data # Mount local data directory into the container
      - model_output:/app/output # Mount a named volume for model output
    environment:
      - DB_HOST=db # Use the service name 'db' as the hostname
      - DB_NAME=training_logs
      - DB_USER=trainer
      - DB_PASSWORD=secretpass
    depends_on: # Ensures the database starts before the training service
      - db
    # command: python train.py --config /app/config.yaml # Optional command override

  # Service for the PostgreSQL database
  db:
    image: postgres:14-alpine # Use a pre-built PostgreSQL image
    volumes:
      - db_data:/var/lib/postgresql/data # Mount a named volume for persistent DB data
    environment:
      - POSTGRES_DB=training_logs
      - POSTGRES_USER=trainer
      - POSTGRES_PASSWORD=secretpass

# Define named volumes for persistent storage
volumes:
  db_data:
  model_output:`}</CodeBlock>
      </div>
    ),
  },
  {
    id: 'compose-explain',
    title: 'How the example fits together',
    subtitle: 'db starts first; training reaches it by name',
    Visual: VisualComposeExplain,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>In this example:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>We define two <R>services</R>: <R>training</R> and <R>db</R>.</li>
          <li>The <R>training</R> service builds its image using a local <R>Dockerfile</R>.</li>
          <li>The <R>db</R> service uses a public <R>postgres</R> image.</li>
          <li><R>volumes</R> are used for input data (<R>./data</R> bind mount), output models (<R>model_output</R> named volume), and persistent database storage (<R>db_data</R> named volume).</li>
          <li><R>environment</R> variables configure both services, notably providing the database connection details to the <R>training</R> service. The <R>DB_HOST</R> is set to <R>db</R>, the service name of the PostgreSQL container, which Compose makes resolvable on the internal network.</li>
          <li><R>depends_on</R> ensures the <R>db</R> service is started before the <R>training</R> service attempts to connect.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'compose-diagram',
    title: 'Services on one network',
    subtitle: 'training talks to db; volumes keep the data',
    Visual: VisualComposeDiagram,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Diagram illustrating services defined in a <R>docker-compose.yml</R> file. Services like <R>training</R> and <R>db</R> communicate over a shared network, managed by Compose. Volumes (<R>model_output</R>, <R>db_data</R>) provide persistent storage. An optional configuration service is also shown.</p>
      </div>
    ),
  },
  {
    id: 'compose-up',
    title: 'Running the Training Stack',
    subtitle: 'up --build starts it; down removes the containers',
    Visual: VisualComposeLifecycle,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Running the Training Stack</h3>
        <p>With the <R>docker-compose.yml</R> file defined, starting the entire stack is as simple as running:</p>
        <CodeBlock>docker-compose up --build</CodeBlock>
        <p>The <R>--build</R> flag tells Compose to build the image for the <R>training</R> service before starting the containers. If the image already exists and the <R>Dockerfile</R> or its context hasn&apos;t changed, Compose will reuse the existing image unless <R>--build</R> is specified.</p>
        <p>To stop and remove the containers, network, and potentially the volumes defined in the Compose file, you use:</p>
        <CodeBlock>docker-compose down</CodeBlock>
      </div>
    ),
  },
  {
    id: 'compose-share',
    title: 'Compose for local stacks',
    subtitle: 'The same file can start the stack again',
    Visual: VisualShareStack,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Using Docker Compose significantly simplifies the management of multi-container setups common in more developed ML training pipelines. It provides a standardized way to define and share development or testing environments that closely mirror aspects of production deployments, enhancing reproducibility. While powerful orchestration systems like Kubernetes are often used for large-scale distributed training, Docker Compose is an invaluable tool for local development, testing, and managing moderately complex training stacks. The following sections will detail specific techniques for containerizing training scripts and handling associated aspects like configuration and GPU usage.</p>
      </div>
    ),
  },
  {
    id: 'hands-intro',
    title: 'Hands-on practical: Containerize and Run a Training Script',
    subtitle: 'Script, image, then bind mounts for data and the model',
    Visual: VisualPrereqs,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Containerize a simple machine learning training script, build a Docker image for it, and execute the training process within a container. Data inputs and model outputs are managed using bind mounts. This approach solidifies the process of creating reproducible training environments.</p>
        <h3 className="text-base font-semibold text-white">Prerequisites</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Docker installed and running on your system.</li>
          <li>Python 3 installed locally (for preparing the example).</li>
          <li>A text editor or IDE.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'hands-script',
    title: 'The Training Script (Example: train.py)',
    subtitle: 'Paths and C come in as arguments',
    Visual: VisualTrainScript,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">The Training Script (Example: train.py)</h3>
        <p>First, let&apos;s create a basic Python script that trains a Scikit-learn Logistic Regression model on the Iris dataset. We&apos;ll design it to accept input/output directory paths and a hyperparameter (regularization strength <R>C</R>) via command-line arguments.</p>
        <p>Save the following code as <R>src/train.py</R>:</p>
        <CodeBlock>{`# src/train.py
import argparse
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import os

def train_model(input_dir, output_dir, C):
    """Loads data, trains a model, and saves it."""
    print(f"Loading data from: {input_dir}")
    # Assuming iris.csv is in the input directory
    data_path = os.path.join(input_dir, 'iris.csv')
    try:
        iris_df = pd.read_csv(data_path)
    except FileNotFoundError:
        print(f"Error: Could not find {data_path}. Make sure iris.csv is mounted correctly.")
        return

    print("Data loaded successfully.")
    X = iris_df[['sepal_length', 'sepal_width', 'petal_length', 'petal_width']]
    y = iris_df['species']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print(f"Training Logistic Regression model with C={C}...")
    model = LogisticRegression(C=C, max_iter=200, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Model accuracy on test set: {acc:.4f}")

    # Save the model
    os.makedirs(output_dir, exist_ok=True) # Ensure output directory exists
    model_path = os.path.join(output_dir, 'iris_model.joblib')
    joblib.dump(model, model_path)
    print(f"Model saved to: {model_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train a Logistic Regression model on Iris data.")
    parser.add_argument('--input-dir', type=str, required=True, help='Directory containing iris.csv')
    parser.add_argument('--output-dir', type=str, required=True, help='Directory to save the trained model')
    parser.add_argument('--C', type=float, default=1.0, help='Inverse of regularization strength')

    args = parser.parse_args()

    train_model(args.input_dir, args.output_dir, args.C)`}</CodeBlock>
        <p>This script uses <R>argparse</R> to handle command-line arguments, loads data using pandas, trains a model with Scikit-learn, and saves the trained model using <R>joblib</R>. It explicitly expects paths for input data and output models.</p>
      </div>
    ),
  },
  {
    id: 'hands-tree',
    title: 'Project Structure',
    subtitle: 'The script, the data, and an output folder',
    Visual: VisualTree,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Project Structure</h3>
        <p>Organize your project files like this:</p>
        <CodeBlock>{`ml-training-project/
├── Dockerfile
├── requirements.txt
├── src/
│   └── train.py
├── data/
│   └── iris.csv  # You'll need to download/create this
└── output/       # This directory will be created or used for model output`}</CodeBlock>
        <p>You can easily find the Iris dataset online (e.g., from Kaggle or UCI Machine Learning Repository) or create a sample <R>iris.csv</R> file and place it in the <R>data/</R> directory. Make sure it has columns like <R>sepal_length</R>, <R>sepal_width</R>, <R>petal_length</R>, <R>petal_width</R>, and <R>species</R>.</p>
      </div>
    ),
  },
  {
    id: 'hands-reqs',
    title: 'Dependencies (requirements.txt)',
    subtitle: 'Pin scikit-learn so the build stays the same',
    Visual: VisualPin,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Dependencies (requirements.txt)</h3>
        <p>Create a <R>requirements.txt</R> file listing the necessary Python libraries:</p>
        <CodeBlock>{`pandas
scikit-learn==1.2.2  # Pinning version for reproducibility
joblib`}</CodeBlock>
        <p>Note: Pinning versions (like <R>scikit-learn==1.2.2</R>) is a good practice for ensuring reproducibility.</p>
      </div>
    ),
  },
  {
    id: 'hands-dockerfile',
    title: 'Creating the Dockerfile',
    subtitle: 'Requirements install first, then the script',
    Visual: VisualLayers,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Creating the Dockerfile</h3>
        <p>Now, create the <R>Dockerfile</R> in the project root directory (<R>ml-training-project/</R>):</p>
        <CodeBlock>{`# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file first to leverage Docker cache
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
# Use --no-cache-dir to reduce image size
RUN pip install --no-cache-dir -r requirements.txt

# Copy the source code into the container
COPY src/ ./src/

# Define the entrypoint for the container
# This makes the container behave like an executable
ENTRYPOINT ["python", "src/train.py"]

# Default command (can be overridden at runtime)
# Here, we set default help flag if no args provided
CMD ["--help"]`}</CodeBlock>
        <p>Let&apos;s break down this Dockerfile:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><R>FROM python:3.9-slim</R>: Starts with a lightweight Python 3.9 image.</li>
          <li><R>WORKDIR /app</R>: Sets the default directory inside the container to <R>/app</R>. Subsequent commands (<R>COPY</R>, <R>RUN</R>, <R>CMD</R>, <R>ENTRYPOINT</R>) will run relative to this directory.</li>
          <li><R>COPY requirements.txt .</R>: Copies only the requirements file.</li>
          <li><R>RUN pip install ...</R>: Installs dependencies. This layer is often cached if <R>requirements.txt</R> doesn&apos;t change, speeding up subsequent builds.</li>
          <li><R>COPY src/ ./src/</R>: Copies our training script directory into the image under <R>/app/src/</R>.</li>
          <li><R>ENTRYPOINT [&quot;python&quot;, &quot;src/train.py&quot;]</R>: Specifies that containers run using this image will execute <R>python src/train.py</R> by default. Any arguments provided to <C>docker run</C> after the image name will be appended to this command.</li>
          <li><R>CMD [&quot;--help&quot;]</R>: Provides a default argument to the <R>ENTRYPOINT</R>. If you run the container without arguments, it will execute <R>python src/train.py --help</R>.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'hands-build',
    title: 'Building the Docker Image',
    subtitle: 'The current directory is the build context',
    Visual: VisualBuild,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Building the Docker Image</h3>
        <p>Navigate to your project root directory (<R>ml-training-project/</R>) in your terminal and run the build command:</p>
        <CodeBlock>docker build -t ml-training-app:latest .</CodeBlock>
        <ul className="list-disc pl-5 space-y-2">
          <li><R>-t ml-training-app:latest</R>: Tags the image with the name <R>ml-training-app</R> and the tag <R>latest</R>.</li>
          <li><R>.</R>: Specifies that the build context (where Docker looks for <R>Dockerfile</R> and files to copy) is the current directory.</li>
        </ul>
        <p>Docker will execute the steps in your <R>Dockerfile</R>, downloading the base image, installing dependencies, and copying your code.</p>
      </div>
    ),
  },
  {
    id: 'hands-run',
    title: 'Running the Containerized Training',
    subtitle: 'Mount data and output, then pass container paths',
    Visual: VisualRunTrain,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Running the Containerized Training</h3>
        <p>Now, let&apos;s run the training script inside a container. We need to:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Mount the local <R>data</R> directory into the container&apos;s <R>/app/data</R> path so the script can read <R>iris.csv</R>.</li>
          <li>Mount the local <R>output</R> directory into the container&apos;s <R>/app/output</R> path so the script can save the <R>iris_model.joblib</R> file back to our host machine.</li>
          <li>Pass the required command-line arguments (<R>--input-dir</R>, <R>--output-dir</R>, and optionally <R>--C</R>) to the container, which will be appended to the <R>ENTRYPOINT</R>.</li>
        </ol>
        <p>Execute the following <C>docker run</C> command from your project root directory:</p>
        <CodeBlock>{`docker run --rm \\
  -v "$(pwd)/data:/app/data" \\
  -v "$(pwd)/output:/app/output" \\
  ml-training-app:latest \\
  --input-dir /app/data \\
  --output-dir /app/output \\
  --C 0.5`}</CodeBlock>
        <p>Let&apos;s examine this command:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><C>docker run</C>: The command to create and start a new container.</li>
          <li><R>--rm</R>: Automatically removes the container when it exits. This is useful for one-off tasks like training.</li>
          <li><R>-v &quot;$(pwd)/data:/app/data&quot;</R>: Mounts the host&apos;s current directory (<R>$(pwd)</R>) plus <R>/data</R> to the <R>/app/data</R> directory inside the container. Use {'${PWD}'} on Windows PowerShell or replace <R>$(pwd)</R> with the full path if needed. This makes <R>iris.csv</R> available to the script.</li>
          <li><R>-v &quot;$(pwd)/output:/app/output&quot;</R>: Mounts the host&apos;s <R>output</R> directory (Docker will create it if it doesn&apos;t exist) to <R>/app/output</R> inside the container. This is where the script will save the model.</li>
          <li><R>ml-training-app:latest</R>: The image to use for the container.</li>
          <li><R>--input-dir /app/data --output-dir /app/output --C 0.5</R>: These are the arguments passed to the <R>ENTRYPOINT</R> (<R>python src/train.py</R>). Notice we use the container paths (<R>/app/data</R>, <R>/app/output</R>) here, not the host paths. We also specify a hyperparameter <R>C=0.5</R>.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'hands-logs',
    title: 'What the training run prints',
    subtitle: 'The model is written under /app/output',
    Visual: VisualTrainLogs,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>You should see output similar to this in your terminal:</p>
        <CodeBlock>{`Loading data from: /app/data
Data loaded successfully.
Training Logistic Regression model with C=0.5...
Model accuracy on test set: 1.0000
Model saved to: /app/output/iris_model.joblib`}</CodeBlock>
      </div>
    ),
  },
  {
    id: 'hands-verify',
    title: 'Verifying the Output',
    subtitle: 'The joblib file is on the host',
    Visual: VisualVerifyModel,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Verifying the Output</h3>
        <p>After the container finishes, check your local <R>output</R> directory. You should find the <R>iris_model.joblib</R> file there, successfully saved from within the container.</p>
        <CodeBlock>{`ls output/

iris_model.joblib`}</CodeBlock>
      </div>
    ),
  },
  {
    id: 'hands-summary',
    title: 'Summary',
    subtitle: 'Code, image, run, mounts, and the hyperparameter',
    Visual: VisualSummarySteps,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <h3 className="text-base font-semibold text-white">Summary</h3>
        <p>In this practical exercise, you successfully:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Created a Python training script designed to work within a containerized environment by accepting input/output paths.</li>
          <li>Wrote a <R>Dockerfile</R> to define the environment, install dependencies, and copy the training code.</li>
          <li>Built a Docker image containing the training script and its environment.</li>
          <li>Executed the training process within an isolated container using <C>docker run</C>.</li>
          <li>Managed data input and model output using bind mounts (<R>-v</R>) to link host directories with container directories.</li>
          <li>Passed configuration (hyperparameters) to the script via command-line arguments.</li>
        </ol>
        <p>This process demonstrates the core workflow for containerizing ML training. By packaging the code and dependencies together, you ensure that the training environment is consistent and reproducible, regardless of where the Docker image is run. Using volumes allows interaction with the host filesystem for data and results, bridging the gap between the isolated container and the external environment.</p>
      </div>
    ),
  },
];

export default function ContainerizingMLTrainingWorkflowsPartThree() {
  return <ChapterDeck slides={slides} />;
}
