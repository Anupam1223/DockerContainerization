import React from 'react';
import ChapterDeck from '../components/ChapterDeck';
import CodeBlock from '../components/CodeBlock';
import {
  VisualBindMount,
  VisualEphemeral,
  VisualPracticalRun,
  VisualPracticalScript,
  VisualStorageDiagram,
  VisualVolumeSharing,
} from '../components/ManagingDataAndModelsPartOneVisualizers';

const C = ({ children }) => <span className="font-mono text-[13px] text-teal-200">{children}</span>;
const R = ({ children }) => <span className="font-mono text-[13px] text-rose-300">{children}</span>;

export const meta = {
  title: 'Managing Data and Models in Containers (Part 1)',
  subtitle: 'Ephemeral storage, bind mounts, and volumes',
};

const slides = [
  {
    id: 'storage-ephemeral',
    title: 'Understanding Container Storage',
    subtitle: 'The writable layer disappears with the container',
    Visual: VisualEphemeral,
    content: (
      <>
        <p>
          Machine Learning workflows heavily rely on data. You need datasets to train your models, you might generate intermediate checkpoints during long training runs, and ultimately, you need to save the trained model artifacts. When working with containers, understanding how data is handled is fundamental, because the default behavior isn&apos;t persistence.
        </p>
        <p>
          Let&apos;s look at what happens when a container runs. Docker creates a writable layer on top of the read-only image layers. Think of the image as a blueprint and the container as a running instance built from that blueprint. Any changes the running application makes, such as creating files, modifying existing ones, or downloading data, are written to this specific container&apos;s writable layer.
        </p>
        <p>
          The significant point here is that this writable layer is <em>ephemeral</em>. It is tightly coupled to the life of that single container instance. When the container is stopped and removed (which happens frequently, for example, when updating an application or simply cleaning up resources), this writable layer, along with all the data it contains, is permanently deleted. Imagine downloading a large dataset or completing hours of model training, only to have the results vanish when the container is removed. This clearly won&apos;t work for most ML tasks.
        </p>
      </>
    ),
  },
  {
    id: 'storage-why',
    title: 'Understanding Container Storage',
    subtitle: 'Persistence, sharing, and decoupling',
    Visual: VisualStorageDiagram,
    content: (
      <>
        <p>We need ways to store data persistently, independent of the container&apos;s lifecycle. We need mechanisms that allow:</p>
        <ol>
          <li><strong>Data Persistence:</strong> Ensuring datasets, logs, model checkpoints, and final models survive container restarts or removals.</li>
          <li><strong>Data Sharing:</strong> Making data from the host machine available <em>inside</em> the container (like source code or local datasets during development).</li>
          <li><strong>Data Decoupling:</strong> Separating the application logic (in the container image) from the data it operates on.</li>
        </ol>
        <p>Docker provides two primary mechanisms to achieve this, which form the core of managing data in containerized ML applications:</p>
        <ul>
          <li><strong>Bind Mounts:</strong> These directly map a file or directory from your host machine&apos;s filesystem into the container. Changes made in the container are reflected on the host, and vice-versa.</li>
          <li><strong>Volumes:</strong> These are storage areas managed by Docker itself. They are stored within a specific part of the host filesystem managed by Docker, but their exact location isn&apos;t something you typically interact with directly. Volumes are the preferred method for persisting container-generated data.</li>
        </ul>
        <p>The following diagram illustrates the relationship between the container&apos;s ephemeral layer and these persistent storage options.</p>
        <p>
          Data within the Container Writable Layer is lost when the container is removed. Bind mounts link directly to the host filesystem, while volumes provide Docker-managed persistent storage.
        </p>
        <p>
          Understanding this distinction between the container&apos;s internal, ephemeral storage and externally mounted persistent storage is the first step towards effectively managing datasets, models, and other artifacts in your containerized ML projects. In the following sections, we will examine bind mounts and volumes in detail, discussing their use cases, advantages, and disadvantages for different ML scenarios.
        </p>
      </>
    ),
  },
  {
    id: 'bind-dev',
    title: 'Using Bind Mounts for Development',
    subtitle: 'A live link to a host directory',
    Visual: VisualBindMount,
    content: (
      <>
        <p>
          Containers provide isolated environments, but this isolation presents a challenge when you need to access or modify files that live <em>outside</em> the container, particularly during the active development phase of your Machine Learning project. Rebuilding a Docker image every time you tweak a line of Python code or update a configuration file is inefficient and significantly slows down the iteration cycle.
        </p>
        <p>
          This is where <strong>bind mounts</strong> come into play. A bind mount establishes a direct link, or mapping, between a directory or file on your host machine (your computer&apos;s filesystem) and a directory or file inside the container. Unlike the <R>COPY</R> instruction in a Dockerfile, which creates a static snapshot of your files <em>at build time</em>, a bind mount provides a live, dynamic connection. Changes made to the mounted directory or file on the host system are immediately reflected inside the container, and conversely (depending on permissions), changes made inside the container&apos;s mounted path can affect the host system&apos;s files.
        </p>
        <p>Think of it like creating a shared folder between your host machine and the container. This direct access is extremely useful during development for several reasons:</p>
        <ol>
          <li><strong>Rapid Code Iteration:</strong> Edit your Python scripts, notebooks, or configuration files using your preferred editor on the host machine. The updated code is instantly available within the container, allowing you to rerun your scripts or analyses without rebuilding the image.</li>
          <li><strong>Accessing Local Data:</strong> For smaller datasets or configuration files stored locally, you can mount the host directory containing this data directly into the container where your ML script expects it.</li>
          <li><strong>Real-time Debugging:</strong> Use debugging tools that rely on accessing source code files. With bind mounts, the debugger running inside the container can access the up-to-date source files residing on your host.</li>
        </ol>
      </>
    ),
  },
  {
    id: 'bind-flags',
    title: 'Implementing Bind Mounts',
    subtitle: '-v, or the more explicit --mount',
    Visual: VisualBindMount,
    content: (
      <>
        <p>You create bind mounts when you start a container using the <C>docker run</C> command. There are two primary flags for this:</p>
        <p><strong>1. The <C>-v</C> or <C>--volume</C> flag (simpler syntax):</strong></p>
        <CodeBlock code={`docker run -v /path/on/host:/path/in/container image_name [command]`} />
        <p>This syntax maps <C>/path/on/host</C> from your computer directly to <C>/path/in/container</C> inside the container.</p>
        <p><strong>2. The <C>--mount</C> flag (more explicit syntax):</strong></p>
        <CodeBlock code={`docker run --mount type=bind,source=/path/on/host,target=/path/in/container image_name [command]`} />
        <p>
          This syntax is often preferred for its clarity. It explicitly states the <C>type</C> is <C>bind</C>, the <C>source</C> is the host path, and the <C>target</C> is the container path. You can add other options like <C>readonly</C> if needed.
        </p>
        <p>Let&apos;s look at a common ML development scenario. Suppose you have a project structure on your host machine like this:</p>
        <CodeBlock>{`/home/user/my_ml_project/
├── src/
│   └── train.py
├── data/
│   └── features.csv
└── Dockerfile`}</CodeBlock>
        <p>
          You&apos;ve built an image named <C>my-ml-dev-env</C> using the <R>Dockerfile</R> which contains Python, scikit-learn, and pandas. Now, you want to run the <C>train.py</C> script inside the container, using the <C>features.csv</C> data, while still being able to edit <C>train.py</C> on your host.
        </p>
      </>
    ),
  },
  {
    id: 'bind-example',
    title: 'Implementing Bind Mounts',
    subtitle: 'Map src and data into the container',
    Visual: VisualBindMount,
    content: (
      <>
        <p>You can achieve this using a bind mount:</p>
        <CodeBlock>{`# Using the --mount syntax
docker run --rm -it \\
  --mount type=bind,source=/home/user/my_ml_project/src,target=/app/src \\
  --mount type=bind,source=/home/user/my_ml_project/data,target=/app/data \\
  my-ml-dev-env \\
  python /app/src/train.py --data_path /app/data/features.csv`}</CodeBlock>
        <p>Or using the <C>-v</C> shorthand:</p>
        <CodeBlock>{`# Using the -v syntax
docker run --rm -it \\
  -v /home/user/my_ml_project/src:/app/src \\
  -v /home/user/my_ml_project/data:/app/data \\
  my-ml-dev-env \\
  python /app/src/train.py --data_path /app/data/features.csv`}</CodeBlock>
        <p>In both examples:</p>
        <ul>
          <li>We map the local <C>src</C> directory to <C>/app/src</C> inside the container.</li>
          <li>We map the local <C>data</C> directory to <C>/app/data</C> inside the container.</li>
          <li>We then execute the <C>train.py</C> script located within the container&apos;s mapped path <C>/app/src</C>.</li>
          <li>The script accesses data via the container&apos;s mapped path <C>/app/data</C>.</li>
        </ul>
        <p>
          Now, if you open <C>/home/user/my_ml_project/src/train.py</C> on your host machine and make changes, those changes are immediately effective the next time you run the <C>docker run</C> command (or if you were running an interactive shell or server within the container, the changes would be reflected immediately upon accessing the file).
        </p>
        <p>
          A diagram illustrating how directories on the host machine (<C>my_ml_project/src</C>, <C>my_ml_project/data</C>) are mapped directly into the container&apos;s filesystem (<C>/app/src</C>, <C>/app/data</C>) using bind mounts.
        </p>
      </>
    ),
  },
  {
    id: 'bind-notes',
    title: 'Notes for Bind Mounts',
    subtitle: 'Useful in development, tied to the host',
    Visual: VisualBindMount,
    content: (
      <>
        <p>While powerful for development, keep these points in mind:</p>
        <ul>
          <li><strong>Host Dependency:</strong> Bind mounts create a tight coupling between the container and the specific host machine&apos;s file structure. The source path <em>must</em> exist on the host where you run the <C>docker run</C> command. This makes images less portable if they rely heavily on specific host paths being mounted.</li>
          <li><strong>Permissions:</strong> File ownership and permissions can sometimes cause issues. The user inside the container might not have the necessary permissions to read or write to the mounted host directory, or files created inside the container might have unexpected ownership on the host. Docker attempts to manage this, but inconsistencies can arise, especially across different operating systems.</li>
          <li><strong>Performance:</strong> For I/O-intensive operations on large files, bind mounts might incur a slight performance overhead compared to Docker-managed volumes, although this is often negligible for typical development tasks.</li>
          <li><strong>Platform Differences:</strong> File paths are specified differently on Windows (<C>C:\Users\...</C>) versus Linux/macOS (<C>/home/user/...</C>). Be mindful of this when sharing <C>docker run</C> commands or scripts across different development environments.</li>
        </ul>
        <p>
          Bind mounts are an indispensable tool for streamlining the inner loop of ML development: editing code, running experiments, and accessing local resources within the consistent environment provided by your Docker container. They bridge the gap between your host machine and the containerized environment precisely when you need that direct, real-time connection. However, for managing persistent data more robustly, especially in non-development scenarios or when sharing data between containers, Docker offers another mechanism: Volumes, which we will explore next.
        </p>
      </>
    ),
  },
  {
    id: 'volume-intro',
    title: 'Using Docker Volumes for Persistence',
    subtitle: 'Docker owns the storage, you use the name',
    Visual: VisualVolumeSharing,
    content: (
      <>
        <p>
          Containerizing application code offers benefits like consistency in deployment, but it introduces a challenge for Machine Learning tasks due to the temporary, or &apos;ephemeral,&apos; nature of containers. When containers are stopped or removed, any data stored within them is lost. For ML projects, this poses a significant problem: how are large datasets accessed, and how are computationally intensive trained models preserved? A method is essential to persist data independently from a container&apos;s lifespan.
        </p>
        <p>
          Docker Volumes are the preferred mechanism for persisting data generated by and used by Docker containers. Think of a volume as a dedicated, Docker-managed directory on the host machine&apos;s filesystem. The significant advantage is that Docker manages the volume&apos;s storage area, lifecycle, and permissions, decoupling the data entirely from any specific container.
        </p>
        <p>
          Unlike bind mounts (which we&apos;ll discuss next), where you map a specific directory from your host machine into the container, volumes are created and managed by Docker itself. You interact with them by name. This abstraction makes them easier to manage across different environments and platforms.
        </p>
      </>
    ),
  },
  {
    id: 'volume-manage',
    title: 'Creating and Managing Volumes',
    subtitle: 'create, ls, inspect, and rm',
    Visual: VisualVolumeSharing,
    content: (
      <>
        <p>You can explicitly create a volume using the Docker command line:</p>
        <CodeBlock code={`docker volume create my-ml-data`} />
        <p>
          This command creates a new volume named <C>my-ml-data</C>. Docker handles <em>where</em> on the host filesystem this volume physically resides. You typically don&apos;t need to know the exact host path, just the volume&apos;s name.
        </p>
        <p>You can list existing volumes:</p>
        <CodeBlock code={`docker volume ls`} />
        <p>Output:</p>
        <CodeBlock>{`DRIVER    VOLUME NAME
local     my-ml-data`}</CodeBlock>
        <p>To get more details about a specific volume, including its mount point on the host (though you rarely interact with this directly):</p>
        <CodeBlock code={`docker volume inspect my-ml-data`} />
        <p>And to remove a volume when you no longer need its data (use with caution!):</p>
        <CodeBlock code={`docker volume rm my-ml-data`} />
        <p>
          Importantly, you don&apos;t always need to create volumes explicitly beforehand. If you specify a named volume when running a container and the volume doesn&apos;t exist, Docker will create it for you automatically.
        </p>
      </>
    ),
  },
  {
    id: 'volume-mount',
    title: 'Using Volumes with Containers',
    subtitle: 'Remove the container, keep the data',
    Visual: VisualVolumeSharing,
    content: (
      <>
        <p>
          To make the data within a volume accessible to a container, you mount it using the <C>-v</C> or <C>--mount</C> flag with the <C>docker run</C> command. The most common syntax using <C>-v</C> specifies the volume name and the path inside the container where it should be mounted:
        </p>
        <CodeBlock>{`# Syntax: -v <volume-name>:<path-in-container>
docker run -d --name my-training-app -v my-ml-data:/app/data my-image`}</CodeBlock>
        <p>In this example:</p>
        <ul>
          <li><C>my-ml-data</C> is the name of the Docker volume (Docker will create it if it doesn&apos;t exist).</li>
          <li><C>/app/data</C> is the absolute path inside the container where the volume&apos;s contents will appear. Any data the application writes to <C>/app/data</C> will be stored in the <C>my-ml-data</C> volume on the host.</li>
        </ul>
        <p>If you stop and remove the <C>my-training-app</C> container:</p>
        <CodeBlock>{`docker stop my-training-app
docker rm my-training-app`}</CodeBlock>
        <p>The <C>my-ml-data</C> volume and all the data stored within it <em>remain untouched</em>. You can then start a new container and mount the same volume to access the persisted data.</p>
        <CodeBlock>{`# Start a new container, maybe for inference, mounting the same volume
docker run --name my-inference-app -v my-ml-data:/app/input-models my-other-image`}</CodeBlock>
        <p>Now, the second container can read the models or data saved by the first container from its <C>/app/input-models</C> directory.</p>
      </>
    ),
  },
  {
    id: 'volume-benefits',
    title: 'Benefits for ML Workflows',
    subtitle: 'Data outlives the container that wrote it',
    Visual: VisualVolumeSharing,
    content: (
      <>
        <p>Using volumes offers several advantages, particularly for ML tasks:</p>
        <ol>
          <li><strong>Data Persistence:</strong> This is the primary benefit. Large datasets, trained model files (<C>.h5</C>, <C>.pkl</C>, SavedModel formats), checkpoints, logs, and evaluation metrics stored in a volume survive container restarts, removals, and updates.</li>
          <li><strong>Decoupling Storage from Containers:</strong> The lifecycle of your data is independent of your application container. You can update your training script&apos;s Docker image without losing your datasets or trained models.</li>
          <li><strong>Sharing Data Between Containers:</strong> Volumes are easily shared among multiple containers. A common pattern is having a training container write a model to a volume, and a separate inference or evaluation container mount the same volume to read the model.</li>
          <li><strong>Performance:</strong> Docker manages the volume&apos;s location and I/O. On systems like Docker Desktop (macOS, Windows), volumes often provide better I/O performance for disk-intensive operations compared to bind-mounting directories from the host user&apos;s space, due to filesystem virtualization layers.</li>
          <li><strong>Backup and Migration:</strong> Docker provides commands and tools that can facilitate backing up volume data or migrating volumes between hosts, although managing backups often involves strategies specific to the volume&apos;s data content.</li>
          <li><strong>Platform Consistency:</strong> Docker manages the volume storage location, providing a more consistent behaviour across different host operating systems (Linux, macOS, Windows) compared to bind mounts, which rely on host-specific paths.</li>
        </ol>
        <p>
          This diagram shows how Docker Volumes exist within a Docker-managed area on the host filesystem. Containers, like the &apos;Training Container&apos; and &apos;Inference Container&apos;, mount these volumes to specific paths inside them (e.g., <C>/data_in_cont</C>, <C>/model_in_cont</C>) allowing persistent storage and data sharing independent of the container lifecycles.
        </p>
      </>
    ),
  },
  {
    id: 'volume-cases',
    title: 'Common ML Use Cases for Volumes',
    subtitle: 'Datasets, models, logs, and checkpoints',
    Visual: VisualVolumeSharing,
    content: (
      <>
        <p>Volumes are well-suited for managing various types of persistent data in ML projects:</p>
        <ul>
          <li><strong>Datasets:</strong> Storing large datasets (images, text corpora, tabular data) that your training container needs to read.</li>
          <li><strong>Trained Models:</strong> Saving model artifacts generated by training jobs (e.g., weights, model architecture files).</li>
          <li><strong>Logs and Metrics:</strong> Persisting training logs, TensorBoard event files, or evaluation results generated during runs.</li>
          <li><strong>Checkpoints:</strong> Saving intermediate model states during long training processes, allowing resumption if interrupted.</li>
          <li><strong>Preprocessed Data:</strong> Storing features or intermediate data representations generated by one container to be used by another.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'save-script',
    title: 'Practical Example: Saving a Model Artifact',
    subtitle: 'A script that writes into /app/output',
    Visual: VisualPracticalScript,
    content: (
      <>
        <p>
          Let&apos;s illustrate with a simple example. Imagine a Python script (<C>save_model.py</C>) inside a container that simulates saving a model artifact.
        </p>
        <p><C>save_model.py</C>:</p>
        <CodeBlock code={`import os
import time
import datetime

# Define the output directory INSIDE the container
output_dir = "/app/output"
# Create a unique filename based on time
timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
model_filename = os.path.join(output_dir, f"model_{timestamp}.txt")

# Ensure output directory exists (best practice inside container)
os.makedirs(output_dir, exist_ok=True)

print(f"Simulating model training...")
time.sleep(1) # Simulate work
print(f"Saving simulated model artifact to: {model_filename}")

# Write some content to the file
with open(model_filename, "w") as f:
    f.write("This is a simulated model artifact.\\n")
    f.write(f"Saved at: {datetime.datetime.now()}\\n")

print("Model artifact saved.")`} />
        <p><R>Dockerfile</R>:</p>
        <CodeBlock>{`FROM python:3.9-slim
WORKDIR /app
COPY save_model.py .
# Default command to run the script
CMD ["python", "save_model.py"]`}</CodeBlock>
        <p>Now, let&apos;s build the image and run it, using a volume named <C>model-storage</C> to persist the output.</p>
      </>
    ),
  },
  {
    id: 'save-run',
    title: 'Practical Example: Saving a Model Artifact',
    subtitle: 'The container is removed, the file is not',
    Visual: VisualPracticalRun,
    content: (
      <>
        <CodeBlock>{`# 1. Build the Docker image
docker build -t simple-saver .

# 2. Create a named volume (optional, docker run can create it too)
# docker volume create model-storage

# 3. Run the container, mounting the volume to /app/output
#    The --rm flag automatically removes the container when it exits.
echo "Running container to save model..."
docker run --rm \\
  -v model-storage:/app/output \\
  --name saver-instance \\
  simple-saver

# The container runs, prints messages, saves the file to /app/output, then exits.
# The container is removed, but the data persists in the 'model-storage' volume.

# 4. Verify the data exists by inspecting the volume from another container
echo "Checking volume contents..."
docker run --rm \\
  -v model-storage:/data \\
  python:3.9-slim ls -l /data`}</CodeBlock>
        <p>You should see output similar to this (the exact filename will differ):</p>
        <CodeBlock>{`Running container to save model...
Simulating model training...
Saving simulated model artifact to: /app/output/model_20231027_103045.txt
Model artifact saved.
Checking volume contents...
total 4
-rw-r--r-- 1 root root 81 Oct 27 10:30 model_20231027_103045.txt`}</CodeBlock>
        <p>
          This demonstrates that even though the <C>saver-instance</C> container was removed, the model file it created inside <C>/app/output</C> was persisted in the <C>model-storage</C> volume and could be accessed later (in this case, by a temporary <C>python:3.9-slim</C> container mounting the same volume).
        </p>
        <p>
          In summary, Docker volumes provide a reliable and manageable way to handle persistent data requirements in containerized ML applications. They allow you to separate your data concerns from your application code, ensuring that datasets, models, and logs persist beyond individual containers, which is essential for effective ML development and deployment workflows.
        </p>
      </>
    ),
  },
];

export default function ManagingDataAndModelsPartOne() {
  return <ChapterDeck slides={slides} />;
}
