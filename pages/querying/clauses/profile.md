---
title: PROFILE clause
description: Leverage the PROFILE clause in Memgraph. Detailed guide categorizes information for proficient graph computing.
---

# PROFILE clause

The PROFILE clause can be used to profile the execution of a query and get a detailed
report on how the query's plan behaved. To get a query plan, use the [EXPLAIN
clause](/querying/clauses/explain).

For every logical operator the following info is provided:

- `OPERATOR` &mdash; the name of the operator, just like in the output of an
  `EXPLAIN` query.

- `ACTUAL HITS` &mdash; the number of times a particular logical operator was
  pulled from.

- `RELATIVE TIME` &mdash; the amount of time that was spent processing a
  particular logical operator, relative to the execution of the whole plan.

- `ABSOLUTE TIME` &mdash; the amount of time that was spent processing a
  particular logical operator.

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