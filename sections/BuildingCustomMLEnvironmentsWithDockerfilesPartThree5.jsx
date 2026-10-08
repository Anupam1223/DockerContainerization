import React from 'react';
import ChapterDeck from '../components/ChapterDeck';
import CodeBlock from '../components/CodeBlock';
import {
  VisualCopyLocal,
  VisualAddRemote,
  VisualDockerIgnore,
  VisualBuildCache,
  VisualLargeArtifacts,
  VisualWorkdir,
  VisualExecShellForms,
  VisualCombineEntryCmd,
  VisualSklearnDeps,
  VisualSklearnFile,
  VisualSklearnImage,
  VisualSklearnCheck,
} from '../components/BuildingCustomMLEnvironmentsPartThreeVisualizers';

const C = ({ children }) => <code className="font-mono text-[0.92em] text-teal-300">{children}</code>;
const R = ({ children }) => <code className="font-mono text-[0.92em] text-rose-300">{children}</code>;

export const meta = {
  title: 'Building Custom ML Environments with Dockerfiles (Part 3)',
  subtitle: 'Copying code, WORKDIR, and a Scikit-learn image',
};

const slides = [
  {
    id: 'copy-intro',
    title: 'Copying Code and Artifacts',
    subtitle: 'Getting project files into the image',
    Visual: VisualCopyLocal,
    content: (
      <>
        <p>
          Incorporating project code and related artifacts into a Docker image ensures the container has everything it needs to execute Machine Learning tasks, such as training models or running inference services. This step typically follows the definition of the base environment and installation of dependencies within the <R>Dockerfile</R>. The main instructions for this are <R>COPY</R> and <R>ADD</R>.
        </p>
      </>
    ),
  },
  {
    id: 'copy',
    title: 'Using the COPY Instruction',
    subtitle: 'Files from the build context into the image',
    Visual: VisualCopyLocal,
    content: (
      <>
        <p>
          The <R>COPY</R> instruction is the most straightforward and commonly used method for getting files from your local machine (specifically, the build context) into the image filesystem. Its syntax is simple:
        </p>
        <CodeBlock code={`COPY <src>... <dest>`} />
        <ul>
          <li><R>&lt;src&gt;</R>: Specifies the file or directory on your local machine (relative to the build context root) that you want to copy. You can specify multiple sources. Wildcards are supported.</li>
          <li><R>&lt;dest&gt;</R>: Specifies the path inside the container image where the source files/directories should be copied. If the destination doesn't exist, Docker will create it. If the source is a directory, the destination must end with a <C>/</C> or be an existing directory.</li>
        </ul>
        <p>
          For a typical ML project structured with a <C>src</C> directory containing Python code and a <C>requirements.txt</C> file in the root, you might use <R>COPY</R> like this:
        </p>
        <CodeBlock>{`# Define the working directory (covered previously)
WORKDIR /app

# Copy the requirements file first to leverage caching
COPY requirements.txt .

# Install dependencies (covered previously)
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the project code
COPY ./src ./src`}</CodeBlock>
        <p>In this example:</p>
        <ol>
          <li>We set the working directory inside the container to <C>/app</C>.</li>
          <li>We copy <C>requirements.txt</C> from the build context root to the <C>/app</C> directory inside the image.</li>
          <li>We run <C>pip install</C>.</li>
          <li>We copy the contents of the local <C>src</C> directory into a directory named <C>src</C> within the <C>/app</C> directory inside the image (i.e., <C>/app/src</C>).</li>
        </ol>
        <p>This order is significant for build performance, as we'll discuss shortly regarding build caching.</p>
      </>
    ),
  },
  {
    id: 'add',
    title: 'Understanding the ADD Instruction',
    subtitle: 'URL downloads and archive extraction',
    Visual: VisualAddRemote,
    content: (
      <>
        <p>Docker also provides the <R>ADD</R> instruction, which has similar syntax to <R>COPY</R>:</p>
        <CodeBlock code={`ADD <src>... <dest>`} />
        <p><R>ADD</R> performs the same function as <R>COPY</R> for local files and directories but includes two additional features:</p>
        <ol>
          <li><strong>URL Fetching:</strong> If <R>&lt;src&gt;</R> is a URL, Docker will download the file from the URL and copy it to <R>&lt;dest&gt;</R>. Permissions are set to 600.</li>
          <li><strong>Archive Auto-extraction:</strong> If <R>&lt;src&gt;</R> is a recognized compressed archive format (like <C>tar</C>, <C>gzip</C>, <C>bzip2</C>, <C>xz</C>), Docker will automatically unpack it into <R>&lt;dest&gt;</R> as a directory.</li>
        </ol>
        <p>
          While these features might seem convenient, they can also make your builds less predictable. For instance, downloading from URLs during the build couples your image build process to network availability and the stability of the remote source. Auto-extraction can sometimes have unexpected results depending on the archive structure.
        </p>
        <p>
          <strong>Recommendation:</strong> For clarity and predictability, <strong>prefer <R>COPY</R> over <R>ADD</R></strong> for transferring local files and directories. Use <R>ADD</R> only if you specifically need its URL download or auto-extraction capabilities, and understand the potential implications. For downloading files, often it's better practice to use tools like <C>curl</C> or <C>wget</C> within a <R>RUN</R> instruction, providing more control over the download process (e.g., error handling, retries).
        </p>
      </>
    ),
  },
  {
    id: 'dockerignore',
    title: 'Preventing Unwanted Files with .dockerignore',
    subtitle: 'What gets sent to the daemon',
    Visual: VisualDockerIgnore,
    content: (
      <>
        <p>
          When you run <C>docker build</C>, the Docker client first bundles the directory specified as the build context (usually <C>.</C>) and sends it to the Docker daemon. This context includes all files and subdirectories. Sending large, unnecessary files (like datasets, virtual environments, Git history, IDE configuration) slows down the build process and can bloat your image if accidentally copied.
        </p>
        <p>
          To prevent this, create a file named <C>.dockerignore</C> in the root of your build context (the same directory as your <R>Dockerfile</R>). List files or directories you want to exclude, using syntax similar to <C>.gitignore</C>.
        </p>
        <p>Here's an example <C>.dockerignore</C> for a typical ML project:</p>
        <CodeBlock>{`# Git files
.git
.gitignore

# Python virtual environment
venv/
*.pyc
__pycache__/

# IDE / Editor specific files
.vscode/
.idea/
*.swp

# Large data files (manage via volumes/mounts later)
data/
datasets/

# Model artifacts (if large or managed separately)
models/
*.pt
*.h5
*.onnx
*.pkl

# Docker files
Dockerfile
.dockerignore

# Other temporary or local files
*.log
notebooks/output/`}</CodeBlock>
        <p>
          By using <C>.dockerignore</C>, you ensure that only the essential code and configuration files are sent to the daemon and are available to be copied into your image via <R>COPY</R> or <R>ADD</R>. This leads to faster builds and smaller, more secure images.
        </p>
      </>
    ),
  },
  {
    id: 'copy-cache',
    title: 'Optimizing Copy Operations for Build Caching',
    subtitle: 'Requirements first, application code last',
    Visual: VisualBuildCache,
    content: (
      <>
        <p>
          Docker builds images in layers. Each instruction in the <R>Dockerfile</R> (like <R>RUN</R>, <R>COPY</R>, <R>ADD</R>) creates a new layer. Docker utilizes a build cache: if the files related to a <R>COPY</R> instruction haven't changed since the last build, and the preceding layers are also cached, Docker reuses the existing layer instead of executing the instruction again.
        </p>
        <p>This is particularly important for time-consuming steps like dependency installation. Here are two approaches:</p>
        <p><strong>Less Optimal:</strong></p>
        <CodeBlock>{`WORKDIR /app
COPY . . # Copy everything at once
RUN pip install -r requirements.txt
# ... rest of Dockerfile`}</CodeBlock>
        <p>
          If <em>any</em> file in your project changes (even a minor code edit), the <R>COPY . .</R> layer becomes invalid, and Docker <em>must</em> re-run the potentially lengthy <C>pip install</C> command, even if <C>requirements.txt</C> didn't change.
        </p>
        <p><strong>More Optimal:</strong></p>
        <CodeBlock>{`WORKDIR /app

# 1. Copy only the requirements file
COPY requirements.txt .

# 2. Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 3. Copy the rest of the application code
COPY . .
# ... rest of Dockerfile`}</CodeBlock>
        <p>In this improved version:</p>
        <ul>
          <li>If only your Python code (<C>.py</C> files) changes, Docker reuses the cached layers up to and including the <R>RUN pip install</R> step (because <C>requirements.txt</C> hasn't changed). It only needs to re-execute the final <R>COPY . .</R> instruction, which is very fast.</li>
          <li>The dependency installation layer is only rebuilt if <C>requirements.txt</C> itself is modified.</li>
        </ul>
        <p>
          Structuring your <R>COPY</R> instructions thoughtfully, separating dependency definitions from application code, significantly speeds up iterative development cycles.
        </p>
      </>
    ),
  },
  {
    id: 'artifacts',
    title: 'Handling Model Artifacts and Other Large Files',
    subtitle: 'When a file should stay out of the image',
    Visual: VisualLargeArtifacts,
    content: (
      <>
        <p>Should you <R>COPY</R> pre-trained models, datasets, or other large artifacts directly into your image?</p>
        <ul>
          <li><strong>Pros:</strong> Creates a self-contained image. The container starts with the artifact already present. Suitable for smaller, relatively stable artifacts needed at runtime.</li>
          <li><strong>Cons:</strong> Dramatically increases image size. Rebuilding the entire image is required to update the artifact. Sharing large images is inefficient. May violate licensing if distributing proprietary models/data within the image.</li>
        </ul>
        <p>
          Generally, for datasets and larger or frequently updated model artifacts, copying them directly into the image is <strong>not</strong> the recommended approach. Alternative strategies using Docker volumes or bind mounts provide more flexibility and efficiency. These techniques allow you to decouple the data and artifacts from the image itself, making updates easier and keeping images smaller. We will explore these data management techniques in detail in <R>Chapter 3</R>, "Managing Data and Models in Containers".
        </p>
        <p>
          For now, understand that <R>COPY</R> and <R>ADD</R> are essential for getting your <em>application code</em> and <em>configuration</em> into the image. Use <C>.dockerignore</C> to exclude unnecessary files, and structure your <R>COPY</R> operations to maximize the benefits of Docker's build cache.
        </p>
      </>
    ),
  },
  {
    id: 'workdir',
    title: 'Setting the Working Directory and Entrypoint',
    subtitle: 'WORKDIR is the container’s cd',
    Visual: VisualWorkdir,
    content: (
      <>
        <p>
          When creating a Docker image for an ML project, after tasks such as establishing a base image, installing dependencies, and copying project files into the image using instructions like <R>COPY</R> or <R>ADD</R>, it becomes essential to define how the container will operate upon startup. This involves telling Docker where commands should be executed inside the container and what command should run by default. The <R>WORKDIR</R>, <R>ENTRYPOINT</R>, and <R>CMD</R> instructions in your Dockerfile accomplish this. These instructions are significant for making your containerized ML applications runnable and easy to use.
        </p>
        <h3 className="text-base font-semibold text-white pt-2">Setting the Execution Context with WORKDIR</h3>
        <p>
          The <R>WORKDIR</R> instruction sets the working directory for any subsequent <R>RUN</R>, <R>CMD</R>, <R>ENTRYPOINT</R>, <R>COPY</R>, and <R>ADD</R> instructions in the Dockerfile. Think of it as changing the current directory (<C>cd</C>) within the context of building and running your image.
        </p>
        <p>
          If <R>WORKDIR</R> is not specified, Docker executes subsequent commands in the root directory (<C>/</C>). Explicitly setting a <R>WORKDIR</R> makes your Dockerfile instructions clearer and less reliant on absolute paths.
        </p>
        <p><strong>Benefits:</strong></p>
        <ol>
          <li><strong>Readability:</strong> Avoids scattering absolute paths throughout your Dockerfile.</li>
          <li><strong>Portability:</strong> Makes it easier to restructure your project within the image later.</li>
          <li><strong>Consistency:</strong> Ensures commands like running Python scripts execute relative to a known project directory.</li>
        </ol>
        <p><strong>Example:</strong></p>
        <p>For example, an ML project structured like this on your host machine:</p>
        <CodeBlock>{`my_ml_project/
├── Dockerfile
├── requirements.txt
├── src/
│   ├── train.py
│   └── predict.py
└── data/
    └── dataset.csv`}</CodeBlock>
        <p>
          Instead of writing <C>COPY src /app/src</C> and then <C>RUN python /app/src/train.py</C>, you can use <R>WORKDIR</R>:
        </p>
        <CodeBlock>{`# Dockerfile snippet
# ... (FROM, install dependencies)

# Set the working directory
WORKDIR /app

# Copy application code relative to WORKDIR
COPY src/ ./src/
COPY requirements.txt .

# Install dependencies (pip install -r requirements.txt)

# Copy data (might be better handled with volumes, see Chapter 3)
COPY data/ ./data/

# Subsequent commands like CMD or ENTRYPOINT will run from /app
CMD ["python", "src/train.py"]`}</CodeBlock>
        <p>
          In this example, <R>WORKDIR /app</R> creates the <C>/app</C> directory if it doesn't exist and sets it as the current directory. The <R>COPY</R> instructions now use relative destinations (<C>./src/</C>, <C>.</C>, <C>./data/</C>), copying files <em>into</em> <C>/app</C>. The final <R>CMD</R> executes <C>python src/train.py</C> assuming <C>/app</C> is the current directory.
        </p>
      </>
    ),
  },
  {
    id: 'entrypoint',
    title: "Defining the Container's Executable with ENTRYPOINT",
    subtitle: 'The command that always runs',
    Visual: VisualExecShellForms,
    content: (
      <>
        <p>
          The <R>ENTRYPOINT</R> instruction configures a container to run as an executable. It specifies the command that will <em>always</em> be executed when the container starts. Any command-line arguments provided to <C>docker run &lt;image&gt; [arguments]</C> are appended to the <R>ENTRYPOINT</R> command.
        </p>
        <p>
          <R>ENTRYPOINT</R> is often used when you want the container's primary purpose to be running a specific application or script.
        </p>
        <p>There are two forms:</p>
        <ol>
          <li>
            <strong>Exec form (Recommended):</strong> <C>ENTRYPOINT ["executable", "param1", "param2"]</C>
            <ul>
              <li>This is the preferred form. It executes the command directly without invoking a command shell. Arguments passed via <C>docker run</C> are appended directly after the specified parameters.</li>
            </ul>
          </li>
          <li>
            <strong>Shell form:</strong> <C>ENTRYPOINT command param1 param2</C>
            <ul>
              <li>This form runs the command within a shell (<C>/bin/sh -c</C>). It can be useful for environment variable substitution but might have unexpected behavior with signal handling or if the command contains shell metacharacters.</li>
            </ul>
          </li>
        </ol>
        <p><strong>Example (Exec Form):</strong></p>
        <p>Suppose you want your container to always execute Python scripts.</p>
        <CodeBlock>{`# Dockerfile snippet
# ... (FROM, WORKDIR, COPY, etc.)

ENTRYPOINT ["python"]

# Default script to run if no arguments are provided to docker run
CMD ["src/train.py"]`}</CodeBlock>
        <p>When you run this container:</p>
        <ul>
          <li><C>docker run my-ml-image</C>: Executes <C>python src/train.py</C> (the <R>CMD</R> provides the default argument to the <R>ENTRYPOINT</R>).</li>
          <li><C>docker run my-ml-image src/predict.py --model /app/models/model.pkl</C>: Executes <C>python src/predict.py --model /app/models/model.pkl</C> (the arguments provided override the <R>CMD</R> and are appended to the <R>ENTRYPOINT</R>).</li>
        </ul>
        <p>
          The <R>ENTRYPOINT</R> ensures <C>python</C> is always the main command, making the container act like a dedicated Python script runner.
        </p>
      </>
    ),
  },
  {
    id: 'cmd',
    title: 'Providing Default Commands or Arguments with CMD',
    subtitle: 'Defaults that docker run can replace',
    Visual: VisualCombineEntryCmd,
    content: (
      <>
        <p>
          The <R>CMD</R> instruction provides defaults for an executing container. These defaults can include an executable, but they are often used to specify default parameters for an <R>ENTRYPOINT</R>. If used without an <R>ENTRYPOINT</R>, <R>CMD</R> specifies the default command to run.
        </p>
        <p>
          Crucially, the <em>entire</em> <R>CMD</R> instruction is overridden if the user provides arguments to <C>docker run &lt;image&gt; [arguments]</C>.
        </p>
        <p><R>CMD</R> also has two forms:</p>
        <ol>
          <li><strong>Exec form (Recommended for ENTRYPOINT):</strong> <C>CMD ["param1","param2"]</C> (Used as default parameters for <R>ENTRYPOINT</R>)</li>
          <li><strong>Exec form (Standalone):</strong> <C>CMD ["executable","param1","param2"]</C> (Default command if no <R>ENTRYPOINT</R>)</li>
          <li><strong>Shell form:</strong> <C>CMD command param1 param2</C> (Default command run via <C>/bin/sh -c</C>)</li>
        </ol>
        <p><strong>Use Cases:</strong></p>
        <p><strong>1. Default arguments for ENTRYPOINT (Most Common Combined Use):</strong></p>
        <CodeBlock>{`WORKDIR /app
COPY src/ ./src/
ENTRYPOINT ["python", "src/run_experiment.py"]
# Default parameters if none are provided via 'docker run'
CMD ["--data", "data/dataset.csv", "--epochs", "10"]`}</CodeBlock>
        <ul>
          <li>Running <C>docker run my-ml-image</C> executes: <C>python src/run_experiment.py --data data/dataset.csv --epochs 10</C></li>
          <li>Running <C>docker run my-ml-image --data data/other.csv --epochs 20</C> executes: <C>python src/run_experiment.py --data data/other.csv --epochs 20</C> (The <R>CMD</R> is completely replaced).</li>
        </ul>
        <p><strong>2. Default command (No ENTRYPOINT):</strong></p>
        <CodeBlock>{`WORKDIR /app
COPY src/ ./src/
# No ENTRYPOINT defined
CMD ["python", "src/train.py"]`}</CodeBlock>
        <ul>
          <li>Running <C>docker run my-ml-image</C> executes: <C>python src/train.py</C></li>
          <li>Running <C>docker run my-ml-image python src/predict.py</C> executes: <C>python src/predict.py</C> (The entire default <R>CMD</R> is replaced by the command provided).</li>
        </ul>
      </>
    ),
  },
  {
    id: 'entry-cmd',
    title: 'Combining ENTRYPOINT and CMD Effectively',
    subtitle: 'A fixed program, with default arguments',
    Visual: VisualCombineEntryCmd,
    content: (
      <>
        <p>
          The most powerful and common pattern is using <R>ENTRYPOINT</R> to specify the fixed executable (like <C>python</C> or a wrapper script) and <R>CMD</R> to specify the default, overridable arguments (like the script name or default hyperparameters).
        </p>
        <p><strong>Best Practices:</strong></p>
        <ul>
          <li><strong>Use <R>WORKDIR</R>:</strong> Always set a <R>WORKDIR</R> to establish a clear execution context within your container. <C>/app</C> is a common convention.</li>
          <li><strong>Prefer the Exec Form:</strong> Use the JSON array syntax (<C>["executable", "param1"]</C>) for both <R>ENTRYPOINT</R> and <R>CMD</R> to avoid shell processing quirks and make argument handling explicit.</li>
          <li><strong><R>ENTRYPOINT</R> for the Executable:</strong> If your container is designed to run a specific command or behave like an executable, use <R>ENTRYPOINT</R>. Examples: <C>ENTRYPOINT ["python"]</C>, <C>ENTRYPOINT ["./my_inference_server"]</C>.</li>
          <li><strong><R>CMD</R> for Defaults:</strong> Use <R>CMD</R> to provide default arguments to the <R>ENTRYPOINT</R> or to specify a default command that is easily overridden. Example: <C>CMD ["my_script.py", "--default-flag"]</C>.</li>
        </ul>
        <p>
          By carefully defining <R>WORKDIR</R>, <R>ENTRYPOINT</R>, and <R>CMD</R>, you create Docker images that are not only reproducible environments but also behave predictably and are user-friendly, whether running training jobs or serving models. They define the interface for interacting with your containerized ML application.
        </p>
      </>
    ),
  },
  {
    id: 'sklearn-setup',
    title: 'Hands-on practical: Build a Scikit-learn Environment',
    subtitle: 'Step 1: Set up the project directory',
    Visual: VisualSklearnDeps,
    content: (
      <>
        <p>
          This hands-on exercise focuses on building a simple Docker image containing a standard environment for Machine Learning tasks. The environment utilizes Python, the popular Scikit-learn library, and pandas for data manipulation. This image provides a consistent foundation for developing and running Scikit-learn based models.
        </p>
        <p><strong>Goal:</strong> Create a Docker image with Python 3.9, pip, Scikit-learn, and pandas installed.</p>
        <p><strong>Prerequisites:</strong></p>
        <ul>
          <li>Docker Desktop or Docker Engine installed and running on your machine.</li>
          <li>A text editor for creating files.</li>
          <li>A terminal or command prompt.</li>
        </ul>
        <h3 className="text-base font-semibold text-white pt-2">Step 1: Set Up Your Project Directory</h3>
        <p>First, create a dedicated directory for this exercise. This helps keep our files organized.</p>
        <CodeBlock>{`mkdir sklearn-env
cd sklearn-env`}</CodeBlock>
        <p>Inside this directory, we will place our <R>Dockerfile</R> and a <C>requirements.txt</C> file.</p>
      </>
    ),
  },
  {
    id: 'sklearn-reqs',
    title: 'Step 2: Define Dependencies in requirements.txt',
    subtitle: 'Pinned versions for a repeatable image',
    Visual: VisualSklearnDeps,
    content: (
      <>
        <p>
          Using a <C>requirements.txt</C> file is the standard way to manage Python package dependencies. Docker can leverage this file to install the necessary libraries efficiently.
        </p>
        <p>Create a file named <C>requirements.txt</C> inside the <C>sklearn-env</C> directory with the following content:</p>
        <CodeBlock>{`# requirements.txt
scikit-learn==1.2.2
pandas==1.5.3`}</CodeBlock>
        <p>
          Note: We are pinning specific versions for reproducibility. You might adjust these versions based on your project needs, but using specific versions is generally recommended for consistent environments.
        </p>
      </>
    ),
  },
  {
    id: 'sklearn-dockerfile',
    title: 'Step 3: Create the Dockerfile',
    subtitle: 'Python 3.9 slim, then the pinned packages',
    Visual: VisualSklearnFile,
    content: (
      <>
        <p>Now, create the core file: <R>Dockerfile</R> (no extension) in the <C>sklearn-env</C> directory. Add the following instructions:</p>
        <CodeBlock>{`# Dockerfile for a basic Scikit-learn environment

# 1. Choose the base image
FROM python:3.9-slim

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy the requirements file first to leverage Docker cache
COPY requirements.txt .

# 4. Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 5. (Optional) Set a default command to run when the container starts
CMD ["python"]`}</CodeBlock>
        <p>Let's break down this <R>Dockerfile</R>:</p>
        <ul>
          <li><R>FROM python:3.9-slim</R>: We start with an official Python base image. We chose version 3.9 and the <C>slim</C> variant, which is smaller than the default tag, reducing our final image size while still providing a functional Python environment.</li>
          <li><R>WORKDIR /app</R>: This sets the working directory for subsequent commands (<R>COPY</R>, <R>RUN</R>, <R>CMD</R>, <R>ENTRYPOINT</R>) inside the container. If the directory doesn't exist, <R>WORKDIR</R> creates it. It's good practice to set a dedicated working directory.</li>
          <li><R>COPY requirements.txt .</R>: This copies the <C>requirements.txt</C> file from your build context (the <C>sklearn-env</C> directory) into the container's working directory (<C>/app</C>). We copy this <em>before</em> running <C>pip install</C>. Docker builds images in layers. If <C>requirements.txt</C> hasn't changed since the last build, Docker can reuse the cached layer from the subsequent <R>RUN</R> instruction, significantly speeding up rebuilds.</li>
          <li>
            <R>RUN pip install --no-cache-dir -r requirements.txt</R>: This executes the <C>pip install</C> command inside the container.
            <ul>
              <li><C>--no-cache-dir</C>: This option disables pip's cache, which helps keep the image size smaller as the cache isn't needed in the final image.</li>
              <li><C>-r requirements.txt</C>: Tells pip to install the packages listed in the specified file.</li>
            </ul>
          </li>
          <li><R>CMD ["python"]</R>: This defines the default command to run when a container is started from this image without specifying a command. In this case, it will launch an interactive Python interpreter.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'sklearn-build',
    title: 'Step 4: Build the Docker Image',
    subtitle: 'Tag the image sklearn-env:1.0',
    Visual: VisualSklearnImage,
    content: (
      <>
        <p>
          Now, navigate to your <C>sklearn-env</C> directory in your terminal (if you aren't already there) and run the <C>docker build</C> command:
        </p>
        <CodeBlock code={`docker build -t sklearn-env:1.0 .`} />
        <p>Let's dissect this command:</p>
        <ul>
          <li><C>docker build</C>: The command to build an image from a <R>Dockerfile</R>.</li>
          <li><C>-t sklearn-env:1.0</C>: The <C>-t</C> flag tags the image with a name and optionally a tag (version). Here, we name it <C>sklearn-env</C> and tag it <C>1.0</C>. Tagging makes it easier to reference the image later.</li>
          <li><C>.</C>: This specifies the build context. Docker looks for the <R>Dockerfile</R> in the current directory (<C>.</C>) and sends the files in this directory (and its subdirectories) to the Docker daemon to execute the build.</li>
        </ul>
        <p>
          You will see Docker executing each step defined in your <R>Dockerfile</R>. It will download the base image (if not already present) and then run each instruction, creating layers for the image.
        </p>
      </>
    ),
  },
  {
    id: 'sklearn-verify',
    title: 'Step 5: Verify the Image',
    subtitle: 'Print the installed library versions',
    Visual: VisualSklearnCheck,
    content: (
      <>
        <p>
          Once the build completes successfully, you can verify that your environment is set up correctly. Run a temporary container from the image and check the installed package versions:
        </p>
        <CodeBlock code={`docker run --rm -it sklearn-env:1.0 python -c "import sklearn; import pandas; print(f'Scikit-learn version: \${sklearn.__version__}'); print(f'Pandas version: \${pandas.__version__}')"`} />
        <ul>
          <li><C>docker run</C>: The command to run a container from an image.</li>
          <li><C>--rm</C>: Automatically removes the container when it exits. This is useful for short-lived verification tasks.</li>
          <li><C>-it</C>: Runs the container in interactive mode (<C>-i</C>) and allocates a pseudo-TTY (<C>-t</C>), allowing you to interact with it (though not strictly necessary for this specific command, it's common practice).</li>
          <li><C>sklearn-env:1.0</C>: The name and tag of the image we just built.</li>
          <li><C>python -c "..."</C>: This overrides the default <R>CMD</R> and executes a specific Python command inside the container. The command imports the libraries and prints their versions.</li>
        </ul>
        <p>You should see output similar to this (exact versions might differ slightly if you changed <C>requirements.txt</C>):</p>
        <CodeBlock>{`Scikit-learn version: 1.2.2
Pandas version: 1.5.3`}</CodeBlock>
        <p>
          If you see the version numbers printed correctly, congratulations! You have successfully built a Docker image containing a reproducible Scikit-learn environment. This image can now be shared with colleagues or used as a base for containerizing specific training or inference scripts, ensuring everyone works with the same set of dependencies.
        </p>
      </>
    ),
  },
];

export default function BuildingCustomMLEnvironmentsPartThree() {
  return <ChapterDeck slides={slides} />;
}
