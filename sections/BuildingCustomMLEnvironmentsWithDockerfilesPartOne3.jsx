import React from 'react';
import ChapterDeck from '../components/ChapterDeck';
import CodeBlock from '../components/CodeBlock';
import {
  VisualBaseImageFactors,
  VisualBaseImageTree,
  VisualBuildCache,
  VisualCudaVariants,
  VisualDependencyPinning,
  VisualDockerfileAnatomy,
  VisualMaintainability,
  VisualPipCache,
} from '../components/BuildingCustomMLEnvironmentsPartOneVisualizers';

export const meta = {
  title: 'Building Custom ML Environments with Dockerfiles (Part 1)',
  subtitle: 'Structure, base images, and Python dependencies',
};

const C = ({ children }) => <span className="font-mono text-[13px] text-teal-200">{children}</span>;
const R = ({ children }) => <span className="font-mono text-[13px] text-rose-300">{children}</span>;

const slides = [
  {
    id: 'structure',
    title: 'Structuring your Dockerfile',
    subtitle: 'Least-changing instructions first',
    Visual: VisualDockerfileAnatomy,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          A <R>Dockerfile</R> is the blueprint for building your container image. It&apos;s a text file containing a sequence of instructions that Docker follows to assemble the image layer by layer. While a functional <R>Dockerfile</R> can be written with minimal planning, a well-structured <R>Dockerfile</R> is significantly easier to read, maintain, debug, and optimize, especially for complex Machine Learning environments. Think of it like writing clean, organized code; the same principles apply here.
        </p>
        <p>
          The order of instructions in your <R>Dockerfile</R> matters greatly, primarily because of Docker&apos;s build cache. Docker builds images in layers, and each instruction in the <R>Dockerfile</R> typically creates a new layer. When you rebuild an image, Docker checks if the instruction and the files it depends on have changed since the last build. If not, Docker reuses the existing layer from its cache instead of executing the instruction again. This can dramatically speed up build times.
        </p>
      </div>
    ),
  },
  {
    id: 'common-structure',
    title: 'A Common Structure for ML Projects',
    subtitle: 'Stable layers, then the code that changes',
    Visual: VisualDockerfileAnatomy,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          To take advantage of layer caching effectively, structure your <R>Dockerfile</R> with the least frequently changing instructions first, followed by instructions that change more often. A common structure for ML projects looks something like this:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5">
          <li><strong>Base Image</strong> (<C>FROM</C>): Start by specifying the foundation of your image. This changes infrequently.</li>
          <li><strong>Metadata</strong> (<C>LABEL</C>, <C>ARG</C>): Define labels or build-time arguments. These might change occasionally.</li>
          <li><strong>System Dependencies</strong> (<R>RUN apt-get update &amp;&amp; apt-get install -y ...</R>): Install operating system packages (like <R>git</R>, <R>wget</R>, or C++ build tools). These dependencies usually don&apos;t change often once established.</li>
          <li><strong>Python Environment Setup</strong> (<R>RUN pip install --no-cache-dir --upgrade pip</R>): Prepare the Python environment.</li>
          <li><strong>Python Dependencies</strong> (<R>COPY requirements.txt .</R>, <R>RUN pip install -r requirements.txt</R> or <strong>Conda equivalent</strong>): Install the core Python libraries (TensorFlow, PyTorch, Scikit-learn, etc.). This is a frequent point of change, but copying the requirements file before running the install allows Docker to cache the potentially lengthy installation step if the requirements haven&apos;t changed.</li>
          <li><strong>Copy Project Code</strong> (<R>COPY ./src /app/src</R>): Copy your ML scripts, notebooks, utility files, etc. This often changes with every code modification.</li>
          <li><strong>Working Directory</strong> (<C>WORKDIR</C>): Set the directory context for subsequent commands.</li>
          <li><strong>Expose Ports</strong> (<C>EXPOSE</C>): Declare network ports the container will listen on (relevant for inference servers).</li>
          <li><strong>Default Command</strong> (<C>CMD</C> or <C>ENTRYPOINT</C>): Specify the command to run when the container starts.</li>
        </ol>
      </div>
    ),
  },
  {
    id: 'order-diagram',
    title: 'Layer Caching Comparison',
    subtitle: 'What a one-file edit forces Docker to redo',
    Visual: VisualBuildCache,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Here&apos;s a simplified diagram illustrating how reordering instructions impacts cache usage:</p>
        <p>
          Layer caching comparison. In the &quot;Good Order&quot; example, changing only the source code (copied last) allows Docker to reuse the cached layers for dependencies if <R>requirements.txt</R> hasn&apos;t changed. In the &quot;Less Optimal Order&quot;, copying all code early often invalidates the cache for subsequent steps like dependency installation, even if only Python scripts were modified.
        </p>
      </div>
    ),
  },
  {
    id: 'comments',
    title: 'Using Comments',
    subtitle: 'Say why a version or package is there',
    Visual: VisualMaintainability,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Ordering, maintainability is enhanced by:</p>
        <p>
          <strong>Using Comments</strong>: Add comments (<C>#</C>) to explain non-obvious steps, choices of specific versions, or the purpose of a block of commands.
        </p>
        <CodeBlock code={`# Use an official Python runtime as a parent image\nFROM python:3.9-slim\n\n# Set the working directory in the container\nWORKDIR /app\n\n# Install system dependencies needed for some Python libraries\n# Example: libgomp1 is often needed for libraries like OpenCV or LightGBM\nRUN apt-get update && apt-get install -y --no-install-recommends \\\n    libgomp1 \\\n    && rm -rf /var/lib/apt/lists/*\n\n# Install Python dependencies using the requirements file\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\n# Copy local code to the container image\nCOPY ./src /app/src\n\n# Default command to run when the container starts\nCMD ["python", "/app/src/train.py"]`} />
      </div>
    ),
  },
  {
    id: 'grouping',
    title: 'Grouping Commands',
    subtitle: 'Related apt steps in one RUN',
    Visual: VisualMaintainability,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          <strong>Grouping Commands</strong>: Combine related <C>RUN</C> commands using <C>&amp;&amp;</C> and line continuations (<C>\</C>) to create a single logical unit and potentially reduce the number of image layers. While modern builders optimize layer handling, this practice still improves readability by keeping related operations together. For instance, update the package list, install packages, and clean up apt cache files all in one <C>RUN</C> instruction.
        </p>
        <CodeBlock code={`# Less readable and potentially more layers\nRUN apt-get update\nRUN apt-get install -y package1\nRUN apt-get install -y package2\nRUN rm -rf /var/lib/apt/lists/*\n\n# More readable, single layer for this logical operation\nRUN apt-get update && apt-get install -y --no-install-recommends \\\n    package1 \\\n    package2 \\\n    && rm -rf /var/lib/apt/lists/*`} />
      </div>
    ),
  },
  {
    id: 'explicit',
    title: 'Being Explicit',
    subtitle: 'Copy only the file the next step needs',
    Visual: VisualBuildCache,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          <strong>Being Explicit</strong>: Avoid overly broad <C>COPY</C> commands like <R>COPY . .</R> early in the <R>Dockerfile</R> if possible, especially before dependency installation. Instead, explicitly copy only what&apos;s needed for a specific step (e.g., <R>COPY requirements.txt .</R> before installing dependencies, then <R>COPY ./src /app/src</R> later). This fine-grained approach maximizes cache utilization.
        </p>
        <p>
          Adopting a consistent structure for your <R>Dockerfile</R> makes your ML environments more predictable and your build process more efficient. It also makes collaboration easier, as team members can quickly understand the image&apos;s composition. As we proceed through this chapter, you&apos;ll see how this structure applies when selecting base images and managing dependencies for your specific ML needs.
        </p>
      </div>
    ),
  },
  {
    id: 'choosing-base',
    title: 'Choosing the Right Base Image',
    subtitle: 'The foundation under every later layer',
    Visual: VisualBaseImageFactors,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          Every <R>Dockerfile</R> begins with a <C>FROM</C> instruction, specifying the base image. Think of this as the foundation upon which you build your custom environment. It&apos;s not just a formality; the base image you choose significantly impacts the final image size, build time, security posture, and compatibility of your Machine Learning application. Making an informed choice here sets the stage for a smoother development and deployment process.
        </p>
        <p className="font-semibold text-white">Factors Influencing Base Image Selection</p>
        <p>When selecting a base image for your ML project, here are the key factors:</p>
        <ol className="list-decimal pl-5 space-y-1.5">
          <li><strong>Operating System and Core Libraries</strong>: Do you need a specific Linux distribution (like Ubuntu or Debian) for certain system packages, or will a minimal base suffice? A key factor here is the C standard library: most distributions use <R>glibc</R>, while Alpine Linux uses <R>musl libc</R>. This can affect compatibility with pre-compiled Python wheels, sometimes requiring packages to be compiled from source, increasing build time and complexity.</li>
          <li><strong>Pre-installed Software</strong>: Do you want an image with Python pre-installed? Or perhaps one that already includes NVIDIA drivers, CUDA toolkit, and cuDNN for GPU acceleration? Do you need a specific version combination?</li>
          <li><strong>Image Size</strong>: Smaller images are generally preferred. They consume less disk space, are faster to pull from registries, and can reduce deployment times. Minimal images often have a smaller attack surface, potentially improving security. However, minimalism can sometimes come at the cost of convenience, requiring more setup steps in your <R>Dockerfile</R>.</li>
          <li><strong>Maintenance and Trust</strong>: Official images (like <R>python</R>, <R>ubuntu</R>, <R>nvidia/cuda</R>) are generally well-maintained and regularly updated for security vulnerabilities. Using official or trusted sources is highly recommended.</li>
        </ol>
      </div>
    ),
  },
  {
    id: 'python-images',
    title: 'Official Python Images',
    subtitle: 'Full, slim, and alpine',
    Visual: VisualBaseImageFactors,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p className="font-semibold text-white">Common Base Image Categories for ML</p>
        <p>Let&apos;s look at some common starting points for ML Dockerfiles:</p>
        <p className="font-semibold text-white">1. Official Python Images</p>
        <p>These are often a practical starting point if your primary requirement is a specific Python version.</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><R>python:&lt;version&gt;</R> (e.g., <R>python:3.10</R>): Based on the latest stable Debian release. Includes Python and <R>pip</R>, along with common OS libraries needed to build many Python extensions. It&apos;s a good general-purpose choice but relatively large.</li>
          <li><R>python:&lt;version&gt;-slim</R> (e.g., <R>python:3.10-slim</R>): A smaller variant, also based on Debian. It strips out less common OS development libraries. You might need to install some system packages (<R>build-essential</R>, specific library headers like <R>libpq-dev</R>) manually if your Python packages require compilation. This often provides a good balance between size and convenience.</li>
          <li><R>python:&lt;version&gt;-alpine</R> (e.g., <R>python:3.10-alpine</R>): Based on the very minimal Alpine Linux distribution. Results in significantly smaller images. However, Alpine uses <R>musl libc</R> instead of the more common <R>glibc</R>. This means many pre-compiled Python wheels (<R>manylinux</R>) won&apos;t work directly, potentially requiring time-consuming compilation within the Docker build or hunting for Alpine-specific packages. Use with caution, especially if you have complex binary dependencies.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'os-images',
    title: 'OS Base Images',
    subtitle: 'You install Python yourself',
    Visual: VisualBaseImageFactors,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p className="font-semibold text-white">2. OS Base Images</p>
        <p>Sometimes, you might need more control or specific system tools not readily available in the Python images.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><R>ubuntu:&lt;version&gt;</R> (e.g., <R>ubuntu:22.04</R>)</li>
          <li><R>debian:&lt;version&gt;</R> (e.g., <R>debian:bullseye-slim</R>)</li>
        </ul>
        <p>
          Starting with a bare OS image means you&apos;ll need to install Python, <R>pip</R>, and all other dependencies yourself. This gives maximum control but requires more <R>Dockerfile</R> instructions. It&apos;s generally only necessary if you have complex non-Python system dependencies or very specific OS configuration requirements.
        </p>
      </div>
    ),
  },
  {
    id: 'cuda',
    title: 'NVIDIA CUDA Images',
    subtitle: 'base, runtime, or devel',
    Visual: VisualCudaVariants,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p className="font-semibold text-white">3. NVIDIA CUDA Images</p>
        <p>
          If your ML workload requires GPU acceleration, using NVIDIA&apos;s official CUDA images is the standard approach. These images come pre-configured with the necessary NVIDIA drivers, CUDA toolkit, and cuDNN libraries compatible with Docker environments running on GPU-enabled hosts (using the NVIDIA Container Toolkit).
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><R>nvidia/cuda:&lt;cuda_version&gt;-base-&lt;os_version&gt;</R> (e.g., <R>nvidia/cuda:11.8.0-base-ubuntu22.04</R>): Contains only the CUDA runtime libraries. Suitable if you <em>don&apos;t</em> need the CUDA compiler (<R>nvcc</R>) or development libraries inside the container (e.g., for pure inference).</li>
          <li><R>nvidia/cuda:&lt;cuda_version&gt;-runtime-&lt;os_version&gt;</R> (e.g., <R>nvidia/cuda:11.8.0-runtime-ubuntu22.04</R>): Includes the base runtime libraries plus CUDA math libraries and NCCL. Often sufficient for running pre-compiled applications or Python frameworks that bundle their own development headers if needed.</li>
          <li><R>nvidia/cuda:&lt;cuda_version&gt;-devel-&lt;os_version&gt;</R> (e.g., <R>nvidia/cuda:11.8.0-devel-ubuntu22.04</R>): Contains the full CUDA toolkit, including the compiler (<R>nvcc</R>), debugging tools, headers, and static libraries. Necessary if you need to compile CUDA code or some Python libraries (like PyTorch from source) inside the container. This results in the largest images.</li>
        </ul>
        <p>When using these, you&apos;ll typically install Python and your ML libraries on top. Always check the NVIDIA documentation and your ML framework&apos;s requirements for the recommended CUDA/cuDNN versions.</p>
      </div>
    ),
  },
  {
    id: 'framework',
    title: 'ML Framework Official Images',
    subtitle: 'The framework and a CUDA build, already together',
    Visual: VisualCudaVariants,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p className="font-semibold text-white">4. ML Framework Official Images</p>
        <p>Major ML frameworks often provide their own official Docker images, built upon suitable base images (like Ubuntu + CUDA).</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><R>tensorflow/tensorflow:&lt;version&gt;</R> (e.g., <R>tensorflow/tensorflow:2.11.0-gpu</R>)</li>
          <li><R>pytorch/pytorch:&lt;version&gt;</R> (e.g., <R>pytorch/pytorch:1.13.1-cuda11.7-cudnn8-runtime</R>)</li>
        </ul>
        <p className="font-semibold text-white">Pros:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Convenience: Come with the framework, specific CUDA/cuDNN versions, and often common dependencies pre-installed.</li>
          <li>Compatibility: Versions are tested to work together.</li>
        </ul>
        <p className="font-semibold text-white">Cons:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Size: Can be very large as they bundle many components.</li>
          <li>Less Control: You might get versions of libraries (CUDA, Python) or an OS base you don&apos;t strictly need.</li>
          <li>Potentially Slower Updates: May lag slightly behind official Python or CUDA image updates.</li>
        </ul>
        <p>These are excellent for getting started quickly or ensuring a specific complex environment (like a particular PyTorch build with a specific CUDA version) is set up correctly without manual configuration.</p>
      </div>
    ),
  },
  {
    id: 'decision',
    title: 'A Decision Guide',
    subtitle: 'GPU, framework, Python, or the OS',
    Visual: VisualBaseImageTree,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>Selecting the right base image involves balancing these factors. Here&apos;s a simplified decision flow:</p>
        <p>A decision guide for selecting an appropriate base Docker image for Machine Learning projects.</p>
        <p>
          For many standard ML tasks using libraries like Scikit-learn, Pandas, and potentially frameworks like TensorFlow or PyTorch (especially if installing via pip), starting with <R>python:&lt;version&gt;-slim</R> is often a sensible default. If GPU support is required, pivot to the official <R>nvidia/cuda</R> images or framework-specific GPU images. If extreme size optimization is needed and you can handle potential compatibility hurdles, <R>python:&lt;version&gt;-alpine</R> is an option.
        </p>
        <p>
          Choosing your base image thoughtfully is the first step in crafting an efficient, reproducible, and maintainable Dockerized ML environment. It sets the context for managing dependencies, copying code, and configuring the runtime, which we will cover in subsequent sections.
        </p>
      </div>
    ),
  },
  {
    id: 'pip-direct',
    title: 'Managing Python Dependencies (pip)',
    subtitle: 'An unpinned install can change next time',
    Visual: VisualDependencyPinning,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          Machine Learning projects often depend on a specific set of Python libraries, such as Scikit-learn, Pandas, NumPy, TensorFlow, or PyTorch, along with their precise versions. Ensuring that every team member, testing environment, and deployment target uses the exact same dependencies is fundamental for reproducibility. A slight difference in a library version can lead to subtle bugs, different model behavior, or outright failures. Docker provides a way to package these dependencies along with your application code, and <R>pip</R>, the standard Python package installer, is a common tool used within Dockerfiles to manage these libraries.
        </p>
        <p className="font-semibold text-white">Installing Packages Directly</p>
        <p>The most straightforward way to install a Python package inside a Docker image is using the <C>RUN</C> instruction combined with a <R>pip install</R> command.</p>
        <CodeBlock code={`# Example: Installing scikit-learn directly\nFROM python:3.9-slim\n\nRUN pip install scikit-learn`} />
        <p>
          This command instructs Docker to execute <R>pip install scikit-learn</R> during the image build process. While simple for one or two packages, this approach quickly becomes unwieldy for projects with multiple dependencies. It also doesn&apos;t explicitly define the required versions, potentially leading to different versions being installed each time the image is built.
        </p>
      </div>
    ),
  },
  {
    id: 'requirements',
    title: 'Using requirements.txt for Reproducibility',
    subtitle: 'Pin the versions the build should repeat',
    Visual: VisualDependencyPinning,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>A more organized and reproducible approach is to list your project&apos;s Python dependencies in a <R>requirements.txt</R> file. This is a standard practice in Python development.</p>
        <p>A typical <R>requirements.txt</R> file looks like this:</p>
        <CodeBlock code={`# requirements.txt\npandas==2.0.3\nscikit-learn==1.3.0\nnumpy>=1.24.0,<1.26.0\nmatplotlib==3.7.2`} />
        <p>Recommendations for your <R>requirements.txt</R>:</p>
        <ol className="list-decimal pl-5 space-y-1.5">
          <li><strong>Pin Versions</strong>: Use <C>==</C> to specify exact versions (e.g., <R>pandas==2.0.3</R>). This guarantees that the same version is installed every time, preventing unexpected changes due to library updates.</li>
          <li><strong>Use Ranges Cautiously</strong>: While flexible ranges (e.g., <R>numpy&gt;=1.24.0,&lt;1.26.0</R>) can be used, they introduce a small risk of variability if a new patch version fitting the range is released between builds. For maximum reproducibility in ML, pinning exact versions is often preferred.</li>
          <li><strong>Include Transitive Dependencies</strong>: Use tools like <R>pip freeze &gt; requirements.txt</R> in a clean local virtual environment after installing your primary dependencies. This captures the exact versions of <em>all</em> packages, including those installed indirectly, ensuring a complete snapshot of the environment.</li>
        </ol>
      </div>
    ),
  },
  {
    id: 'copy-req',
    title: 'Copy requirements.txt First',
    subtitle: 'Then install, then copy the rest of the code',
    Visual: VisualBuildCache,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>To use this file within your Dockerfile, you first <C>COPY</C> it into the image context and then run <R>pip install</R> with the <C>-r</C> flag:</p>
        <CodeBlock code={`# Example: Using requirements.txt\nFROM python:3.9-slim\n\nWORKDIR /app\n\n# Copy only the requirements file first\nCOPY requirements.txt .\n\n# Install dependencies\nRUN pip install -r requirements.txt\n\n# Now copy the rest of the application code\nCOPY . .\n\n# Define how to run the application (example)\n# CMD ["python", "train.py"]`} />
      </div>
    ),
  },
  {
    id: 'build-cache',
    title: 'Leveraging the Docker Build Cache',
    subtitle: 'A script edit should not reinstall the libraries',
    Visual: VisualBuildCache,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          Docker builds images in layers. Each instruction in the Dockerfile (like <C>COPY</C>, <C>RUN</C>, <C>WORKDIR</C>) creates a new layer. If the files or commands related to a layer haven&apos;t changed since the last build, Docker reuses the cached layer instead of rebuilding it. This significantly speeds up build times.
        </p>
        <p>Notice the order in the previous example:</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li><R>COPY requirements.txt .</R></li>
          <li><R>RUN pip install -r requirements.txt</R></li>
          <li><R>COPY . .</R></li>
        </ol>
        <p>
          This structure is intentional and optimizes caching. Installing dependencies (<R>pip install</R>) is often time-consuming. By copying <em>only</em> the <R>requirements.txt</R> file and installing dependencies <em>before</em> copying the rest of your application code, we ensure that the dependency installation layer is only rebuilt if <R>requirements.txt</R> itself changes. Frequent changes to your source code (<R>COPY . .</R>) will only invalidate the cache from that point onwards, reusing the potentially large and slow-to-build dependency layer.
        </p>
        <p>
          If you copied all your code first (<R>COPY . .</R>) and <em>then</em> ran <R>pip install -r requirements.txt</R>, any change to any file in your project would cause Docker to re-run the lengthy <R>pip install</R> step, negating the benefits of the build cache for dependencies.
        </p>
      </div>
    ),
  },
  {
    id: 'no-cache',
    title: 'Reducing Image Size with --no-cache-dir',
    subtitle: 'Leave the wheel cache out of the image',
    Visual: VisualPipCache,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          When <R>pip</R> installs packages, it typically caches the downloaded wheel files for potential reuse. While useful locally, this cache is often unnecessary inside a Docker image and contributes to its final size. You can prevent this caching using the <R>--no-cache-dir</R> flag:
        </p>
        <CodeBlock code={`# Example: Using --no-cache-dir\nFROM python:3.9-slim\n\nWORKDIR /app\n\nCOPY requirements.txt .\n\n# Install dependencies without caching downloads\nRUN pip install --no-cache-dir -r requirements.txt\n\nCOPY . .\n\n# CMD ["python", "your_script.py"]`} />
        <p>Using <R>--no-cache-dir</R> is a common practice for creating smaller production images, as the intermediate cache is unlikely to be needed once the image is built.</p>
        <p>
          By combining <R>requirements.txt</R> for defining dependencies, careful ordering of <C>COPY</C> and <C>RUN</C> instructions to optimize caching, and flags like <R>--no-cache-dir</R> to minimize size, you can effectively manage Python dependencies using <R>pip</R> within your Dockerfiles, creating lean, reproducible, and efficient environments for your Machine Learning projects.
        </p>
      </div>
    ),
  },
];

export default function BuildingCustomMLEnvironmentsWithDockerfilesPartOne() {
  return <ChapterDeck slides={slides} />;
}
