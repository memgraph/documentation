---
title: SET clause
description: Dive into the intricacies of the SET clause in Memgraph. Detailed documentation paving the way to proficient graph computing.
---

# SET clause

The `SET` clause is used to update labels on nodes and properties on nodes and relationships.

1. [Setting a property](#1-setting-a-property) <br />
2. [Setting multiple properties](#2-setting-multiple-properties) <br />
3. [Setting node labels](#3-setting-node-labels) <br />
4. [Update a property](#4-update-a-property) <br />
5. [Remove a property](#5-remove-a-property) <br />
6. [Copy all properties](#6-copy-all-properties) <br />
7. [Replace all properties using map](#7-replace-all-properties-using-map) <br />
8. [Update all properties using map](#8-update-all-properties-using-map) <br />
9. [Setting nested properties](#9-setting-nested-properties) <br />
10. [Removing nested properties](#10-removing-nested-properties)

## Dataset

The following examples are executed with this dataset. You can create this dataset
locally by executing the queries at the end of the page: [Dataset queries](#dataset-queries).

![Data set](/pages/querying/clauses/data_set.png)

## 1. Setting a property

The `SET` clause can be used to set the value of a property on a node or relationship:

```cypher
MATCH (c:Country {name: 'Germany'})
SET c.population = 83000001
RETURN c.name, c.population;
```

Output:

```nocopy
+--------------+--------------+
| c.name       | c.population |
+--------------+--------------+
| Germany      | 83000001     |
+--------------+--------------+
```

## 2. Setting multiple properties

The `SET` clause can be used to set the value of multiple properties nodes or relationships by separating them with a comma:

```cypher
MATCH (c:Country {name: 'Germany'})
SET c.capital = 'Berlin', c.population = 83000002
RETURN c.name, c.population, c.capital;
```

Output:

```nocopy
+--------------+--------------+--------------+
| c.name       | c.population | c.capital    |
+--------------+--------------+--------------+
| Germany      | 83000002     | Berlin       |
+--------------+--------------+--------------+
```

## 3. Setting node labels

The `SET` clause can be used to set the label on a node. If the node has a label, a new one will be added while the old one is left as is:

```cypher
MATCH (c {name: 'Germany'})
SET c:Land
RETURN labels(c);
```

Output:

```nocopy
+---------------------+
| labels(c)           |
+---------------------+
| ["Country", "Land"] |
+---------------------+
```

Multiple labels can be also set:

```cypher
MATCH (c {name: 'Germany'})
SET c:Place:Area
RETURN labels(c);
```

Output:

```nocopy
+--------------------------------------+
| labels(c)                            |
+--------------------------------------+
| ["Country", "Land", "Place", "Area"] |
+--------------------------------------+
```

## 4. Update a property

The `SET` clause can be used to update the value or type of a property on a node or relationship:

```cypher
MATCH (c:Country {name: 'Germany'})
SET c.population = 'not available'
RETURN c.population;
```

Output:

```nocopy
+---------------+
| c.population  |
+---------------+
| not available |
+---------------+
```

## 5. Remove a property

The `SET` clause can be used to remove the value of a property on a node or relationship by setting it to `NULL`:

```cypher
MATCH (c:Country {name: 'Germany'})
SET c.population = NULL
RETURN c.population;
```

Output:

```nocopy
+--------------+
| c.population |
+--------------+
| Null         |
+--------------+
```

## 6. Copy all properties

If `SET` is used to copy the properties of one node/relationship to another, all the properties of the latter will be removed and replaced with the new ones:

```cypher
MATCH (c1:Country {name: 'Germany'}), (c2:Country {name: 'France'})
SET c2 = c1
RETURN c2, c1;
```

Output:

```nocopy
+----------------------------------------------------------------------------+----------------------------------------------------------------------------+
| c2                                                                         | c1                                                                         |
+----------------------------------------------------------------------------+----------------------------------------------------------------------------+
| (:Country {continent: "Europe", language: "German", name: "Germany"})      | (:Country:Land {continent: "Europe", language: "German", name: "Germany"}) |
+----------------------------------------------------------------------------+----------------------------------------------------------------------------+
```

## 7. Replace all properties using map

If `SET` is used with the property replacement operator `=`, all the properties in the map that are on the node or relationship will be updated.
The properties that are not on the node or relationship but are in the map will be added. The properties that are not in the map will be removed.

```cypher
MATCH (c:Country {name: 'Germany'})
SET c = {name: 'Germany', population: '85000000'}
RETURN c;
```

Output:

```nocopy
+------------------------------------------------------+
| c                                                    |
+------------------------------------------------------+
| (:Country {name: "Germany", population: "85000000"}) |
+------------------------------------------------------+
```

If an empty map is used, all the properties of a node or relationship will be set to `NULL`:

```cypher
MATCH (c:Country {name: 'Germany'})
SET c = {}
RETURN c;
```

Output:

```nocopy
+------------+
| c          |
+------------+
| (:Country) |
+------------+
```

## 8. Update all properties using map

If `SET` is used with the property mutation operator `+=`, all the properties in the map that are on the node or relationship will be updated.
The properties that are not on the node or relationship but are in the map will be added. Properties that are not present in the map will be left as is.

```cypher
MATCH (c:Country {name: 'Germany'})
SET c += {name: 'Germany', population: '85000000'}
RETURN c;
```

Output:

```nocopy
+-----------------------------------------------------------------------------------------------+
| c                                                                                             |
+-----------------------------------------------------------------------------------------------+
| (:Country {continent: "Europe", language: "German", name: "Germany", population: "85000000"}) |
+-----------------------------------------------------------------------------------------------+
```

## 9. Setting nested properties

Starting from version v3.6, Memgraph supports setting nested properties. Nested properties are contained within `Map` property types.
Before nested property support was introduced, users could only set base properties using queries such as:
```cypher
MATCH (n:Person {name: 'Harry'}) SET n.age = 21;
```

With nested property support, users can now set properties inside a map, for example:
```cypher
MATCH (n:Person {name: 'Harry'}) SET n.details.age = 21;
```

This feature is particularly useful when working with configuration objects or when optimizing graph space,
as properties typically consume less memory than separate node or relationship objects.

Since the base property `n.details` does not exist in the dataset, the behavior is that the `n.details` map will be
constructed in place, with the `age` property added inside the `details` map.

Nested property can be retrieved with the following query:
```cypher
MATCH (n:Person {name: 'Harry'}) RETURN n.details.age AS age;
```

Output:

```nocopy
+-----+
| age |
+-----+
| 21  |
+-----+
```

There are a few edge cases when working with nested properties:
If the parent property is not of type `Map`, the query will throw an exception:
```cypher
MATCH (n:Person {name: 'Harry'}) SET n.name.surname = 'Johnson' // ERROR because n.name is a string, not a map
```

### Appending to nested properties

Additionally, users can append to nested properties with `Map` values. The following query is also supported as part of
nested property updates:

```cypher
MATCH (n:Person {name: 'Harry'}) SET n.details += {age: 21};
```

The query throws an exception if the right-hand side (in this case `{age: 21}`) is not of type Map,
as appending can only be performed with the same property type — which in this context is a map.
The query will also throw an exception if the left-hand side is not of type Map (or is null / does not exist).

## 10. Removing nested properties

Starting from version v3.6, Memgraph also supports removing nested properties for easier manipulation of map objects
within the node or relationship property store. The following query performs nested property removal:
```cypher
MATCH (n:Person {name: 'Harry'}) REMOVE n.details.age;
```

All other properties of the parent map are preserved.
If the property does not exist, the query does not throw an exception — the behavior is identical to removing a property at the base level.

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
