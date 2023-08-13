# Advanced algorithms

**Memgraph Advanced Graph Extensions**, **MAGE** to friends, is an [**open-source
repository**](https://github.com/memgraph/mage) that contains **graph algorithms** and **modules** written by the
team behind Memgraph and its users in the form of **query modules**. The project
aims to give everyone the tools they need to tackle the most interesting and
challenging **graph analytics** problems.

[**Query
module**](/advanced-algorithms/available-algorithms/available-algorithms)
is a concept introduced by Memgraph and it refers to user-defined procedures,
grouped into modules that extend the **Cypher query language**. Procedures are
implementations of various algorithms in multiple programming languages and they
are all runnable inside Memgraph.

## Quick start

Start utilizing the power of MAGE with these simple steps.

### 1. Install MAGE

If you are using Memgraph Platform and starting Memgraph with the
`memgraph-platform` image, MAGE is already included and you can proceed to
step 2 or 3.

Install MAGE using a prepared image from the [Docker
Hub](/advanced-algorithms/install-mage) or by [building a Docker
image](/advanced-algorithms/install-mage) from the [official MAGE GitHub
repository](https://github.com/memgraph/mage). On Linux, you can also [install
MAGE from source](/advanced-algorithms/install-mage) but be aware you will also need to
install additional
dependencies.

### 2. Load query modules

To use certain procedures, first, you need to [load the query modules](/custom-query-modules/manage-query-modules) to the
appropriate directory. 

### 3. Call procedures

You are ready to [call procedures](/advanced-algorithms/run-algorithms) within queries and tackle that graph analytics
problem that's been keeping you awake. 

## What to do next?

### Browse the spellbook of query modules

The spellbook has been written to help you utilize all the [currently
available query modules](/advanced-algorithms/available-algorithms).

### Create query modules

If you need some assistance in creating and running your own Python and C++
query modules [How-to guides](/custom-query-modules/cpp) are here for you. 

### Learn about algorithms and their usage

There are so many
[algorithms](/advanced-algorithms/available-algorithms/betweenness_centrality)
to benefit from. Browse through them and see how they can be applied in [use
cases](/use-cases/bioinformatics.md) from various fields, such as bioinformatics or
transportation. 

### Contribute

Make MAGE even better by [contributing](/custom-query-modules/contributing) your own algorithm implementations and ideas or reporting pesky bugs. 

### Browse through the Changelog

Want to know what's new in MAGE? Take a look at [Changelog](/release-notes)
to see a list of new features.

