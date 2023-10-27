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

| Field                        | Description                                                                                                                                           |
|------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| vertex_count                 | The number of stored nodes (vertices).                                                                                                                |
| edge_count                   | The number of stored relationships (edges).                                                                                                           |
| average_degree               | The average number of relationships of a single node.                                                                                                 |
| memory_usage                 | The amount of RAM used reported by the OS (in bytes).                                                                                                 |
| disk_usage                   | The amount of disk space used by the data directory (in bytes)                                                                                        |
| memory_allocated             | The amount of RAM allocated by the instance (in bytes).<br/>For more info, check out the [memory control](/fundamentals/storage-memory-usage).        |
| allocation_limit             | The current allocation limit set for this instance (in bytes).<br/>For more info, check out the [memory control](/fundamentals/storage-memory-usage). |
| global_isolation_level       | The current `global` isolation level.<br/>For more info, check out the [isolation levels](/fundamentals/transactions#isolation-levels).               |
| session_isolation_level      | The current `session` isolation level.                                                                                                                |
| next_session_isolation_level | The current `next` isolation level.                                                                                                                   |
| storage_mode                 | The current storage mode.<br/>For more info, check out the [storage modes](/fundamentals/storage-memory-usage#storage-modes).                         |

## Build information

Running the following query will return certain information about the build type of
the current instance:

```cypher
SHOW BUILD INFO;
```

| Field      | Description                                         |
|------------|-----------------------------------------------------|
| build_type | The optimization level the instance was built with. |