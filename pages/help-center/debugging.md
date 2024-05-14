---
title: Debugging Memgraph by yourself
description: Utilize tools provided to you in the container to inspect what's happening in your Memgraph instance. Send us diagnostics, so we're able to identify issues quicker, and make the product more stable. 
---

# Debugging Memgraph by yourself

### Why do we expose users with the capability of debugging Memgraph?

In the process of enhancing Memgraph's performance and reliability, user-driven debugging plays a crucial role. Given the complex nature of software environments, it is often challenging for our team to address all issues simultaneously. Moreover, bugs can exhibit behaviors that are difficult to replicate on different systems. 

By conducting initial debugging, users can provide us with valuable diagnostic data from their specific environment, which is essential for reproducing and pinpointing the root cause of issues. To facilitate this, we have equipped our container with a suite of user-friendly tools designed to assist in the debugging process. 

These tools not only empower users to identify and report problems more accurately but also expedite the resolution process, enhancing overall system stability and performance.

### Which Memgraph image can I use in order to debug Memgraph?

Memgraph offers Docker images specifically tailored for debugging, with Memgraph built in **RelWithDebInfo** mode. These containers are equipped with crucial debugging tools such as **perf, gdb, and pgrep**, along with other useful apt packages. 

This setup is intended to empower users to conduct thorough investigations into issues such as slow performance, system hangs, or unusually high memory usage. Although the RelWithDebInfo build mode of Memgraph comes with some performance degradations (**~10% slower performance overall**), this approach contributes to more stable and efficient system performance in the long run. 

After identification of all the issues and moving to production, users are encouraged to switch to Release mode, with the default Memgraph images, to make sure they gain the extra performance, from the now fast and reliable system.

Memgraph in the RelWithDebInfo mode can be downloaded from DockerHub with the following command:
```bash
docker image pull
```

If you are using Memgraph MAGE, the following command should do
```bash
docker image pull
```

### I have the Memgraph image, is there anything specific I should do to run Memgraph?
Yes, Memgraph container needs to be run in the **--privileged mode**. Privileged mode is an option of the Docker ecosystem, not Memgraph. It will allow for gdb and perf tools to run properly.

Below, we can see an example command of how to run a Memgraph container in the privileged mode:

```bash
docker container run
```

### I have run Memgraph container, where should I perform the debugging?
All debugging is performed inside the container. To enter the container, you need to execute the
following command.
```bash
docker container exec -it -u root memgraph bash
```

The ```-u root``` command is there to enable root privileges inside the container, necessary for running debugging tools.

### What are all the debugging capabilities I am equipped with?
Memgraph supports the following debug capabilities:
- attaching Memgraph with `GDB` and inspecting threads
- generating a core dump after Memgraph crashed
- using `perf` to identify performance bottlenecks

we will be going through each of them in detail.

## Attaching Memgraph with GDB
`GDB` and `pgrep` are already installed packages in the Memgraph container that has the debug symbols.
Since Memgraph is already running there at the port 7687, you can attach to your Memgraph with GDB
with the following command.

```bash
gdb -p $(pgrep memgraph)
```
Most likely, the Memgraph process will have the PID number 1, but for certainty we use `pgrep`.

### List of useful commands when in GDB

| Name              | Description                                                         |
| ----------------- | ------------------------------------------------------------------- |
| `CTRL + C`        | Pausing execution.                                                  |
| `c`               | Continuing execution.                                               |
| `info thread`     | List of all executing threads.                                      |
| `t <x>`           | Positioning in a specific thread with number `x`.                   |
| `bt`              | Prints the backtrace of a thread.                                   |
| `bt full`         | Prints the backtrace with extra information.                        |
| `frame <x>`       | Positioning in a particular point in the backtrace with number `x`. |
| `list`            | Prints the 10 lines above and below the source code of the frame.   |
| `up`              | Go 1 frame up in the backtrace.                                     |
| `down`            | Go 1 frame down in the backtrace.                                   |
| `info locals`     | Prints local variables of the current frame.                        |
| `info args`       | Prints function arguments of the current frame.                     |
| `print $local_var`| Prints the value of the variable `$local_var`.                      |

### Most commonly used commands.
In Memgraph, we usually want to see first what are all the threads currently in place. We do that by issuing:

```bash
info thread
```

By identifying a certain thread with a code that could belong to the Memgraph repository, we can issue the command 

```bash
t <x>
```
where `x` is the specific thread number.

Seeing the backtrace can be done with the command
```bash
bt
```

## Generating a core dump with Memgraph

Instructions for this paragraph will be updated.

## Using `perf` to identify performance bottlenecks

Perfing is the most common operation that is run when Memgraph is hanging or performing slowly.

In the next steps, the instructions are provided on how to check which parts of Memgraph are stalling during query execution, so we can use the information to make the system better.

1. Perfing Memgraph
Inside the container, we will need to perf the system. That is done using the following command.

```bash
perf record -p $(pgrep memgraph) --call-graph dwarf sleep 5
```

The command will perf the Memgraph process for 5 seconds. Of course, you can tweak the number by yourself. The command will generate a file called `perf.data` in the directory you have performed the command in the container

2. Installing `hotspot` as the GUI tool on the host
On the outside, we will need to install a GUI tool called `hotspot`, that will help us generate a [flamegraph](https://www.brendangregg.com/flamegraphs.html). We can install `hotspot` on the host machine by issuing the command:

```bash
apt install hotspot
```

if your machine does not support APT, please check the [hotspot repo](https://github.com/KDAB/hotspot) and follow the installation steps.

3. Transferring `perf.data` to host
After we have perfed the data, we need to get the perf information from the container to the host. That is done with the following command **on the host**
```bash
docker cp <container_id>:<path_to_perf.data> .
```

where the `container_id` is the Memgraph container ID, and the `path_to_perf.data` is the absolute path in the container to the generated `perf.data` file.

4. Linking Memgraph's debug symbols in the container to the host
In order for `hotspot` to be able to identify debug symbols and draw the flamegraph, it needs the path to the debug symbols to be the exact one as in the container. In the container it is the `/usr/lib/memgraph/memgraph` binary, so we will need to make a symbolic link from the container volume to the host system:

```bash
ln -s <path_to_docker_volume_debug_symbols_binary> /usr/lib/memgraph/memgraph
```

5. Start `hotspot`
If you did everything correctly, by starting hotspot

```bash
hotspot perf.data
```

you should be able to see the flamegraph like below.

![](/pages/help-center/perf.png)
