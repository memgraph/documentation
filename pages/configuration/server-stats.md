---
title: Server stats
description: Monitor the performance and health of your Memgraph server with confidence. Head over to Memgraph's documentation page to gain more insights into server stats.
---

# Server stats

Memgraph supports multiple queries to get information about the instance that is
being queried.

## Instance version

To get the version of the instance being queried, run the following query:

```cypher
SHOW VERSION;
```

## Storage information

Running the following query will return certain information about the storage of
the current instance:

```cypher
SHOW STORAGE INFO;
```

The result will contain the following fields:

| Field                        | Description                                                                                                                                                                                   |
|------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| vertex_count                 | The number of stored nodes (vertices).                                                                                                                                                        |
| edge_count                   | The number of stored relationships (edges).                                                                                                                                                   |
| average_degree               | The average number of relationships of a single node.                                                                                                                                         |
| memory_res                   | The non-swapped physical RAM memory a task has used, reported by the OS (in B, KiB, MiB, GiB or TiB).                                                                                                                       |
| disk_usage                   | The amount of disk space used by the data directory (in B, KiB, MiB, GiB or TiB).                                                                                                             |
| memory_tracked               | The amount of RAM allocated in the system and tracked by Memgraph (in B, KiB, MiB, GiB or TiB).<br/>For more info, check out [memory control](/fundamentals/storage-memory-usage).        |
| vm_max_map_count             | The number of memory-mapped areas that the kernel allows a process to have. If it is unknown, returns -1. </br> For more info, check out [virtual memory section of the docs](/fundamentals/storage-memory-usage#virtual-memory).                                    |
| allocation_limit             | The current allocation limit set for this instance (in B, KiB, MiB, GiB or TiB).<br/>For more info, check out the [memory control](/fundamentals/storage-memory-usage#control-memory-usage).                       |
| global_isolation_level       | The current `global` isolation level.<br/>For more info, check out [isolation levels](/fundamentals/transactions#isolation-levels).                                                       |
| session_isolation_level      | The current `session` isolation level.                                                                                                                                                        |
| next_session_isolation_level | The current `next` isolation level.                                                                                                                                                           |
| storage_mode                 | The current storage mode.<br/>For more info, check out [storage modes](/fundamentals/storage-memory-usage#storage-modes).                                                                 |

## Build information

Running the following query will return certain information about the build type of
the current instance:

```cypher
SHOW BUILD INFO;
```

| Field      | Description                                         |
|------------|-----------------------------------------------------|
| build_type | The optimization level the instance was built with. |