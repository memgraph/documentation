---
title: PROFILE clause
description: Leverage the PROFILE clause in Memgraph. Detailed guide categorizes information for proficient graph computing.
---

# PROFILE clause

When improving your query performance, one of the most important aspects is
`PROFILE` clause. The  profile clause will return detail information about the
execution and how the [query plan](/querying/query-plan) is interacting with data.

A simple example to illustrate the output:

```cypher
PROFILE MATCH (n :Node)-[:Edge]-(m :Node) WHERE n.prop = 42 RETURN *;
```

```plaintext
+-----------------------------------------+---------------+---------------+---------------+
| OPERATOR                                | ACTUAL HITS   | RELATIVE TIME | ABSOLUTE TIME |
+-----------------------------------------+---------------+---------------+---------------+
| * Produce {m, n}                        | 1             |   7.134628 %  |   0.003949 ms |
| * Filter (n :Node), {n.prop}            | 1             |  12.734765 %  |   0.007049 ms |
| * Expand (m)-[anon1:Edge]-(n)           | 1             |   5.181460 %  |   0.002868 ms |
| * ScanAll (n)                           | 1             |   3.325061 %  |   0.001840 ms |
| * ScanAll (m)                           | 1             |  71.061241 %  |   0.039334 ms |
| * Once                                  | 2             |   0.562844 %  |   0.000312 ms |
+-----------------------------------------+---------------+---------------+---------------+
```


For every logical operator, the following info is provided:


- `OPERATOR` &mdash; the name of the operator, just like in the output of an
  `EXPLAIN` query. Here is the [full list of
  operators](/querying/query-plan#query-plan-operators). Each operator is
  usually based on the Cypher clauses used in the query.  

- `ACTUAL HITS` &mdash; the number of times a particular operator was pulled from. 
  This is similar to the number of objects being passed in the query. 
  The lower the number, the better the performance of the query will be since the query will
  touch and pass less data in the pipeline.  

- `RELATIVE TIME` &mdash; the amount of time that was spent processing a
  particular logical operator relative to the execution of the whole plan. 
  This will give you the information on where the bottleneck in the query is. 

- `ABSOLUTE TIME` &mdash; the amount of time that was spent processing a
  particular logical operator. 
  This is wall time, which gives you an idea of how operators spend wall time performing some operations.

