import React from 'react';
import ChapterDeck from '../components/ChapterDeck';
import CodeBlock from '../components/CodeBlock';
import {
  VisualArgVsEnv,
  VisualCondaDockerfile,
  VisualCondaVsPip,
  VisualEnvOverrides,
  VisualEnvYaml,
} from '../components/BuildingCustomMLEnvironmentsPartTwoVisualizers';

export const meta = {
  title: 'Building Custom ML Environments with Dockerfiles (Part 2)',
  subtitle: 'Conda, then environment variables',
};

const C = ({ children }) => <span className="font-mono text-[13px] text-teal-200">{children}</span>;
const R = ({ children }) => <span className="font-mono text-[13px] text-rose-300">{children}</span>;

const slides = [
  {
    id: 'conda-why',
    title: 'Managing Python Dependencies (Conda)',
    subtitle: 'Python packages, and the libraries under them',
    Visual: VisualCondaVsPip,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          While <R>pip</R> and <R>requirements.txt</R> are widely used for managing Python packages, Machine Learning projects often involve more complex dependencies, including non-Python libraries like CUDA, MKL, or system tools. Conda offers an excellent solution for such scenarios. Conda is an open-source package management system and environment management system that runs on various operating systems. It excels at installing packages and their dependencies, especially those with binary components, and creating isolated environments to prevent conflicts. Integrating Conda into your Docker workflow provides a powerful way to manage these intricate ML environments reliably.
        </p>
        <p className="font-semibold text-white">Why Use Conda for ML Dependencies in Docker?</p>
        <p>Using Conda within your Docker images offers several advantages, particularly relevant for ML:</p>
        <ol className="list-decimal pl-5 space-y-1.5">
          <li><strong>Comprehensive Dependency Management</strong>: Conda manages Python packages like <R>pip</R>, but it also handles non-Python libraries (e.g., compilers, CUDA Toolkit, cuDNN, OpenBLAS) and system-level dependencies that <R>pip</R> cannot. This is significant for ML frameworks often relying on optimized C/C++/Fortran libraries.</li>
          <li><strong>Environment Isolation</strong>: Conda creates distinct environments, each with its own set of packages and Python interpreter. While a Docker container itself provides isolation, using Conda environments <em>within</em> the container can help manage different stages or components of an ML workflow if needed, though typically one environment per container is sufficient.</li>
          <li><strong>Advanced Conflict Resolution</strong>: Conda employs a more sophisticated dependency solver than <R>pip</R>, which can be better at finding compatible sets of packages, especially when dealing with complex interdependencies common in scientific Python stacks.</li>
          <li><strong>Reproducibility with <R>environment.yml</R></strong>: Similar to <R>requirements.txt</R>, Conda uses <R>environment.yml</R> files to declare dependencies, including specific versions and Conda channels, ensuring that anyone can recreate the exact environment.</li>
        </ol>
      </div>
    ),
  },
  {
    id: 'conda-base',
    title: 'Selecting a Conda Base Image',
    subtitle: 'miniconda stays small',
    Visual: VisualCondaDockerfile,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>The easiest way to get started is by using official base images provided by Anaconda, Inc.:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><R>continuumio/miniconda3</R>: Contains a minimal Conda installer and Python 3. This is generally preferred for Docker images as it keeps the size smaller. You install only the packages you need.</li>
          <li><R>continuumio/anaconda3</R>: Contains the full Anaconda distribution, including Conda, Python 3, and hundreds of pre-installed scientific packages. This results in a much larger image and is usually overkill unless you specifically need most of the included packages.</li>
        </ul>
        <p>
          Alternatively, you can start from a standard Python image (e.g., <R>python:3.9-slim</R>) or an OS image (e.g., <R>ubuntu:22.04</R>) and install Miniconda yourself within the Dockerfile. This gives you more control but requires extra steps.
        </p>
        <p>For most ML applications, starting with <R>continuumio/miniconda3</R> offers a good balance between convenience and image size.</p>
      </div>
    ),
  },
  {
    id: 'env-yml',
    title: 'Using environment.yml for Reproducible Builds',
    subtitle: 'Name, channels, then pinned packages',
    Visual: VisualEnvYaml,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          The standard way to define a Conda environment is through an <R>environment.yml</R> file. This file lists the environment name, the channels Conda should search for packages, and the required dependencies.
        </p>
        <p>Here&apos;s an example <R>environment.yml</R> for a basic ML setup:</p>
        <CodeBlock code={`# environment.yml\nname: ml_env\nchannels:\n  - defaults\n  - conda-forge # Often provides more up-to-date or specific packages\ndependencies:\n  - python=3.9\n  - numpy=1.23\n  - pandas>=1.4\n  - scikit-learn=1.1\n  - matplotlib\n  - pip # Include pip if you need to install packages not available via Conda\n  - pip:\n    - some-pip-only-package==0.1.0`} />
        <p>Explanation:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><C>name</C>: Specifies the name of the Conda environment (<R>ml_env</R>).</li>
          <li><C>channels</C>: Defines the order in which Conda searches for packages. <R>defaults</R> refers to Anaconda&apos;s default channels. <R>conda-forge</R> is a popular community-led channel. Order matters.</li>
          <li>
            <C>dependencies</C>: Lists the packages to install.
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>You can specify exact versions (<R>numpy=1.23</R>), minimum versions (<R>pandas&gt;=1.4</R>), or let Conda choose the latest compatible version (<R>matplotlib</R>).</li>
              <li>Including <R>pip</R> allows you to subsequently use <R>pip install</R>.</li>
              <li>The nested <R>pip:</R> section lets you list packages to be installed via <R>pip</R> after the Conda packages are set up. This is useful for packages only available on PyPI.</li>
            </ul>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'conda-build',
    title: 'Building the Environment in a Dockerfile',
    subtitle: 'Copy the file, then conda env create',
    Visual: VisualCondaDockerfile,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>To use this <R>environment.yml</R> file in your Docker build, you&apos;ll typically copy it into the image and then run <R>conda env create</R>.</p>
        <p>Here&apos;s a Dockerfile snippet demonstrating this:</p>
        <CodeBlock code={`# Use Miniconda base image\nFROM continuumio/miniconda3\n\n# Define arguments for environment name and file\nARG CONDA_ENV_NAME=ml_env\nARG CONDA_ENV_FILE=environment.yml\n\n# Set the working directory\nWORKDIR /app\n\n# Copy the environment file into the image\nCOPY \${CONDA_ENV_FILE} .\n\n# Create the Conda environment\n# Combine update and create to potentially reduce layers\n# Add clean command to reduce image size\nRUN conda update -n base -c defaults conda && \\\n    conda env create -f \${CONDA_ENV_FILE} && \\\n    conda clean -afy\n\n# Make RUN commands use the new environment:\nSHELL ["conda", "run", "-n", "\${CONDA_ENV_NAME}", "/bin/bash", "-c"]\n\n# Example: Verify installation (runs within the ml_env)\nRUN echo "Verifying Python and Scikit-learn installation..." && \\\n    python -c "import sklearn; print(f'Scikit-learn version: \${sklearn.__version__}')" && \\\n    echo "Conda environment setup complete."\n\n# Copy the rest of your application code\nCOPY . .\n\n# Set the default command to run in the Conda environment\n# Note: SHELL directive above ensures this runs in the activated env\nCMD ["python", "your_script.py"]`} />
      </div>
    ),
  },
  {
    id: 'conda-explain',
    title: 'What Each Instruction Does',
    subtitle: 'SHELL sends later commands into ml_env',
    Visual: VisualCondaDockerfile,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Explanation:</p>
        <ol className="list-decimal pl-5 space-y-1.5">
          <li><R>FROM continuumio/miniconda3</R>: Starts with the minimal Conda image.</li>
          <li><C>ARG</C>: Defines build-time arguments for flexibility (optional but good practice).</li>
          <li><C>WORKDIR /app</C>: Sets the working directory inside the container.</li>
          <li><R>COPY ${'{CONDA_ENV_FILE}'} .</R>: Copies your <R>environment.yml</R> file into the <R>/app</R> directory.</li>
          <li>
            <R>RUN conda update ... &amp;&amp; conda env create ... &amp;&amp; conda clean ...</R>: This is the core step.
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>It first updates the base Conda installation (good practice).</li>
              <li><R>conda env create -f ${'{CONDA_ENV_FILE}'}</R> reads the YAML file and installs all specified packages into an environment named <R>ml_env</R>.</li>
              <li><R>conda clean -afy</R> removes unused packages and caches, significantly reducing the final image size. Combining these steps into a single <C>RUN</C> command helps minimize layer count.</li>
            </ul>
          </li>
          <li><R>SHELL [&quot;conda&quot;, &quot;run&quot;, &quot;-n&quot;, &quot;${'{CONDA_ENV_NAME}'}&quot;, &quot;/bin/bash&quot;, &quot;-c&quot;]</R>: This is a critical instruction. It changes the default shell used for subsequent <C>RUN</C>, <C>CMD</C>, and <C>ENTRYPOINT</C> instructions. Commands will now execute <em>inside</em> the activated <R>ml_env</R> Conda environment, meaning you don&apos;t need to manually activate it for every step.</li>
          <li><R>RUN echo ... &amp;&amp; python ...</R>: This <C>RUN</C> command now executes using the shell defined above, so <R>python</R> refers to the Python interpreter within <R>ml_env</R>.</li>
          <li><R>COPY . .</R>: Copies the rest of your project files (e.g., Python scripts, data files) into the working directory.</li>
          <li><R>CMD [&quot;python&quot;, &quot;your_script.py&quot;]</R>: Defines the default command to run when the container starts. Thanks to the <C>SHELL</C> instruction, this command also runs within the activated <R>ml_env</R>.</li>
        </ol>
      </div>
    ),
  },
  {
    id: 'conda-pip',
    title: 'Conda and Pip: Working Together',
    subtitle: 'Conda packages first, then the pip section',
    Visual: VisualEnvYaml,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          As shown in the <R>environment.yml</R> example, you can use <R>pip</R> within a Conda environment. This is often necessary for packages not available through Conda channels. Conda installs the packages listed under <C>dependencies</C> first, then uses <R>pip</R> to install packages listed under the nested <R>pip:</R> section. This approach generally works well, letting you leverage Conda for complex dependencies and <R>pip</R> for Python-specific ones.
        </p>
      </div>
    ),
  },
  {
    id: 'conda-summary',
    title: 'Summary and Best Practices',
    subtitle: 'Clean the cache in the same layer you install',
    Visual: VisualCondaDockerfile,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Using Conda with Docker provides a solution for managing complex ML dependencies:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Prefer <R>miniconda3</R></strong>: Start with <R>continuumio/miniconda3</R> for smaller, more manageable images.</li>
          <li><strong>Use <R>environment.yml</R></strong>: Define your environment declaratively for reproducibility. Pin versions where necessary.</li>
          <li><strong>Specify Channels</strong>: Be explicit about the Conda channels (<R>defaults</R>, <R>conda-forge</R>, etc.) in your <R>environment.yml</R>.</li>
          <li><strong>Activate the Environment</strong>: Use the <C>SHELL</C> instruction or <R>conda run -n &lt;env_name&gt;</R> to ensure your commands execute within the correct Conda environment. The <C>SHELL</C> approach is often cleaner for subsequent <C>RUN</C>, <C>CMD</C>, and <C>ENTRYPOINT</C> instructions.</li>
          <li><strong>Clean Up</strong>: Always run <R>conda clean -afy</R> in the same <C>RUN</C> layer as <R>conda env create</R> or <R>conda install</R> to minimize image size by removing cached files.</li>
          <li><strong>Combine Commands</strong>: Chain related commands (like <R>conda update</R>, <R>conda env create</R>, <R>conda clean</R>) using <C>&amp;&amp;</C> within a single <C>RUN</C> instruction to reduce the number of image layers.</li>
        </ul>
        <p>
          By integrating Conda effectively into your Dockerfiles, you create self-contained, reproducible environments capable of handling the complex software stacks required for modern Machine Learning development and deployment. This addresses a common source of friction in ML projects, ensuring consistency across different machines and stages of the ML lifecycle.
        </p>
      </div>
    ),
  },
  {
    id: 'env-intro',
    title: 'Working with Environment Variables',
    subtitle: 'Configuration from outside the container',
    Visual: VisualEnvOverrides,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          Environment variables provide a standard mechanism for passing configuration settings into Docker containers. This approach is particularly valuable for Machine Learning projects, allowing for dynamic container behavior configuration without modifying underlying code or rebuilding images repeatedly. They are indispensable for parameterizing ML environments, influencing script execution, and managing sensitive information.
        </p>
        <p>
          Environment variables are dynamic named values that can affect the way running processes behave on a computer. Within a Docker container, they function similarly, providing a way to inject configuration from the outside (the Docker host or orchestration system) into the isolated container environment.
        </p>
      </div>
    ),
  },
  {
    id: 'env-defaults',
    title: 'Setting Defaults with the ENV Instruction',
    subtitle: 'Values baked in as defaults, still available at runtime',
    Visual: VisualArgVsEnv,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          The primary way to define environment variables within your <R>Dockerfile</R> is using the <C>ENV</C> instruction. This sets variables that will be available both during the subsequent steps of the image build process and when containers are run from the resulting image.
        </p>
        <p>The <C>ENV</C> instruction has two forms:</p>
        <ol className="list-decimal pl-5 space-y-1.5">
          <li><C>ENV &lt;key&gt;=&lt;value&gt;</C>: Sets a single variable. If the value contains spaces, enclose it in quotes or escape the spaces with backslashes.</li>
          <li><C>ENV &lt;key1&gt;=&lt;value1&gt; &lt;key2&gt;=&lt;value2&gt; ...</C>: Sets multiple variables in a single instruction. This form is often preferred as it creates fewer image layers.</li>
        </ol>
        <p>Let&apos;s see an example within an ML context:</p>
        <CodeBlock code={`# Dockerfile\nFROM python:3.9-slim\n\n# Set default logging level and model directory\nENV LOG_LEVEL=INFO \\\n    MODEL_DIR=/app/models\n\nWORKDIR /app\n\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\nCOPY . .\n\n# This script might use the MODEL_DIR variable\nCMD ["python", "train.py"]`} />
        <p>
          In this <R>Dockerfile</R>, <R>LOG_LEVEL</R> is set to <R>INFO</R> and <R>MODEL_DIR</R> is set to <R>/app/models</R>. Any scripts running inside the container (like <R>train.py</R>) can access these values, typically using standard library functions available in the programming language (e.g., <R>os.environ.get(&apos;MODEL_DIR&apos;)</R> in Python). Setting defaults like this makes your image more self-contained and predictable.
        </p>
      </div>
    ),
  },
  {
    id: 'arg',
    title: 'Build-Time Arguments with ARG',
    subtitle: 'Available while the image is built',
    Visual: VisualArgVsEnv,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          Docker also provides the <C>ARG</C> instruction to define variables that users can pass at build-time using the <R>--build-arg</R> flag with the <R>docker build</R> command.
        </p>
        <CodeBlock code={`# Dockerfile\nARG PYTHON_VERSION=3.9\nFROM python:\${PYTHON_VERSION}-slim\n\nARG CACHE_DATE=not_set\nENV LAST_REFRESHED_AT=$CACHE_DATE\n\n# ... rest of the Dockerfile`} />
        <p>
          Here, <R>PYTHON_VERSION</R> is a build argument with a default value of <R>3.9</R>. You could build this image using a different Python version like this:
        </p>
        <CodeBlock code="docker build --build-arg PYTHON_VERSION=3.10 -t my-ml-app ." />
        <p>An important distinction exists between <C>ARG</C> and <C>ENV</C>:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><C>ARG</C> variables are generally only available <em>during</em> the image build process. They do not persist as environment variables in the final image or running containers by default.</li>
          <li><C>ENV</C> variables are available during the build <em>and</em> persist in the final image, accessible by applications running inside containers launched from that image.</li>
        </ul>
        <p>
          You can, however, make a build argument persist as an environment variable by defining an <C>ENV</C> instruction that uses the <C>ARG</C> variable, as shown with <R>LAST_REFRESHED_AT</R> in the example above. This pattern is useful for embedding build-time information into the runtime environment.
        </p>
        <p>
          Use <C>ARG</C> for parameters that affect the build itself (like base image versions, source repositories) or for temporary build secrets you don&apos;t want baked into the final image layer&apos;s metadata. Use <C>ENV</C> for runtime configuration defaults needed by your application.
        </p>
      </div>
    ),
  },
  {
    id: 'runtime',
    title: 'Overriding Variables at Runtime',
    subtitle: 'Same image, different -e values',
    Visual: VisualEnvOverrides,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          One of the significant benefits of environment variables is the ability to override the defaults set in the <R>Dockerfile</R> when you launch a container. This provides flexibility without needing to rebuild the image. The <R>docker run</R> command accepts the <R>-e</R> (or <R>--env</R>) flag for this purpose.
        </p>
        <CodeBlock code={`# Run container with default settings\ndocker run my-ml-app\n\n# Override the LOG_LEVEL for debugging\ndocker run -e LOG_LEVEL=DEBUG my-ml-app\n\n# Override the model directory\ndocker run -e MODEL_DIR=/data/production_model my-ml-app\n\n# Set a new variable not defined in the Dockerfile\ndocker run -e API_KEY=xyz123 my-ml-app`} />
        <p>
          You can use the <R>-e</R> flag multiple times to set or override several variables. This runtime configuration is fundamental for adapting a generic ML image to specific tasks, environments (development, staging, production), or datasets.
        </p>
      </div>
    ),
  },
  {
    id: 'env-file',
    title: 'Using Environment Files',
    subtitle: 'A .env file instead of a long command',
    Visual: VisualEnvOverrides,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          Managing many environment variables via <R>-e</R> flags on the command line can become cumbersome. Docker allows you to place these variables in a file (conventionally named <R>.env</R>) and pass that file during container startup using the <R>--env-file</R> flag.
        </p>
        <p>An example <R>.env</R> file:</p>
        <CodeBlock code={`# .env file\nLOG_LEVEL=INFO\nMODEL_DIR=/data/shared/models\nDATABASE_URL=postgresql://user:pass@dbhost:5432/ml_results\nS3_BUCKET=my-ml-artifacts`} />
        <p>Each line follows the <C>KEY=VALUE</C> format. Comments start with <C>#</C>.</p>
        <p>You can then run the container like this:</p>
        <CodeBlock code="docker run --env-file .env my-ml-app" />
        <p>
          Docker reads the variables from the <R>.env</R> file and sets them in the container environment. Variables set explicitly with <R>-e</R> will override those defined in the <R>.env</R> file if there are conflicts. Using <R>.env</R> files is good practice for managing configuration, especially for separating settings between different deployment environments. It also helps keep sensitive information out of shell history or command-line logs.
        </p>
      </div>
    ),
  },
  {
    id: 'use-cases',
    title: 'Common Use Cases in ML Projects',
    subtitle: 'Paths, parameters, keys, flags, and hosts',
    Visual: VisualEnvOverrides,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Environment variables are widely used in containerized ML workflows:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>File Paths</strong>: Specifying locations for input datasets (<R>DATA_DIR</R>), output models (<R>MODEL_DIR</R>), logs (<R>LOG_DIR</R>), or temporary files (<R>TMP_DIR</R>).</li>
          <li><strong>Hyperparameters</strong>: While often passed via command-line arguments to training scripts for clarity, simpler parameters (like <R>LEARNING_RATE</R>, <R>BATCH_SIZE</R>) can sometimes be set via <C>ENV</C>, especially for inference servers.</li>
          <li><strong>Credentials &amp; API Keys</strong>: Providing access keys for cloud storage (AWS S3, Google Cloud Storage), databases, or external APIs. <strong>Important Security Note</strong>: Avoid embedding secrets directly in the <R>Dockerfile</R> using <C>ENV</C>. Prefer runtime injection using <R>-e</R>, <R>--env-file</R>, or dedicated secrets management systems in production.</li>
          <li><strong>Configuration Flags</strong>: Controlling application behavior, like setting <R>LOG_LEVEL</R>, enabling/disabling features (<R>ENABLE_GPU=true</R>), or specifying ML framework backends (<R>KERAS_BACKEND=tensorflow</R>).</li>
          <li><strong>Network Settings</strong>: Defining hostnames or ports for connecting to other services (e.g., <R>DATABASE_HOST=db</R>, <R>REDIS_PORT=6379</R>).</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'practices',
    title: 'Best Practices and Security',
    subtitle: 'Defaults in the image, secrets at runtime',
    Visual: VisualEnvOverrides,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Avoid Hardcoding Secrets</strong>: Never put sensitive data like passwords or API keys directly into your <R>Dockerfile</R> using <C>ENV</C>. These become part of the image layers and can be inspected. Use runtime injection (<R>-e</R>, <R>--env-file</R>) or proper secrets management tools for production workloads.</li>
          <li><strong>Set Sensible Defaults</strong>: Use <C>ENV</C> in your <R>Dockerfile</R> to provide reasonable default values for common configurations. This makes the image easier to use out-of-the-box.</li>
          <li><strong>Distinguish ARG and ENV</strong>: Use <C>ARG</C> for build-time customization and <C>ENV</C> for runtime configuration.</li>
          <li><strong>Document Variables</strong>: Clearly document the environment variables your image expects or supports, including their purpose and potential values. This is often done in a <R>README.md</R> file accompanying the <R>Dockerfile</R>.</li>
          <li><strong>Prefer Runtime Injection</strong>: For configuration that changes frequently or differs across environments, rely on runtime injection rather than rebuilding the image.</li>
        </ul>
        <p>
          Environment variables are a simple yet effective mechanism for configuring your containerized ML applications. By understanding how to use <C>ENV</C>, <C>ARG</C>, <R>-e</R>, and <R>--env-file</R>, you can create flexible, reusable Docker images that adapt to various deployment scenarios without requiring constant code changes or image rebuilds. This promotes consistency and simplifies the management of your ML environments.
        </p>
      </div>
    ),
  }
];

export default function BuildingCustomMLEnvironmentsWithDockerfilesPartTwo() {
  return <ChapterDeck slides={slides} />;
}
