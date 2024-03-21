---
title: Performance optimization
description: Optimize your graph computing performance with Memgraph. Access tips on performance optimization in our tutorials and detailed documentation to maximize efficiency.
---

# Performance optimization

If you are experiencing slow query performance, there are multiple things you can do to 
improve performance of your Cypher queries performance in Memgraph. Most of the things is based on 
improving the [query plan](./query-plan.mdx) and writing your queries in optimized manner. 

## Profiling the query execution time 

Before diving into the details of the query execution optimization and plan, it is important to note that 
maybe the query performance is slow in the parsing or planning phase. To make sure that is not the case, 
you can run your slow query and use [query execution summary](../getting-started/cli#query-execution-time).
Here we are concerned with `PLANE EXECUTION time` part of the Query execution summary.  

Depending on the tool you are using, Memgraph LAB includes Query execution summary by default in the UI. If you are 
using clients, there is an execution summary object in every result that should contain this information. 
Take a look at [specific client guides](../client-libraries.mdx) for this details. 


## Profiling queries

When improving your query performance one of the most important aspects is [`PROFILE`](./clauses/profile.md) 
clause. The  profile clause will return the detail information of the execution and how the [query plan ](./query-plan.mdx)
is interacting with data.

For every logical operator the following info is provided:

- `OPERATOR` &mdash; the name of the operator, just like in the output of an
  `EXPLAIN` query. Here is the [full list of operators](./query-plan#query-plan-operators). 
  Each operator is usually based on the Cypher clauses used in the query.  

- `ACTUAL HITS` &mdash; the number of times a particular logical operator was
  pulled from. This is similar to the number of objects being passed in the query. 
  The lower the number the better performance of the query will be, since the query will
  touch and pass less data in pipeline. 

- `RELATIVE TIME` &mdash; the amount of time that was spent processing a
  particular logical operator, relative to the execution of the whole plan. This 
  will give you the information were the bottleneck in the query is. 

- `ABSOLUTE TIME` &mdash; the amount of time that was spent processing a
  particular logical operator. This is wall time, gives you idea how operators
  spend wall time performing some operators. 

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

## Indexing queries

It is important to note that indexing in a database is depended on the actual dataset stored 
in the database. The general rule is that the properties that have high cardinality, should be used 
as indexes. If you index a low cardinality propery, such as gender or boolean, you won't get 
a lot performance benifits, on top of that you will have higher memory usage and 
slowdown of write operations. 


By applying an index you are changing a the process how the query plan is being construted and 
executed. 


Here is a simple query: 

```txt
memgraph> PROFILE MATCH (n) RETURN n;
+-----------------+-----------------+-----------------+-----------------+
| OPERATOR        | ACTUAL HITS     | RELATIVE TIME   | ABSOLUTE TIME   |
+-----------------+-----------------+-----------------+-----------------+
| "* Produce {n}" | 14578           | " 61.518812 %"  | "  4.702500 ms" |
| "* ScanAll (n)" | 14578           | " 38.477807 %"  | "  2.941245 ms" |
| "* Once"        | 2               | "  0.003382 %"  | "  0.000258 ms" |
+-----------------+-----------------+-----------------+-----------------+
```
So the `MATCH (n)` will take all the nodes from the database and pass it to the next operator in query 
plan. The total number of nodes in the dataset is 14577, and the `ScanAll` operator will take all the nodes
from the database, and pace it forward to next operator. 

But this is intended operation to run full database node return. In general, your queries should not contain
`ScanALL` operators. 

Take a look at the following query: 

```txt
memgraph> PROFILE  MATCH (n:Transfer {year:1992} ) RETURN n;
+------------------------------------+------------------------------------+------------------------------------+------------------------------------+
| OPERATOR                           | ACTUAL HITS                        | RELATIVE TIME                      | ABSOLUTE TIME                      |
+------------------------------------+------------------------------------+------------------------------------+------------------------------------+
| "* Produce {n}"                    | 148                                | "  0.451183 %"                     | "  0.033538 ms"                    |
| "* Filter (n :Transfer), {n.year}" | 148                                | " 81.888209 %"                     | "  6.087073 ms"                    |
| "* ScanAll (n)"                    | 14578                              | " 17.658844 %"                     | "  1.312651 ms"                    |
| "* Once"                           | 2                                  | "  0.001765 %"                     | "  0.000131 ms"                    |
+------------------------------------+------------------------------------+------------------------------------+------------------------------------+
```
This time we want to find the `:Transfer` node with the specific year property, and the `Filter` is applied to filter the results from `ScanALL`, again all nodes from the graph. 

The first optimization step would be to create a [label index](../fundamentals/indexes#label-index). This would allow the query to search just for a specifc set of nodes.  

Here is the example: 
```
CREATE INDEX ON :Transfer;

memgraph> PROFILE  MATCH (n:Transfer{year:1992}) RETURN n;
+----------------------------------+----------------------------------+----------------------------------+----------------------------------+
| OPERATOR                         | ACTUAL HITS                      | RELATIVE TIME                    | ABSOLUTE TIME                    |
+----------------------------------+----------------------------------+----------------------------------+----------------------------------+
| "* Produce {n}"                  | 148                              | "  0.626076 %"                   | "  0.029781 ms"                  |
| "* Filter {n.year}"              | 148                              | " 76.729111 %"                   | "  3.649770 ms"                  |
| "* ScanAllByLabel (n :Transfer)" | 9438                             | " 22.641831 %"                   | "  1.077003 ms"                  |
| "* Once"                         | 2                                | "  0.002982 %"                   | "  0.000142 ms"                  |
+----------------------------------+----------------------------------+----------------------------------+----------------------------------+
```

Several things have changed, the most import is that we are now running `ScanAllByLabel` operator insted of `ScanALL` that will search nodes based on labels, and actual search space will be reduced. Next, notice the `ACTUAL HITS` got down from 14k to 9k nodes. This also did split the total execution time into the half, notice the `ABSOLUTE TIME`. It is not just the actual faster operator, but the data inside the query plan pipeline is significantly reduced, and this has significant influence on the performance of the next operator in line, `Filter` in this case. 

`Filter` still needs to applied on the actual bigger chunk of nodes, by introducing the [label propery index](../fundamentals/indexes#label-propery-index) the search spaces can be limited even further. 


Here is an example: 

```
CREATE INDEX ON :Transfer(year); 
memgraph> PROFILE  MATCH (n:Transfer{year:1992}) RETURN n;
+-------------------------------------------------+-------------------------------------------------+-------------------------------------------------+-------------------------------------------------+
| OPERATOR                                        | ACTUAL HITS                                     | RELATIVE TIME                                   | ABSOLUTE TIME                                   |
+-------------------------------------------------+-------------------------------------------------+-------------------------------------------------+-------------------------------------------------+
| "* Produce {n}"                                 | 148                                             | " 21.446945 %"                                  | "  0.016885 ms"                                 |
| "* ScanAllByLabelPropertyValue (n :Transfer ... | 148                                             | " 78.488746 %"                                  | "  0.061794 ms"                                 |
| "* Once"                                        | 2                                               | "  0.064309 %"                                  | "  0.000051 ms"                                 |
+-------------------------------------------------+-------------------------------------------------+-------------------------------------------------+-------------------------------------------------+
```

Again the `ScanAllByLabel` operator was replaced with the more efficent operator `ScanAllByLabelPropertyValue` operator. Ideally, you would like to have the most scan operators of this type. The `ACTUAL` hits got down from 9k nodes, to just 148 nodes. `ABSOLUTE TIME` went from 8 miliseconds in the inital version, to less the milisecond.  

The `MERGE` query also depend on the scan operators, to fetch if the nodes exist in the database. If you do not have proper indexes set, the operation looks like this: 
```
memgraph> PROFILE MERGE (p:Player{name:"Pele"}) RETURN p;
+------------------------------------+------------------------------------+------------------------------------+------------------------------------+
| OPERATOR                           | ACTUAL HITS                        | RELATIVE TIME                      | ABSOLUTE TIME                      |
+------------------------------------+------------------------------------+------------------------------------+------------------------------------+
| "* Produce {p}"                    | 2                                  | "  0.056228 %"                     | "  0.003810 ms"                    |
| "* Accumulate"                     | 2                                  | "  0.133913 %"                     | "  0.009075 ms"                    |
| "* Merge"                          | 2                                  | "  0.148710 %"                     | "  0.010078 ms"                    |
| "|\\"                              | ""                                 | ""                                 | ""                                 |
| "| * Filter (p :Player), {p.name}" | 1                                  | " 80.885717 %"                     | "  5.481341 ms"                    |
| "| * ScanAll (p)"                  | 14578                              | " 18.324421 %"                     | "  1.241782 ms"                    |
| "| * Once"                         | 2                                  | "  0.001332 %"                     | "  0.000090 ms"                    |
| "|\\"                              | ""                                 | ""                                 | ""                                 |
| "| * CreateNode"                   | 1                                  | "  0.447608 %"                     | "  0.030333 ms"                    |
| "| * Once"                         | 1                                  | "  0.000740 %"                     | "  0.000050 ms"                    |
| "* Once"                           | 2                                  | "  0.001332 %"                     | "  0.000090 ms"                    |
+------------------------------------+------------------------------------+------------------------------------+------------------------------------+
```

Again the `ScanAll` operator is taking all the nodes and filtering them. If you take a closer look into `RELATIVE TIME`, it is the 80% of the total cost of the query. 

Adding a label-propery index, changes the execution of this query: 

```
memgraph> PROFILE MERGE (p:Player{name:"Pele"}) RETURN p;
+-------------------------------------------------+-------------------------------------------------+-------------------------------------------------+-------------------------------------------------+
| OPERATOR                                        | ACTUAL HITS                                     | RELATIVE TIME                                   | ABSOLUTE TIME                                   |
+-------------------------------------------------+-------------------------------------------------+-------------------------------------------------+-------------------------------------------------+
| "* Produce {p}"                                 | 2                                               | "  5.598059 %"                                  | "  0.003245 ms"                                 |
| "* Accumulate"                                  | 2                                               | "  3.769360 %"                                  | "  0.002185 ms"                                 |
| "* Merge"                                       | 2                                               | " 10.785594 %"                                  | "  0.006253 ms"                                 |
| "|\\"                                           | ""                                              | ""                                              | ""                                              |
| "| * ScanAllByLabelPropertyValue (p :Player ... | 1                                               | " 14.312372 %"                                  | "  0.008297 ms"                                 |
| "| * Once"                                      | 2                                               | "  0.130621 %"                                  | "  0.000076 ms"                                 |
| "|\\"                                           | ""                                              | ""                                              | ""                                              |
| "| * CreateNode"                                | 1                                               | " 65.236052 %"                                  | "  0.037818 ms"                                 |
| "| * Once"                                      | 1                                               | "  0.074641 %"                                  | "  0.000043 ms"                                 |
| "* Once"                                        | 2                                               | "  0.093301 %"                                  | "  0.000054 ms"                                 |
+-------------------------------------------------+-------------------------------------------------+-------------------------------------------------+-------------------------------------------------+
``







## Analyze graph

The `ANALYZE GRAPH` will check and calculate certain properties of a graph so
that the database can choose a more optimal index or `MERGE` transaction.

Before the introduction of the `ANALYZE GRAPH` query, the database would choose
an index solely based on the number of indexed nodes. But if the number of nodes
is the only condition, in some cases the database would choose a non-optimal
index. Once the `ANALYZE GRAPH` is run, Memgraph analyzes the distribution of
property values and can select a more optimal label-property index, the one with
the smallest average property value size.

The average property value's group size directly represents the database's
expected number of hits which can be used to estimate the query's cost. When the
average group size is the same, the chi-squared statistic is used to measure how
close the distribution of property-value group size is to the uniform
distribution. The index with a distribution closest to the uniform distribution
is selected.

$
\chi^2 = \sum_{i}\frac{(E_i-O_i)^2}{E_i}
$

Upon running the `ANALYZE GRAPH` query, Memgraph also check the node degree of
every indexed nodes and calculates the average degree. By having these values,
Memgraph can make a more optimal `MERGE` expansion and improve performance. It's
always better to perform a `MERGE` by expanding from the node that has a lower
degree than the connecting node.

The `ANALYZE GRAPH;` command should be run only once after all indexes have been
created and nodes inserted in the database. In rare situations when one property
is set on many more nodes than another property, choosing an index based on
average group size and uniform distribution would be misleading. That's why the
database always selects the label-property index with >= 10x fewer nodes than
the other label-property index.

### Calculate the statistic

Run the following query to calculate the statistics:

```cypher
ANALYZE GRAPH;
```

The query will iterate over all label and label-property indexes in the database
and calculate the average group size, chi-squared statistic and avg degree for
each one, then return the following output:

| label | property | num estimation nodes | num groups | avg group size | chi-squared value | avg degree
| ----- | -------- | -------------------- | ---------- | -------------- | ----------------- | ----------
| index's label | index's property | number of nodes used for estimation | number of distinct values the property contains | average group size of property's values | value of the chi-squared statistic | average degree of the indexed nodes

Once the necessary information is obtained, Memgraph can choose the optimal
index and `MERGE` expansion. If you don't want to run the analysis on all labels,
you can specify which labels to use by adding the labels to the query:

```cypher
ANALYZE GRAPH ON LABELS :Label1, :Label2;
```

### Delete statistic

Information about the graph is persistent between instance reruns as is
recovered as all the other data, using [snapshots and WAL
files](/configuration/data-durability-and-backup). If you want the database to
ignore information about the average group size, the chi-squared statistic and
the average degree, the existing statistic can be deleted by running:

```cypher
ANALYZE GRAPH DELETE STATISTICS;
```

The results will contain all label-property indexes that were successfully deleted:

| label | property |
| ----- | -------- |
| index's label | index's property |

Specific labels can be specified with the construct `ON LABELS`:

```cypher
ANALYZE GRAPH ON LABELS :Label1 DELETE STATISTICS;
```

## Cartesian product

Cartesian product is by default enabled in Memgraph. It enforces the usage of the `Cartesian`
operator which can be shown when you run `EXPLAIN` or `PROFILE`, like in the query below.


```cypher
EXPLAIN MATCH (n:Person), (m:Employee) 
WHERE n.age < 30 and m.years_of_experience > 5 
RETURN n, m;

```

```
+----------------------------------------------------------------------+
| QUERY PLAN                                                           |
+----------------------------------------------------------------------+
| " * Produce {n, m}"                                                  |
| " * Cartesian {m : n}"                                               |
| " |\\ "                                                              |
| " | * ScanAllByLabelPropertyRange (n :Person {age})"                 |
| " | * Once"                                                          |
| " * ScanAllByLabelPropertyRange (m :Employee {years_of_experience})" |
| " * Once"                                                            |
+----------------------------------------------------------------------+
```

From the query plan, we can observe that the advantage of the `Cartesian` operator is filtering both its 
branches and therefore reduces the cardinality of the rows,
before coming into the final operator `Produce` which streams the results.


Known disadvantage of the `Cartesian` operator is that it quickly builds up memory if there are a lot

of rows being produced from its branches. 

The cartesian product can be disabled by setting the `--cartesian-product-enabled` flag to `false`, and it is
also present as a [run-time configurable flag](/configuration/configuration-settings#during-runtime).


## Index hinting

When executing a query, Memgraph needs to decide where in the query graph to
start matching. To get the optimal match, it checks the MATCH clause conditions
and finds the index that's likely to be the best choice.

However, the selected index might not always be the best one. Sometimes, there
are multiple candidate indexes, and the query planner picks the suboptimal one
from a performance point of view.

You can instruct the planner to use specific index(es) (if possible) in the
query that follows by using the syntax below:

```cypher
USING INDEX :Label, :Label2 ...;
```

```cypher
USING INDEX :Label(Property) ...
```

It is also possible to specify multiple hints separated with comma. In that
case, the planner will apply the first hint that is applicable for a given
match.

An example of selecting an index with USING INDEX: 
```
USING INDEX :Person(name)
MATCH (n:Person {name: 'John', gender: 'male'})
RETURN n;
```

<Callout type="warning"> 

Overriding planner behavior with index hints should be used with caution, and
only by experienced developers and/or database administrators, as poor index
choice may cause queries to perform poorly.

</Callout>

