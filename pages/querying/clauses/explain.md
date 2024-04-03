---
title: EXPLAIN clause
description: Learn to effectively use the EXPLAIN clause in Memgraph. Our comprehensive documentation ensures competent data management for graph computing.
---

# EXPLAIN clause

The `EXPLAIN` clause can be used to inspect a particular Cypher query in order to see its [execution plan](/querying/query-plan).

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
