---
title: OPTIONAL MATCH clause
description: Understand the use of OPTIONAL MATCH in Memgraph. Detailed docs breaking down complex concepts into understandable fragments.
---

# OPTIONAL MATCH clause

The `MATCH` clause can be modified by prepending the `OPTIONAL` keyword.
`OPTIONAL MATCH` clause behaves the same as a regular `MATCH`, but when it fails to find the pattern,
missing parts of the pattern will be filled with null values.

1. [Get optional relationships](#1-get-optional-relationships) <br />
2. [Optional typed and named relationship](#2-optional-typed-and-named-relationship) <br />
3. [Use MATCH after OPTIONAL MATCH](#3-use-match-after-optional-match)

## Dataset

The following examples are executed with this dataset. You can create this dataset
locally by executing the queries at the end of the page: [Dataset queries](#dataset-queries).

![Data set](/pages/querying/clauses/data_set.png)

## 1. Get optional relationships

Using `OPTIONAL MATCH` when returning a relationship that doesn't exist will return the default value `NULL` instead.

The returned property of an optional element that is `NULL` will also be `NULL`:

```cypher
MATCH (c1:Country {name: 'France'})
OPTIONAL MATCH (c1)--(c2:Country {name: 'Germany'})
RETURN c2;
```

Output:

```nocopy
+------+
| c2   |
+------+
| Null |
+------+
```

## 2. Optional typed and named relationship

The `OPTIONAL MATCH` clause allows you to use the same conventions as `MATCH` when it comes to handling variables and relationship types:

```cypher
MATCH (c:Country {name: 'United Kingdom'})
OPTIONAL MATCH (c)-[r:LIVES_IN]->()
RETURN c.name, r;
```

Output:

```nocopy
+----------------+----------------+
| c.name         | r              |
+----------------+----------------+
| United Kingdom | Null           |
+----------------+----------------+
```

Because there are no outgoing relationships of type `LIVES_IN` for the node, the value of r is `null` while the value of `country.name` is `'United Kingdom'`.

## 3. Use MATCH after OPTIONAL MATCH

A `MATCH` can follow an `OPTIONAL MATCH`, directly or after other clauses such
as `UNWIND`, and use the variables the `OPTIONAL MATCH` binds. Before Memgraph
3.15, such a query raised the `MATCH can't be put after OPTIONAL MATCH.` error
unless a `WITH` clause separated the two clauses.

The following query finds the country each person works in, if any, and then
the people who live in that country:

```cypher
MATCH (p:Person)
OPTIONAL MATCH (p)-[:WORKING_IN]->(c:Country)
MATCH (c)<-[:LIVING_IN]-(resident:Person)
RETURN p.name AS person, c.name AS country, resident.name AS resident
ORDER BY person, resident;
```

Output:

```plaintext copy=false
+------------------+------------------+------------------+
| person           | country          | resident         |
+------------------+------------------+------------------+
| "Harry"          | "United Kingdom" | "Anna"           |
| "Harry"          | "United Kingdom" | "Harry"          |
+------------------+------------------+------------------+
```

Anna has no `WORKING_IN` relationship, so `c` is `null` on her row. The
`MATCH` drops that row, because a `null` matches no node (see [matching a
variable that is already bound](/querying/clauses/match#43-matching-a-variable-that-is-already-bound)).
John works in France, where no one lives, so the `MATCH` drops his row too.

A `MATCH` that doesn't use the `OPTIONAL MATCH` variables doesn't drop a row
because they are `null`:

```cypher
MATCH (p:Person {name: 'Anna'})
OPTIONAL MATCH (p)-[:WORKING_IN]->(c:Country)
MATCH (g:Country {name: 'Germany'})
RETURN p.name AS person, c.name AS work_country, g.name AS country;
```

Output:

```plaintext copy=false
+--------------+--------------+--------------+
| person       | work_country | country      |
+--------------+--------------+--------------+
| "Anna"       | Null         | "Germany"    |
+--------------+--------------+--------------+
```

## Dataset queries

We encourage you to try out the examples by yourself.
You can get our dataset locally by executing the following query block.

```cypher
MATCH (n) DETACH DELETE n;

CREATE (c1:Country {name: 'Germany', language: 'German', continent: 'Europe', population: 83000000});
CREATE (c2:Country {name: 'France', language: 'French', continent: 'Europe', population: 67000000});
CREATE (c3:Country {name: 'United Kingdom', language: 'English', continent: 'Europe', population: 66000000});

MATCH (c1),(c2)
WHERE c1.name= 'Germany' AND c2.name = 'France'
CREATE (c2)<-[:WORKING_IN {date_of_start: 2014}]-(p:Person {name: 'John'})-[:LIVING_IN {date_of_start: 2014}]->(c1);

MATCH (c)
WHERE c.name= 'United Kingdom'
CREATE (c)<-[:WORKING_IN {date_of_start: 2014}]-(p:Person {name: 'Harry'})-[:LIVING_IN {date_of_start: 2013}]->(c);

MATCH (p1),(p2)
WHERE p1.name = 'John' AND p2.name = 'Harry'
CREATE (p1)-[:FRIENDS_WITH {date_of_start: 2011}]->(p2);

MATCH (p1),(p2)
WHERE p1.name = 'John' AND p2.name = 'Harry'
CREATE (p1)<-[:FRIENDS_WITH {date_of_start: 2012}]-(:Person {name: 'Anna'})-[:FRIENDS_WITH {date_of_start: 2014}]->(p2);

MATCH (p),(c1),(c2)
WHERE p.name = 'Anna' AND c1.name = 'United Kingdom' AND c2.name = 'Germany'
CREATE (c2)<-[:LIVING_IN {date_of_start: 2014}]-(p)-[:LIVING_IN {date_of_start: 2014}]->(c1);

MATCH (n)-[r]->(m) RETURN n,r,m;
```
