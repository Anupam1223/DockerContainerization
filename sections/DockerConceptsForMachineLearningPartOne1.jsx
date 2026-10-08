import React from 'react';
import ChapterDeck from '../components/ChapterDeck';
import CodeBlock from '../components/CodeBlock';
import {
  VisualConsistencyAndCollab,
  VisualDependencyDiagram,
  VisualDockerRun,
  VisualImageVsContainer,
  VisualLayeredFS,
  VisualLifecycleFlow,
  VisualReproducibility,
} from '../components/DockerConceptVisuals';

export const meta = {
  title: 'Docker Concepts for Machine Learning (Part 1)',
  subtitle: 'Why containerize, what an image is, and how a container lives',
};

const C = ({ children }) => <span className="font-mono text-[13px] text-teal-200">{children}</span>;
const R = ({ children }) => <span className="font-mono text-[13px] text-rose-300">{children}</span>;

const slides = [
  {
    id: 'why',
    title: 'Why Containerize ML Projects?',
    subtitle: 'The environment is part of the result',
    Visual: VisualReproducibility,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          Machine learning projects often start smoothly but can quickly run into frustrating
          roadblocks. You might spend hours debugging an experiment that worked perfectly last
          week, only to find a subtle difference in a library version caused the failure. Or
          perhaps a model trained on your laptop behaves differently when deployed to a server,
          leading to the infamous &quot;it works on my machine&quot; dilemma. These challenges
          typically stem from inconsistencies in software environments and dependencies.
        </p>
        <p>
          Containerization, specifically using Docker, offers a powerful solution to these common
          problems. By packaging your ML code along with all its dependencies, system libraries,
          and configuration files into a single, portable unit called a container image, you
          create a self-contained environment. This environment can then be run consistently
          across different machines, ensuring reproducibility and simplifying collaboration.
        </p>
        <p>Let&apos;s examine the specific advantages of adopting containerization for your machine learning workflows:</p>
      </div>
    ),
  },
  {
    id: 'repro',
    title: 'Ensuring Reproducibility',
    subtitle: 'Same code, same dependencies, any host',
    Visual: VisualReproducibility,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          Reproducibility is fundamental to scientific research and reliable software engineering,
          and machine learning is no exception. Being able to reproduce the results of a training
          run or an inference prediction is necessary for debugging, validation, and building
          trust in your models.
        </p>
        <p>
          However, achieving reproducibility in ML can be difficult. Your results depend not only
          on your code and data but also on the intricate web of software dependencies:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>The specific version of Python.</li>
          <li>Versions of ML libraries like TensorFlow, PyTorch, scikit-learn, pandas, NumPy.</li>
          <li>System-level libraries (e.g., BLAS, LAPACK).</li>
          <li>Operating system variations.</li>
          <li>Even hardware drivers, particularly for GPU acceleration (e.g., CUDA versions).</li>
        </ul>
        <p>
          A slight change in any of these components can lead to different numerical outputs,
          convergence behavior, or outright errors. Docker encapsulates the entire software stack,
          from the OS level upwards, within the container image. Running the same container image
          guarantees that the exact same code executes with the exact same dependencies,
          regardless of the underlying host machine. This makes it significantly easier to
          reproduce experiments, track down bugs, and validate model performance across different
          stages of development and deployment.
        </p>
      </div>
    ),
  },
  {
    id: 'hell',
    title: 'Taming Dependency Management',
    subtitle: 'Two projects, one library, two versions',
    Visual: VisualDependencyDiagram,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          Machine learning projects often rely on a complex ecosystem of libraries, each with its
          own set of dependencies. Managing these dependencies manually can become a nightmare,
          often referred to as &quot;dependency hell.&quot;
        </p>
        <p>Here are some common scenarios:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong className="text-white">Project A</strong> requires TensorFlow 2.5 and <R>libraryX</R> version 1.0.
          </li>
          <li>
            <strong className="text-white">Project B</strong> requires PyTorch 1.9 and <R>libraryX</R> version 2.0.
          </li>
        </ul>
        <p>
          Installing both projects on the same machine can lead to conflicts, as <R>libraryX</R> cannot
          satisfy both version requirements simultaneously. Furthermore, ML frameworks themselves
          often have strict requirements for specific versions of libraries like CUDA and cuDNN
          for GPU support.
        </p>
        <p>
          Docker containers provide isolation. Each container runs its own isolated environment,
          completely separate from the host system and other containers. This means Project A can
          run in a container with TensorFlow 2.5 and <R>libraryX</R> v1.0, while Project B runs in a
          separate container with PyTorch 1.9 and <R>libraryX</R> v2.0, without any conflict.
        </p>
        <p>
          You define the exact dependencies needed for your project within a <R>Dockerfile</R> (which
          we&apos;ll cover in detail later), and Docker ensures that environment is created precisely
          as specified every time the container runs.
        </p>
      </div>
    ),
  },
  {
    id: 'consistency',
    title: 'Achieving Environment Consistency',
    subtitle: 'One image is the source of truth',
    Visual: VisualConsistencyAndCollab,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          Docker eliminates the &quot;works on my machine&quot; problem by ensuring that the
          development, testing, and production environments are identical. The container image
          built from your <R>Dockerfile</R> becomes the single source of truth for your
          application&apos;s environment.
        </p>
        <p>Whether you are:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Developing locally on macOS or Windows.</li>
          <li>Running tests in a CI/CD pipeline on Linux servers.</li>
          <li>Deploying your model as an API in the cloud.</li>
        </ul>
        <p>
          You are running the exact same container image. This consistency dramatically reduces
          bugs caused by environment differences and simplifies the debugging process.
        </p>
      </div>
    ),
  },
  {
    id: 'collab',
    title: 'Simplifying Collaboration',
    subtitle: 'Share the image instead of the setup list',
    Visual: VisualConsistencyAndCollab,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          Sharing ML projects often involves complex setup instructions: install Python version X,
          set up a virtual environment, install these specific libraries using pip or conda,
          configure environment variables, etc. This process is error prone and time consuming for
          new team members or collaborators.
        </p>
        <p>
          With Docker, collaboration becomes much simpler. Instead of sharing setup instructions,
          you share the <R>Dockerfile</R> or the built container image itself (often via a registry
          like Docker Hub). Anyone with Docker installed can pull the image and run the exact same
          environment with a single command (<R>docker run ...</R>), drastically reducing onboarding
          time and setup friction.
        </p>
      </div>
    ),
  },
  {
    id: 'scale',
    title: 'Streamlining Deployment and Scalability',
    subtitle: 'Production already runs containers',
    Visual: VisualConsistencyAndCollab,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          Containerized ML applications are inherently easier to deploy and scale. Because the
          container packages the application and all its dependencies, deploying it to a server or
          a cloud platform involves simply running the container image.
        </p>
        <p>
          Modern deployment platforms and orchestration tools (like Kubernetes, Docker Swarm, AWS
          ECS, Google Cloud Run) are built around containers. They make it straightforward to
          manage container lifecycles, scale the number of running containers up or down based on
          demand, handle rolling updates, and monitor application health. Containerizing your
          training workflows and inference services prepares them for these production
          environments, ensuring a smoother transition from development to deployment.
        </p>
        <p>
          In summary, containerizing your ML projects with Docker brings significant advantages in
          reproducibility, dependency management, environment consistency, collaboration, and
          deployment readiness. These benefits address common pain points in the ML development
          lifecycle, leading to more reliable, efficient, and scalable machine learning solutions.
          The rest of this course will guide you through how to leverage Docker effectively for
          your specific ML tasks.
        </p>
      </div>
    ),
  },
  {
    id: 'image',
    title: 'What is a Docker Image?',
    subtitle: 'The blueprint for a standardized environment',
    Visual: VisualImageVsContainer,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          Containerization offers a powerful way to package and isolate Machine Learning
          applications, solving common problems like dependency conflicts and ensuring consistency
          across different environments. The core component that makes this possible is the Docker
          image. Think of a Docker image as the blueprint or template for creating these
          standardized environments.
        </p>
        <p>
          A Docker image is a lightweight, standalone, executable package that includes everything
          needed to run a piece of software: the code, a runtime (like Python), system tools,
          system libraries, and settings. It&apos;s a read-only template. When you want to run the
          software defined by the image, you create a <em>container</em>, which is essentially a
          running instance of that image.
        </p>
        <p>
          If you&apos;re familiar with object-oriented programming, the image is like a class, and
          the container is like an object (an instance of the class). Or, drawing a parallel to
          virtualization, an image is somewhat like a virtual machine template or snapshot, but
          significantly more lightweight because it shares the host machine&apos;s OS kernel rather
          than bundling a full OS.
        </p>
        <p>For ML projects, an image typically bundles:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Your Python training or inference script(s).</li>
          <li>The specific Python interpreter version (e.g., Python 3.9).</li>
          <li>
            All required libraries (e.g., <R>tensorflow</R>, <R>pytorch</R>, <R>scikit-learn</R>,{' '}
            <R>pandas</R>, <R>numpy</R>) pinned to specific versions.
          </li>
          <li>Any necessary system-level dependencies or tools.</li>
          <li>Configuration files or environment variable definitions needed for your application.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'layers',
    title: 'The Layered Filesystem',
    subtitle: 'Each Dockerfile instruction adds a layer',
    Visual: VisualLayeredFS,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          Docker images are not monolithic blobs. They are constructed from a series of read-only
          layers, stacked on top of each other. Each layer represents an instruction in the
          image&apos;s Dockerfile, which is the script used to build the image. For example,
          installing a system package, copying source code, or setting an environment variable
          typically creates a new layer.
        </p>
        <p>
          A simplified view of image layers. Each instruction in a Dockerfile adds a new layer.
          When a container is run, a thin <em>writable layer</em> is added on top.
        </p>
      </div>
    ),
  },
  {
    id: 'advantages',
    title: 'Advantages of Layers',
    subtitle: 'Cache, sharing, and size',
    Visual: VisualLayeredFS,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          This layered architecture, often implemented using technologies like OverlayFS, has
          several advantages, particularly relevant for ML:
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong className="text-white">Efficiency:</strong> Layers are cached by Docker. If
            you modify your Dockerfile, Docker only needs to rebuild the layers that have changed
            and the subsequent ones. If your base OS and large ML library layers haven&apos;t
            changed, rebuilding the image to include updated application code is much faster.
          </li>
          <li>
            <strong className="text-white">Sharing:</strong> Different images can share common
            layers. If you have multiple ML images based on the same Python version or the same
            CUDA base image, that layer is stored only once on your disk and shared among them.
            This saves disk space and network bandwidth when pulling images.
          </li>
          <li>
            <strong className="text-white">Size Management:</strong> ML libraries like PyTorch or
            TensorFlow, especially with GPU support, can be very large. Understanding layers is
            the first step toward optimizing image size, a topic we&apos;ll cover later using
            techniques like multi-stage builds.
          </li>
        </ol>
      </div>
    ),
  },
  {
    id: 'base',
    title: 'Base Images',
    subtitle: 'FROM is the first choice',
    Visual: VisualLayeredFS,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          Every Docker image starts from a <em>base image</em>. This is specified by the <R>FROM</R>{' '}
          instruction in the Dockerfile. The base image provides the foundational layer(s) for your
          environment. Common choices for ML projects include:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white">Official Python Images:</strong>{' '}
            <R>python:3.10-slim-bullseye</R> provides a minimal Debian-based environment with a
            specific Python version pre-installed. Good for general Python applications.
          </li>
          <li>
            <strong className="text-white">OS Images:</strong> <R>ubuntu:22.04</R> or{' '}
            <R>debian:bullseye</R> provide a more complete Linux environment if you need specific
            system tools or libraries not included in the slim Python images.
          </li>
          <li>
            <strong className="text-white">Vendor ML Images:</strong> Companies like NVIDIA
            provide base images optimized for GPU usage (
            <R>nvidia/cuda:12.1.1-cudnn8-runtime-ubuntu22.04</R>) which include the necessary CUDA
            drivers and libraries. Framework-specific images (
            <R>tensorflow/tensorflow:latest-gpu</R> or <R>pytorch/pytorch:latest</R>) build upon
            these, adding the ML framework itself.
          </li>
        </ul>
        <p>
          Choosing the right base image involves balancing size, included components, and
          compatibility with your needs. We&apos;ll explore this selection process in more detail
          in the next chapter.
        </p>
      </div>
    ),
  },
  {
    id: 'vs',
    title: 'Images vs. Containers',
    subtitle: 'A template, then a running instance',
    Visual: VisualImageVsContainer,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>It&apos;s important to distinguish clearly between an image and a container:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white">Image:</strong> The read-only template containing the
            application and its dependencies. It exists independently of any running process.
          </li>
          <li>
            <strong className="text-white">Container:</strong> A runnable instance of an image.
            When you execute <R>docker run &lt;image_name&gt;</R>, Docker uses the image to create
            a container.
          </li>
        </ul>
        <p>
          The main difference lies in the addition of a thin <em>writable layer</em> on top of the
          read-only image layers when a container is created. Any changes made while the container
          is running, such as writing log files, creating temporary data, or modifying
          configuration within the container&apos;s filesystem, happen in this writable layer. If
          the container is deleted, this writable layer and any changes within it are lost, unless
          you explicitly use mechanisms like Docker volumes or bind mounts to persist data outside
          the container lifecycle, which we will discuss in Chapter 3.
        </p>
      </div>
    ),
  },
  {
    id: 'immutable',
    title: 'Immutability: The Path to Reproducibility',
    subtitle: 'Change the source, then build a new image',
    Visual: VisualImageVsContainer,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          Docker images are immutable. Once an image is built, it cannot be altered. If you need
          to update the code, change a dependency, or modify the configuration, you must:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5">
          <li>Modify the source (e.g., your Dockerfile or application code).</li>
          <li>
            Build a <em>new</em> image from the modified source. This new image will have a
            different ID.
          </li>
        </ol>
        <p>
          This immutability is a foundation of reproducibility in ML. An image captures the{' '}
          <em>exact</em> state of the environment, dependencies, and code at the time it was built.
          If you share this image (e.g., via a registry like Docker Hub), anyone else can pull it
          and run a container, guaranteeing they have the identical environment you used. This
          eliminates the &quot;it works on my machine&quot; problem often encountered when
          collaborating or deploying ML models.
        </p>
        <p>
          Understanding these fundamentals of Docker images, layers, base images, and the
          image-container relationship provides the foundation for effectively building, managing,
          and sharing the consistent environments needed for Machine Learning workflows.
        </p>
      </div>
    ),
  },
  {
    id: 'run',
    title: 'Creating and Running Containers: docker run',
    subtitle: 'Flags for real ML workflows',
    Visual: VisualDockerRun,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          Running a Docker image as a container is a fundamental operation. A container is a live,
          runnable instance created from an image. Managing the lifecycle of these
          containers—including running, stopping, inspecting, and removing them—is fundamental to
          using Docker effectively, especially for machine learning tasks like executing training
          scripts or deploying inference endpoints.
        </p>
        <p>
          The primary command for creating and starting a new container is <R>docker run</R>. At
          its simplest, you provide the image name:
        </p>
        <CodeBlock>{`docker run <image_name>`}</CodeBlock>
        <p>
          However, for practical ML workflows, you&apos;ll typically use several options (flags) to
          control the container&apos;s behavior:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white">Running in the Background (<R>-d</R> or <R>--detach</R>):</strong>{' '}
            Most ML training jobs or inference servers need to run independently of your terminal
            session. The <R>-d</R> flag starts the container in detached mode, printing the
            container ID and returning control to your terminal.
            <CodeBlock>{`# Example: Run a container based on a custom 'my-ml-app' image in the background
docker run -d my-ml-app`}</CodeBlock>
          </li>
          <li>
            <strong className="text-white">Interactive Sessions (<R>-it</R>):</strong> Sometimes
            you need to interact directly with the container&apos;s shell, perhaps to debug a
            script, explore data, or run commands manually. Combining <R>-i</R> (interactive) and{' '}
            <R>-t</R> (pseudo-TTY) allows this. You typically specify a shell like <C>/bin/bash</C>{' '}
            as the command to run.
            <CodeBlock>{`# Example: Start an interactive bash shell in a python container
docker run -it python:3.9-slim /bin/bash`}</CodeBlock>
            Inside the container, you&apos;ll get a prompt (e.g., <R>root@&lt;container_id&gt;:/#</R>)
            where you can execute commands. Type <R>exit</R> to leave and stop the container.
          </li>
          <li>
            <strong className="text-white">Automatic Removal (<R>--rm</R>):</strong> For
            short-lived tasks like running a training script once, it&apos;s convenient to have the
            container automatically removed when it finishes. The <R>--rm</R> flag handles this
            cleanup.
            <CodeBlock>{`# Example: Run a training script and remove the container afterwards
docker run --rm my-training-image python train.py --epochs 10`}</CodeBlock>
          </li>
          <li>
            <strong className="text-white">Assigning Names (<R>--name</R>):</strong> Docker
            assigns random names to containers (like <R>pensive_mcnulty</R>). Assigning a specific
            name makes containers easier to identify and manage.
            <CodeBlock>{`# Example: Run an inference server container with a specific name
docker run -d --name inference_api my-inference-image`}</CodeBlock>
          </li>
          <li>
            <strong className="text-white">Port Mapping (<R>-p</R>):</strong> To access an
            application running inside a container (like a web API for inference) from your host
            machine, you need to map a port on the host to a port inside the container. (Format:{' '}
            <R>host_port:container_port</R>)
            <CodeBlock>{`# Example: Map port 8080 on the host to port 80 in the container
docker run -d -p 8080:80 --name web_server nginx`}</CodeBlock>
          </li>
          <li>
            <strong className="text-white">Volumes and Environment Variables (<R>-v</R>, <R>-e</R>):</strong>{' '}
            You&apos;ll frequently need to mount directories from your host into the container
            (using <R>-v</R> for data or code) and pass configuration parameters (using <R>-e</R>{' '}
            for environment variables like hyperparameters or API keys). These are covered in more
            detail in Chapters 2 and 3.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'ps',
    title: 'Listing Containers: docker ps',
    subtitle: 'What is running, and what has stopped',
    Visual: VisualLifecycleFlow,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          To see which containers are currently running, use the <R>docker ps</R> command:
        </p>
        <CodeBlock>{`docker ps`}</CodeBlock>
        <p>
          This outputs a table showing the container ID, image used, command being run, creation
          time, status, exposed ports, and assigned name.
        </p>
        <p>
          To see <em>all</em> containers, including those that have stopped (e.g., a completed
          training job or a crashed process), add the <R>-a</R> flag:
        </p>
        <CodeBlock>{`docker ps -a`}</CodeBlock>
        <p>
          This is particularly useful for checking the exit status of completed tasks or finding
          containers you need to remove.
        </p>
      </div>
    ),
  },
  {
    id: 'stop',
    title: 'Stopping and Starting Containers',
    subtitle: 'docker stop and docker start',
    Visual: VisualLifecycleFlow,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          You can stop a running container using its name or ID with the <R>docker stop</R>{' '}
          command. This sends a signal (SIGTERM) to the main process inside the container,
          allowing it to shut down gracefully (within a default timeout, after which it&apos;s
          forcibly killed with SIGKILL).
        </p>
        <CodeBlock>{`# Stop the container named 'inference_api'
docker stop inference_api`}</CodeBlock>
        <p>
          A stopped container still exists and can be restarted with its previous state preserved
          using <R>docker start</R>:
        </p>
        <CodeBlock>{`# Restart the 'inference_api' container
docker start inference_api`}</CodeBlock>
        <p>
          While <R>docker start</R> is less common for ephemeral training tasks (which are often
          run with <R>--rm</R>), it can be useful for restarting development servers or
          long-running services managed manually.
        </p>
      </div>
    ),
  },
  {
    id: 'rm',
    title: 'Removing Containers: docker rm',
    subtitle: 'Stopped containers still take disk',
    Visual: VisualLifecycleFlow,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          Stopped containers consume disk space. Once you&apos;re finished with a container (e.g.,
          after a training run or when debugging is complete), you should remove it using{' '}
          <R>docker rm</R> followed by the container name or ID. You can only remove stopped
          containers unless you use the force flag (<R>-f</R>).
        </p>
        <CodeBlock>{`# Remove the stopped container named 'old_experiment'
docker rm old_experiment

# Force remove a running container (use with caution)
# docker rm -f some_running_container`}</CodeBlock>
        <p>To remove multiple stopped containers at once, you can list their IDs or names:</p>
        <CodeBlock>{`docker rm container_id1 container_name2`}</CodeBlock>
        <p>A convenient command to remove <em>all</em> stopped containers is:</p>
        <CodeBlock>{`docker container prune`}</CodeBlock>
        <p>Docker will ask for confirmation before proceeding. This is helpful for routine cleanup.</p>
      </div>
    ),
  },
  {
    id: 'logs',
    title: 'Inspecting Logs: docker logs',
    subtitle: 'stdout and stderr of the main process',
    Visual: VisualLifecycleFlow,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          Understanding what&apos;s happening inside a container, especially one running in
          detached mode, relies heavily on inspecting its logs (the standard output and standard
          error streams of its main process). The <R>docker logs</R> command retrieves these logs.
        </p>
        <CodeBlock>{`# Show logs for the 'inference_api' container
docker logs inference_api`}</CodeBlock>
        <p>This is essential for:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Monitoring the progress of ML training jobs (e.g., epoch numbers, loss values).</li>
          <li>Debugging errors or crashes in scripts running inside the container.</li>
          <li>Viewing the output of inference servers (e.g., request logs).</li>
        </ul>
        <p>
          To follow the logs in real-time (similar to <R>tail -f</R> on Linux), use the <R>-f</R>{' '}
          flag:
        </p>
        <CodeBlock>{`# Follow the logs of the 'training_job_1' container
docker logs -f training_job_1`}</CodeBlock>
        <p>
          Press <R>Ctrl+C</R> to stop following.
        </p>
      </div>
    ),
  },
  {
    id: 'lifecycle',
    title: 'Container Lifecycle Diagram',
    subtitle: 'Created, running, stopped, removed',
    Visual: VisualLifecycleFlow,
    content: (
      <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
        <p>
          The following diagram illustrates the typical states of a container and the commands
          used to transition between them:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <C>docker create</C> (implicit in <C>run</C>) → Created
          </li>
          <li>
            <C>docker start</C> (or <C>docker run</C>) → Running
          </li>
          <li>
            <C>docker stop</C> (or process exits) → Stopped, and <C>docker start</C> returns to Running
          </li>
          <li>
            <C>docker rm</C>, <C>docker rm -f</C>, or <C>docker run --rm</C> → Removed
          </li>
        </ul>
        <p>
          Basic Docker container states and the commands triggering transitions between them.
        </p>
        <p>
          Mastering these lifecycle commands (<R>run</R>, <R>ps</R>, <R>stop</R>, <R>start</R>,{' '}
          <R>logs</R>, <R>rm</R>) is necessary for effectively using Docker in your machine
          learning projects. They allow you to execute tasks, monitor progress, manage resources,
          and debug issues within your containerized environments. As we proceed, these commands
          will become second nature as you build, run, and manage your own ML containers.
        </p>
      </div>
    ),
  },
];

export default function DockerConceptsForMachineLearningPartOne() {
  return <ChapterDeck slides={slides} />;
}
