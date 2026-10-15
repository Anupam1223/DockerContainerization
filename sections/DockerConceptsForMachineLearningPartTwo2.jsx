import React from 'react';
import ChapterDeck from '../components/ChapterDeck';
import CodeBlock from '../components/CodeBlock';
import {
  VisualBuildContext,
  VisualDockerfileInstructions,
  VisualInstructionFrom,
  VisualInstructionCmd,
  VisualInstructionCopy,
  VisualInstructionExpose,
  VisualInstructionRun,
  VisualInstructionWorkdir,
  VisualJupyterPractical,
  VisualPushPullLifecycle,
  VisualRegistries,
} from '../components/DockerConceptsPartTwoVisualizers';

export const meta = {
  title: 'Docker Concepts for Machine Learning (Part 2)',
  subtitle: 'Dockerfiles, registries, and pre-built images',
};

const C = ({ children }) => <span className="font-mono text-[13px] text-teal-200">{children}</span>;
const R = ({ children }) => <span className="font-mono text-[13px] text-rose-300">{children}</span>;

const slides = [
  {
    id: 'dockerfile-intro',
    title: 'Introduction to Dockerfiles',
    subtitle: 'A recipe for the environment',
    Visual: VisualDockerfileInstructions,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          While pre-built Docker images from registries like Docker Hub provide a convenient starting point, you&apos;ll often need to create custom environments tailored specifically to your machine learning project&apos;s requirements. You might need a precise version of Python, specific ML libraries (like TensorFlow, PyTorch, or Scikit-learn), system dependencies, or your own project code included. This is where Dockerfiles come into play.
        </p>
        <p>
          A Dockerfile is a text document that contains a series of instructions Docker uses to assemble a custom container image, step by step. Think of it as a recipe or a blueprint for creating your environment. By writing a Dockerfile, you define everything needed for your application to run: the operating system base, system tools, language runtimes, code dependencies, your application code, and how the application should be started.
        </p>
        <p>
          This automation is fundamental for reproducibility in machine learning. If you share your Dockerfile along with your code, anyone else can build the exact same image, ensuring the environment is consistent across development, testing, and production systems. This eliminates the common &quot;it works on my machine&quot; problem often encountered due to subtle differences in library versions or system configurations.
        </p>
      </div>
    ),
  },
  {
    id: 'structure',
    title: 'Basic Structure and Instructions',
    subtitle: 'Each instruction becomes a layer',
    Visual: VisualDockerfileInstructions,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          A Dockerfile consists of a sequence of instructions, typically written in uppercase, followed by arguments. Docker reads these instructions from top to bottom, executing each one to form layers of the final image. Here are some of the most common instructions you&apos;ll encounter.
        </p>
      </div>
    ),
  },
  {
    id: 'from',
    title: 'FROM',
    subtitle: 'Every Dockerfile starts here',
    Visual: VisualInstructionFrom,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          <C>FROM</C>: Every Dockerfile must start with a <C>FROM</C> instruction. It specifies the base image upon which you are building. This could be a minimal operating system (like <R>ubuntu:22.04</R>), a language-specific image (like <R>python:3.9-slim</R>), or even a specialized image containing ML frameworks or CUDA drivers (like <R>nvidia/cuda:11.8.0-base-ubuntu22.04</R> or <R>tensorflow/tensorflow:latest-gpu</R>). Choosing the right base image is important, and we&apos;ll cover this later.
        </p>
        <CodeBlock code="FROM python:3.9-slim" />
      </div>
    ),
  },
  {
    id: 'run',
    title: 'RUN',
    subtitle: 'A command that becomes a new layer',
    Visual: VisualInstructionRun,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          <C>RUN</C>: This instruction executes commands in a new layer on top of the current image. It&apos;s commonly used for installing system packages (using <R>apt-get</R> or <R>yum</R>) or Python libraries (using <R>pip</R> or <R>conda</R>). Multiple <C>RUN</C> instructions create multiple layers, but you can chain commands using <C>&amp;&amp;</C> for better layer management.
        </p>
        <CodeBlock code={`RUN apt-get update && apt-get install -y --no-install-recommends git \\\n    && rm -rf /var/lib/apt/lists/*\nRUN pip install --no-cache-dir scikit-learn==1.2.0 pandas==1.5.2`} />
      </div>
    ),
  },
  {
    id: 'copy',
    title: 'COPY',
    subtitle: 'Files from the build context enter the image',
    Visual: VisualInstructionCopy,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          <C>COPY</C>: This instruction copies files or directories from your local machine (the build context) to the filesystem of the container image. You&apos;ll use this to add your Python scripts, requirement files (<R>requirements.txt</R>), configuration files, or even pre-trained model files into the image.
        </p>
        <CodeBlock code={`COPY ./requirements.txt /app/requirements.txt\nCOPY ./src /app/src`} />
      </div>
    ),
  },
  {
    id: 'workdir',
    title: 'WORKDIR',
    subtitle: 'Where the following commands run',
    Visual: VisualInstructionWorkdir,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          <C>WORKDIR</C>: Sets the working directory for any subsequent <C>RUN</C>, <C>CMD</C>, <C>ENTRYPOINT</C>, <C>COPY</C>, and <C>ADD</C> instructions. If the directory doesn&apos;t exist, it will be created. This helps organize your container&apos;s filesystem.
        </p>
        <CodeBlock code="WORKDIR /app" />
      </div>
    ),
  },
  {
    id: 'cmd-entry',
    title: 'CMD and ENTRYPOINT',
    subtitle: 'What starts when the container starts',
    Visual: VisualInstructionCmd,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          <C>CMD</C>: Specifies the default command to execute when a container is started from the image. There can only be one <C>CMD</C> instruction in a Dockerfile. If you provide a command when running the container (<R>docker run my-image &lt;command&gt;</R>), it will override the default <C>CMD</C>. It&apos;s often used to start the main process of the application, like running a Python script.
        </p>
        <CodeBlock code='CMD ["python", "src/train.py"]' />
        <p>
          <C>ENTRYPOINT</C>: Also configures a container that will run as an executable. It&apos;s similar to <C>CMD</C>, but commands passed via <R>docker run</R> are appended as arguments to the <C>ENTRYPOINT</C> executable. This is useful for creating images that act like specific tools.
        </p>
      </div>
    ),
  },
  {
    id: 'expose',
    title: 'EXPOSE and comments',
    subtitle: 'Documentation, not a published port',
    Visual: VisualInstructionExpose,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          <C>EXPOSE</C>: Informs Docker that the container listens on the specified network ports at runtime. It doesn&apos;t actually publish the port; it functions as documentation between the person who builds the image and the person who runs the container.
        </p>
        <CodeBlock code="EXPOSE 8000" />
        <p>Comments in a Dockerfile start with <C>#</C>.</p>
      </div>
    ),
  },
  {
    id: 'simple',
    title: 'A Simple Example',
    subtitle: 'Build my-ml-app from the current directory',
    Visual: VisualBuildContext,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Here&apos;s a minimal Dockerfile that sets up an environment with Python 3.9 and installs Scikit-learn and Pandas:</p>
        <CodeBlock code={`# Use an official Python runtime as a parent image\nFROM python:3.9-slim\n\n# Set the working directory in the container\nWORKDIR /app\n\n# Copy the requirements file into the container at /app\nCOPY requirements.txt .\n\n# Install any needed packages specified in requirements.txt\n# Use --no-cache-dir to reduce image size\nRUN pip install --no-cache-dir -r requirements.txt\n\n# Copy the rest of the application code\nCOPY . .\n\n# Specify the command to run on container start\nCMD ["python", "your_script.py"]`} />
        <p>To build an image from this Dockerfile (assuming it&apos;s saved as <R>Dockerfile</R> in the current directory), you would typically run a command like:</p>
        <CodeBlock code="docker build -t my-ml-app ." />
        <p>
          The <C>-t my-ml-app</C> tag gives your image a recognizable name, and the <C>.</C> indicates that the build context (the set of files available to the <C>COPY</C> instruction) is the current directory. Docker executes the instructions line by line, caching results where possible, to create your final image <R>my-ml-app</R>.
        </p>
        <p>
          Understanding Dockerfiles is essential for using Docker&apos;s power in ML. They allow you to precisely define, version, and share the environments needed to run your training scripts or serve your models, ensuring consistency and simplifying collaboration and deployment. In the next chapter, we will look at how to write more sophisticated Dockerfiles specifically for building ML environments.
        </p>
      </div>
    ),
  },
  {
    id: 'naming',
    title: 'Docker Registries and Repositories',
    subtitle: 'What a registry is, and how an image name is put together',
    Visual: VisualRegistries,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          Building a Docker image locally is often the first step; the ability to make that image available elsewhere or obtain pre-built images created by others is equally important. Docker registries and repositories address this need. A registry is a centralized storage and distribution system for Docker images, much like PyPI serves Python packages or GitHub hosts code repositories.
        </p>
        <p>
          A <strong>Docker registry</strong> is a service that stores and distributes Docker images. It can be public or private. The most well-known public registry is Docker Hub, which serves as the default registry for the Docker command-line tool.
        </p>
        <p>
          Within a registry, images are organized into <strong>repositories</strong>. A repository holds different versions (tags) of a specific image. For example, Docker Hub hosts repositories for official Python images (<R>python</R>), popular databases like PostgreSQL (<R>postgres</R>), and, importantly for ML, core frameworks like TensorFlow (<R>tensorflow/tensorflow</R>) and PyTorch (<R>pytorch/pytorch</R>).
        </p>
        <p>The standard naming convention for a Docker image follows this pattern:</p>
        <CodeBlock code="[registry_host/][username_or_organization/]repository_name[:tag]" />
        <ul className="list-disc pl-5 space-y-1">
          <li><C>registry_host</C>: Specifies the registry if it&apos;s not Docker Hub (e.g., <R>gcr.io</R> for Google Container Registry, <R>nvcr.io</R> for NVIDIA GPU Cloud). If omitted, Docker assumes Docker Hub.</li>
          <li><C>username_or_organization</C>: Identifies the owner of the repository on the registry (e.g., <R>tensorflow</R> in <R>tensorflow/tensorflow</R>). For official images on Docker Hub (like <R>python</R> or <R>ubuntu</R>), this part is often omitted.</li>
          <li><C>repository_name</C>: The actual name of the image set (e.g., <R>tensorflow</R>, <R>python</R>).</li>
          <li><C>tag</C>: A specific version or variant identifier (e.g., <R>latest</R>, <R>3.9-slim</R>, <R>2.11.0-gpu</R>). If omitted, Docker defaults to the <R>latest</R> tag.</li>
        </ul>
        <p>For instance:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><R>python:3.9</R>: The official Python image, version 3.9 tag, from Docker Hub.</li>
          <li><R>tensorflow/tensorflow:2.11.0-gpu</R>: The TensorFlow image, version 2.11.0 with GPU support, from the <R>tensorflow</R> organization on Docker Hub.</li>
          <li><R>nvcr.io/nvidia/pytorch:23.10-py3</R>: The PyTorch image, tag <R>23.10-py3</R>, from the <R>nvidia</R> organization on the NVIDIA GPU Cloud registry (<R>nvcr.io</R>).</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'hub',
    title: 'Docker Hub: The Public Registry',
    subtitle: 'Official bases, frameworks, and community images',
    Visual: VisualRegistries,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Docker Hub is the default and largest public registry. It hosts an extensive collection of images, including:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Official Base Images</strong>: Images like <R>ubuntu</R>, <R>debian</R>, <R>alpine</R>, and <R>python</R>, maintained by Docker or upstream projects. These are often starting points for custom ML environments.</li>
          <li><strong>Framework Images</strong>: Repositories maintained by framework developers, such as <R>tensorflow/tensorflow</R>, <R>pytorch/pytorch</R>, providing ready-to-use environments with specific framework versions and sometimes GPU support.</li>
          <li><strong>Community Images</strong>: Images shared by individual users or organizations.</li>
        </ul>
        <p>Using images from Docker Hub is fundamental for ML practitioners. Instead of building everything from scratch, you can leverage base images that already include Python, specific ML libraries, or even CUDA drivers for GPU acceleration.</p>
      </div>
    ),
  },
  {
    id: 'tags',
    title: 'Tags: Identifying Image Versions',
    subtitle: 'Pin a version so the build stays the same',
    Visual: VisualRegistries,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          Tags are essential for reproducibility. The <R>latest</R> tag is convenient but often points to the most recently pushed version, which can change unexpectedly. In ML, consistency is critical. Relying on <R>latest</R> can lead to builds failing or models behaving differently if the underlying image changes.
        </p>
        <p>Best practice dictates using specific tags that denote versions or specific configurations:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><R>python:3.9.18-slim-bookworm</R>: Specifies Python version 3.9.18, the <C>slim</C> variant (smaller size), based on Debian bookworm.</li>
          <li><R>tensorflow/tensorflow:2.12.0-gpu</R>: Specifies TensorFlow version 2.12.0 with GPU support.</li>
          <li><R>pytorch/pytorch:2.0.1-cuda11.7-cudnn8-runtime</R>: Specifies PyTorch 2.0.1, built for CUDA 11.7 and cuDNN 8, containing only the runtime components.</li>
        </ul>
        <p>Always use explicit tags in your Dockerfiles (<C>FROM python:3.9-slim</C>) and when running containers to ensure you are using the exact environment you intend.</p>
      </div>
    ),
  },
  {
    id: 'pull',
    title: 'Pulling Images: The docker pull Command',
    subtitle: 'Local storage first, then the registry',
    Visual: VisualPushPullLifecycle,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          To download an image from a registry to your local machine, you use the <R>docker pull</R> command. Docker automatically checks your local storage first; if the image (with the specific tag) isn&apos;t present, it contacts the appropriate registry (Docker Hub by default) and downloads it.
        </p>
        <CodeBlock code={`# Pull the official Python 3.9 slim image from Docker Hub\ndocker pull python:3.9-slim\n\n# Pull a specific TensorFlow GPU image from Docker Hub\ndocker pull tensorflow/tensorflow:2.11.0-gpu\n\n# Pull an image from a different registry (NVIDIA)\ndocker pull nvcr.io/nvidia/cuda:12.1.1-base-ubuntu22.04`} />
        <p>If you run <R>docker run</R> with an image name that isn&apos;t available locally, Docker will implicitly perform a <R>docker pull</R> first.</p>
      </div>
    ),
  },
  {
    id: 'push',
    title: 'Pushing Images: The docker push Command',
    subtitle: 'Tag, log in, then upload',
    Visual: VisualPushPullLifecycle,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>After building a custom image tailored for your ML project (e.g., containing your specific dependencies or even a trained model), you might want to share it with colleagues or deploy it to a server. This is done using the <R>docker push</R> command.</p>
        <p>Before you can push, you need to:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong>Tag your image correctly</strong>: The image name must include the target registry (if not Docker Hub) and your username or organization name on that registry. Use <R>docker tag</R> to rename or alias an existing local image.
            <CodeBlock code={`# Assume you built an image locally named 'my-sklearn-app:1.0'\n# Tag it for pushing to Docker Hub under username 'myusername'\ndocker tag my-sklearn-app:1.0 myusername/my-sklearn-app:1.0`} />
          </li>
          <li>
            <strong>Authenticate with the registry</strong>: Use the <R>docker login</R> command. For Docker Hub, it will prompt for your username and password (or an access token).
            <CodeBlock code={`docker login\n# Enter username and password/token when prompted`} />
            <p>For other registries, provide the registry host: <R>docker login myregistry.example.com</R>.</p>
          </li>
        </ol>
        <p>Once tagged and authenticated, you can push the image:</p>
        <CodeBlock code={`# Push the tagged image to Docker Hub\ndocker push myusername/my-sklearn-app:1.0`} />
        <p>The image layers will be uploaded to the registry, making it available for others (or your deployment systems) to pull.</p>
      </div>
    ),
  },
  {
    id: 'private',
    title: 'Private Registries',
    subtitle: 'The same login, a locked repository',
    Visual: VisualRegistries,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>While Docker Hub is excellent for public and open-source projects, you&apos;ll often need a <strong>private registry</strong> for proprietary code, sensitive data handling configurations, or internal company use. Major cloud providers offer managed registry services:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Amazon Elastic Container Registry (ECR)</li>
          <li>Google Artifact Registry (or Container Registry)</li>
          <li>Azure Container Registry (ACR)</li>
        </ul>
        <p>You can also host your own registry using software like Harbor or the official Docker Registry image. Access control and security are the primary reasons for using private registries in commercial or research settings. Authentication (<R>docker login</R>) works similarly, but you&apos;ll use credentials specific to the private registry provider.</p>
        <p>Understanding registries and repositories is fundamental to leveraging Docker effectively in ML. They enable sharing standardized environments, accessing pre-built tools, and forming the backbone of container-based deployment strategies, ensuring that the environment built locally is the same one that runs elsewhere.</p>
      </div>
    ),
  },
  {
    id: 'prebuilt',
    title: 'Hands-on practical: Running Pre-built ML Images',
    subtitle: 'A curated environment, already built',
    Visual: VisualJupyterPractical,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          Running pre-built ML images offers a practical way to engage with Docker. One of the significant advantages of Docker is the
          availability of these images on registries like Docker Hub. These images often contain curated environments with common ML
          frameworks and libraries already installed, saving considerable setup time and ensuring consistency.
        </p>
        <p>
          In this hands-on exercise, we will pull and run a popular pre-built image designed for machine learning tasks. We&apos;ll use an official
          TensorFlow image that includes Jupyter Notebook, providing an interactive environment ready for experimentation.
        </p>
      </div>
    ),
  },
  {
    id: 'pull-tf',
    title: 'Step 1: Pulling the TensorFlow Image',
    subtitle: 'Download the image before you run it',
    Visual: VisualJupyterPractical,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          First, we need to download the image from Docker Hub to our local machine. Open your terminal or command prompt and use the <R>docker pull</R> command. We&apos;ll specify the image name and a tag. Tags often indicate versions or specific configurations (like CPU vs. GPU, or including development tools).
        </p>
        <CodeBlock code="docker pull tensorflow/tensorflow:latest-jupyter" />
        <p>This command instructs Docker to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Connect to the default registry (Docker Hub).</li>
          <li>Find the repository named <R>tensorflow/tensorflow</R>.</li>
          <li>Download the image tagged <R>latest-jupyter</R>. This specific tag provides a recent TensorFlow build along with a ready-to-use Jupyter Notebook server.</li>
        </ul>
        <p>You will see Docker downloading the image layers. The time this takes depends on your internet connection and the image size.</p>
      </div>
    ),
  },
  {
    id: 'run-tf',
    title: 'Step 2: Running the Container',
    subtitle: 'Start Jupyter from the image you pulled',
    Visual: VisualJupyterPractical,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Once the image is downloaded, we can create and start a container from it using <R>docker run</R>. We will use several options:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><C>-it</C>: Runs the container in interactive mode and allocates a pseudo-TTY, allowing us to interact with it.</li>
          <li><C>--rm</C>: Automatically removes the container when it exits. This is useful for temporary experiments.</li>
          <li><C>-p 8888:8888</C>: Maps port 8888 on your host machine to port 8888 inside the container. This is the default port used by Jupyter Notebook.</li>
          <li><R>tensorflow/tensorflow:latest-jupyter</R>: Specifies the image to use.</li>
        </ul>
        <p>Execute the following command:</p>
        <CodeBlock code="docker run -it --rm -p 8888:8888 tensorflow/tensorflow:latest-jupyter" />
      </div>
    ),
  },
  {
    id: 'jupyter-url',
    title: 'Step 3: Accessing Jupyter Notebook',
    subtitle: 'Use the localhost URL that includes the token',
    Visual: VisualJupyterPractical,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>After running the command, the container will start, and the Jupyter Notebook server will launch inside it. You should see output in your terminal similar to this (the token will be different):</p>
        <CodeBlock code={`[...]\nTo access the notebook, open this file in a browser:\n    file:///root/.local/share/jupyter/runtime/nbserver-6-open.html\nOr copy and paste one of these URLs:\n    http://127.0.0.1:8888/?token=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4\n    or http://<container_hostname>:8888/?token=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4\n[...]`} />
        <p>Copy the URL containing <R>127.0.0.1</R> or <R>localhost</R> (including the <R>token</R> part) and paste it into your web browser.</p>
        <p>You should now see the Jupyter Notebook interface running inside the Docker container.</p>
      </div>
    ),
  },
  {
    id: 'notebook',
    title: 'Step 4: Interacting with the Environment',
    subtitle: 'TensorFlow is inside the container',
    Visual: VisualJupyterPractical,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Within the Jupyter interface:</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Click on &quot;New&quot; and select &quot;Python 3&quot; to start a new notebook.</li>
          <li>In the first cell, try importing TensorFlow to verify it&apos;s installed:</li>
        </ol>
        <CodeBlock code={`import tensorflow as tf\nprint(tf.__version__)`} />
        <p>3. Run the cell (Shift+Enter). You should see the installed TensorFlow version printed.</p>
        <p>You now have a fully functional TensorFlow environment running inside an isolated container, accessible through your browser, without needing to install Python, TensorFlow, or Jupyter directly on your host machine.</p>
      </div>
    ),
  },
  {
    id: 'stop',
    title: 'Step 5: Stopping the Container',
    subtitle: '--rm deletes it when the process exits',
    Visual: VisualJupyterPractical,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>To stop the Jupyter server and the container, go back to the terminal where you ran the <R>docker run</R> command and press <C>Ctrl+C</C> twice.</p>
        <p>Because we used the <C>--rm</C> flag, Docker will automatically remove the container after it stops. If you had omitted <C>--rm</C>, the container would still exist in a stopped state. You could list it using <R>docker ps -a</R> and remove it manually using <R>docker rm &lt;container_id_or_name&gt;</R>.</p>
      </div>
    ),
  },
  {
    id: 'other-images',
    title: 'Finding Other Images',
    subtitle: 'Official images, community images, and what to check',
    Visual: VisualRegistries,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          Docker Hub hosts an extensive collection of images. You can search for other ML-related images directly on the Docker Hub website. Many organizations provide official images for their tools (e.g., <R>pytorch/pytorch</R>, <R>nvidia/cuda</R>). There are also community-contributed images for various data science tasks. When choosing an image, pay attention to the publisher, download count, and recent updates to assess its reliability.
        </p>
        <p>
          This exercise demonstrates the convenience of using pre-built Docker images. By pulling an existing image, you obtained a standardized, ready-to-use ML environment quickly. This ability to leverage pre-configured environments is a significant time-saver and helps ensure that you and your collaborators are working with the same setup, reducing the common &quot;it works on my machine&quot; problem. In the next chapter, we will learn how to build our own custom images tailored to specific project requirements.
        </p>
      </div>
    ),
  }
];

export default function DockerConceptsForMachineLearningPartTwo() {
  return <ChapterDeck slides={slides} />;
}
