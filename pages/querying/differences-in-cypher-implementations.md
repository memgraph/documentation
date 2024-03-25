---
title: Differences in Cypher implementation
description: Compare and contrast different Cypher implementations in Memgraph. Comprehensive documentation to level up your graph computing expertise.
---

# Differences in Cypher implementations

Memgraph implements the [openCypher](https://www.opencypher.org/) query
language and aims to be as close as possible to the most commonly used openCypher implementations. Still, there are some differences in Memgraph Cypher implementation enhancing user experience.

## Difference from Neo4j's Cypher implementation

The openCypher initiative stems from Neo4j's Cypher query language. Following is
a list of the most important differences between Neo4j's and Memgraph's
Cypher implementation for users already familiar with Neo4j.

### Indexes and constraints

### Shortest path

In Neo4j, to find the shortest possible path between two nodes, you would use the `shortestPath` algorithm.

```cypher
MATCH p=shortestPath(
(:Person {name:"Keanu Reeves"})-[*]-(:Person {name:"Tom Hanks"})
)
RETURN p
```

Memgraph offers fast deep path traversals as built-in graph algorithms. This includes BFS, DFS, WSP and ASP algorithms. This is a bit different to the `shortestPath` and `allShortestPaths` functions you might be used to, but by them being built in, they offer fast traversal and are Memgraph's advantage. Here is an example of how you would rewrite the above query to work in Memgraph:

```cypher
MATCH p=(:Person {name:"Keanu Reeves"})-[*BFS]-(:Person {name:"Tom Hanks"})
RETURN p
```

### NOT label expression
In Neo4j, you can use the NOT label expression (!):
```cypher
MATCH (:Person {name:'Tom Hanks'})-[r:!ACTED_IN]->(m:Movie)
Return type(r) AS type, m.title AS movies
```
In Memgraph, such construct is not supported, but there is still a workaround:
```cypher
MATCH (p:Person {name:'Tom Hanks'})-[r]->(m:Movie)
WHERE type(r) != "ACTED_IN"
RETURN type(r) AS type, m.title AS movies;
```

### Search for patterns of a fixed length

In Neo4j, to search for patterns of a fixed length, you would use the following construct:
```cypher
MATCH (tom:Person {name:'Tom Hanks'})--{2}(colleagues:Person)
RETURN DISTINCT colleagues.name AS name, colleagues.born AS bornIn
ORDER BY bornIn
LIMIT 5
```
Memgraph does not support such construct, but since it has built-in traversals, you can achive the same with DFS:
```cypher
MATCH (tom:Person {name:'Tom Hanks'})-[*2]-(colleagues:Person)
RETURN DISTINCT colleagues.name AS name, colleagues.born AS bornIn
ORDER BY bornIn
LIMIT 5
```

Similarly, to match a graph for patterns of a variable length, you would run the following query in Neo4j:
```cypher
MATCH (p:Person {name:'Tom Hanks'})--{1,4}(colleagues:Person)
RETURN DISTINCT colleagues.name AS name, colleagues.born AS bornIn
ORDER BY bornIn, name
LIMIT 5
```
In Memgraph, use DFS:
```cypher
MATCH (p:Person {name:'Tom Hanks'})-[*1..4]-(colleagues:Person)
RETURN DISTINCT colleagues.name AS name, colleagues.born AS bornIn
ORDER BY bornIn, name
LIMIT 5
```

### Unsupported constructs

#### CALL subqueries in transactions
Such query is not supported in Memgraph, but you can use [periodic](/advanced-algorithms/available-algorithms/periodic) module to execute a query periodically in batches.

#### EXISTS subqueries
Such clause is not supported in Memgraph, but you can use `exists()` [pattern function](/querying/functions#pattern-functions) with the `WHERE` clause to [filter with pattern expressions](/querying/clauses/where#17-filter-with-pattern-expressions). 

The following constructs are not yet supported in Memgraph:
- **`EXISTS` subquery with `WHERE` clause** -> Track progress on [GitHub](https://github.com/memgraph/memgraph/issues/1483) and add a comment if you require such a feature.
- **Nesting `EXISTS` subqueries** -> Track progress on [GitHub](https://github.com/memgraph/memgraph/issues/905) and add a comment if you require such a feature.
- **`EXISTS` subquery outside of a `WHERE` clause** -> Track progress on [GitHub](https://github.com/memgraph/memgraph/issues/1308) and add a comment if you require such a feature.

For all other not supported constructs that you require, please open an issue on our [GitHub repository](https://github.com/memgraph/memgraph/issues). Learn more in our Community Call on [Subqueries & Patterns in Filtering Clauses](https://www.youtube.com/watch?v=QYFU5d_xLIs&list=PL7Eotag2rRhZssS4f11PKAHuCykMCljg3).

#### COUNT subqueries
Such construct is not supported in Memgraph, but you can use `count()` [aggregation function](querying/functions#aggregation-functions) to count the number of non-null values returned by the expression. 

#### COLLECT subqueries
Such construct is not supported in Memgraph, but you can use `collect()` [aggregation function](querying/functions#aggregation-functions) to return a single aggregated list from provided values.

#### Patterns in expressions
Patterns in expressions are supported in Memgraph in particular functions, like `exists(pattern)`.
In other cases, Memgraph does not yet support patterns in functions, e.g. `size((n)-->())`.
Most of the time, the same functionalities can be expressed differently in Memgraph
using `OPTIONAL` expansions, function calls, etc.

#### Unsupported expressions
**Cypher expressions**
- Numerical:
  - An octal `INTEGER` literal (starting with `0o`): `0o1372`, `0o5671`
  - A `FLOAT` literal: `Inf`, `Infinity`, `NaN`
- Boolean:
  - Label and relationship type expressions: `(n:A|B)`, `()-[r:R1|R2]->()` -> Track progress on [GitHub](https://github.com/memgraph/memgraph/issues/1848) and add a comment if you require such a feature.

**Conditional expressions (`CASE`)**
- More than one value after `WHEN` operator: 
  ```cypher
  MATCH (n:Person)
  RETURN
  CASE n.eyes
    WHEN 'blue'  THEN 1
    WHEN 'brown', 'hazel' THEN 2
    ELSE 3
  END AS result, n.eyes
  ```
  Here is a workaround in Memgraph:
  ```cypher
  MATCH (n:Person)
  RETURN 
  CASE n.eyes 
    WHEN 'blue' THEN 1 
    WHEN 'hazel' THEN 2 
    WHEN 'brown' THEN 2 
    ELSE 3 
  END AS result, n.eyes;
  ```
  -> Track progress on [GitHub](https://github.com/memgraph/memgraph/issues/1853) and add a comment if you require such a feature.
#### Unsupported functions
General purpose functions:

- `exists(n.property)` - This can be expressed using `n.property IS NOT NULL`.
- `length()` is named `size()` in Memgraph.

Mathematical functions:

- `percentileDisc()`
- `stDev()`
- `point()`
- `distance()`
- `degrees()`

List functions:

- `none()`


## Memgraph's Cypher extension

ANALYZE GRAPH
USING INDEX
Query modules




