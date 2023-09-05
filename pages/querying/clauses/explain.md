---
title: EXPLAIN clause
description: Learn to effectively use the DELETE clause in Memgraph. Our comprehensive documentation ensures competent data management for graph computing.
---

# EXPLAIN clause

The EXPLAIN clause can be used to inspect a particular Cypher query in order to see its
execution plan.

For example, the following query will return the execution plan:

```cypher
EXPLAIN MATCH (n) RETURN n;
```

```
+----------------+
| QUERY PLAN     |
+----------------+
|  * Produce {n} |
|  * ScanAll (n) |
|  * Once        |
+----------------+
```

For more information, check the [reference guide on inspecting
queries](/querying/performance-optimization). 