---
title: Migrate from RDBMS to Memgraph directly using MAGE modules
description: Easily transition from RDBMS to Memgraph using MAGE modules. Our detailed documentation makes the migration process straightforward for competent graph computing.
---

#  Migrate from RDBMS to Memgraph using MAGE modules

This tutorial will help you import your data from a PostgreSQL database into Memgraph
directly using MAGE query modules.

This migration tutorial makes migration from an external source to Memgraph possible in one less step
than described in [migrating from a RDBMS to Memgraph using CSV files](/data-migration/migrate-from-rdbms).
Make sure you read both tutorials to see what fits your needs.

In two of our blog posts, we've covered the [differences between relational and
graph database](https://memgraph.com/blog/graph-database-vs-relational-database)
and outlined the [benefits of graph
databases](https://memgraph.com/blog/the-benefits-of-using-a-graph-database-instead-of-sql).

## Prerequisites

To follow along, you will need:

- **Memgraph MAGE** which includes **Memgraph** and **MAGE**, an advanced graph
  algorithms and modules library. To install the Memgraph MAGE and set it up,
please follow the [getting started guide](/getting-started).
- (optional) A running relational database either with your own schema and data
  or the data we provided to populate the tables. Here we will be using PostgreSQL, but
  you can also choose whatever external source, if it is supported inside 
  [MAGE available migration algorithms](/advanced-algorithms/available-algorithms/migrate).

## Data model

Let's first get acquainted with the model. In our Postgres tables, we will be having `Musicians`
and `Bands`, with their respective properties.

The `Musicians` table will have an id, name and instrument they play:
```sql
CREATE TABLE Musicians (
    musician_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    instrument TEXT
);

INSERT INTO Musicians (name, instrument) VALUES
('John Doe', 'Guitar'),
('Jane Smith', 'Vocals'),
('Alice Johnson', 'Bass'),
('Bob Lee', 'Drums'),
('Charlie Brown', 'Keyboard'),
('Eva Green', 'Guitar');
```

Bands will have the band id, and the name of the band:
```sql
CREATE TABLE Bands (
    band_id SERIAL PRIMARY KEY,
    band_name TEXT NOT NULL
);

INSERT INTO Bands (band_name) VALUES
('The Rockers'),
('The Jazz Masters'),
('The Classical Ensemble'),
('Pop Sensations');
```

And they will be connected with a join table:
```sql
CREATE TABLE BandMemberships (
    musician_id INTEGER,
    band_id INTEGER,
    PRIMARY KEY (musician_id, band_id),
    FOREIGN KEY (musician_id) REFERENCES Musicians (musician_id) ON DELETE CASCADE,
    FOREIGN KEY (band_id) REFERENCES Bands (band_id) ON DELETE CASCADE
);

INSERT INTO BandMemberships (musician_id, band_id) VALUES
(1, 1),  -- John Doe is a guitarist in "The Rockers"
(2, 1),  -- Jane Smith is a vocalist in "The Rockers"
(3, 1),  -- Alice Johnson is a bassist in "The Rockers"
(4, 1),  -- Bob Lee is a drummer in "The Rockers"
(2, 2),  -- Jane Smith is also a vocalist in "The Jazz Masters"
(5, 2),  -- Charlie Brown plays keyboard in "The Jazz Masters"
(6, 4),  -- Eva Green plays guitar in "Pop Sensations"
(2, 4);  -- Jane Smith also sings in "Pop Sensations"
```

Now we have populated all of the example data for the tutorial.

The exercise is to migrate `Bands` and `Musicians` rows as nodes, and the mapping table as
relationships. The steps below are provided so you can quickly glance at them at any time:

1. Create necessary indices. Indices will increase performance when creating relationships between the nodes.
2. Switch to in-memory analytical mode (to eliminate memory overhead)
3. Import nodes from corresponding tables
4. Import relationships from corresponding tables
5. Switch back to in-memory transactional mode

### 1. Create necessary indices
In SQL databases, indices are mostly created after the import has finished, as they can slow down 
importing times. However, in Memgraph it's necesssary to create indices beforehand. The reason for this
is the relationship import, which needs to find 2 nodes (start node and end node) as its source and
destination. For node import, if you're doing `CREATE` commands, it's irrelevant. However, if you're
executing `MERGE` commands, it will still scan over all the nodes, so use corresponding indices in order
to make the scanning faster.

We will import only the necessary indices:
```cypher
CREATE INDEX ON :Musician(id);
CREATE INDEX ON :Band(id);
```

### 2. Switch to in-memory analytical mode
Memgraph currently offers 2 in-memory modes, transactional and analytical. Transactional is often used in
production deployments. It has all the [ACID guarantees](https://en.wikipedia.org/wiki/ACID)
and it's safe to use for transactional workloads.
However, when executing import for the first time and testing, it is beneficial to use in-memory analytical
mode. 

In-memory analytical mode offers less memory overhead than transactional mode. In-memory analytical mode
is highly parallelizable when importing nodes and relationships in the way we will see below. However, it does
not come with write-ahead logging, and it is therefore unable to make ACID guarantees. More information
about analytical mode can be found on our [page about storage modes](/fundamentals/storage-memory-usage).

In-memory storage mode is enabled with the following command:
```cypher
STORAGE MODE IN_MEMORY_ANALYTICAL;
```

In the next two sections, we will provide you with different ways of migrating from an external data source.
One will be migrating the whole table from the RDBMS to Memgraph, and other will be by issuing a query.

### 3. Import nodes from corresponding tables
The [migrate module](/advanced-algorithms/available-algorithms/migrate) in MAGE has an easy API how to migrate rows from a relational database to Memgraph. We
can migrate and inspect the table with the following query:

```cypher
CALL migrate.postgresql('Musicians' , {
  user:'postgres',
  password:'xxxxxx',
  host:'localhost',
  database:'postgresdb'
})
YIELD row
RETURN row.musician_id as id, row.name as name, row.instrument as instrument;
```

On the picture we can see that the module has correctly extracted the columns from the table.
![](/pages/data-migration/migrate-from-rdbms-directly/migrate-from-rdbms-directly-musicians-row.png)

The `YIELD` keyword will create the `row` objects, which are essentially a map which
has the column name as the key, and the column value as the value. We can iterate over the row objects with
the Cypher language to continue populating the database.

```cypher
CALL migrate.postgresql('Musicians' , {
  user:'postgres',
  password:'xxxxxx',
  host:'localhost',
  database:'postgresdb'
})
YIELD row
CREATE (n:Musician {id: row.musician_id, name: row.name, instrument: row.instrument});
```

Similarly, we can inspect the returned rows from the `Bands` table:
```cypher
CALL migrate.postgresql('Bands' , {
  user:'postgres',
  password:'xxxxxx',
  host:'localhost',
  database:'postgresdb'
})
YIELD row
RETURN row.band_id AS band_id, row.band_name AS name;
```

![](/pages/data-migration/migrate-from-rdbms-directly/migrate-from-rdbms-directly-bands-row.png)

When we're happy with the returned columns, we can create the relationships:
```cypher
CALL migrate.postgresql('Bands' , {
  user:'postgres',
  password:'xxxxxx',
  host:'localhost',
  database:'postgresdb'
})
YIELD row
CREATE (n:Band {id: row.band_id, name: row.band_name});
```

After we have migrated all the nodes, by issuing a simple query to match all the nodes, we get the following
disconnected graph.
```cypher
MATCH (n) RETURN n;
```

![](/pages/data-migration/migrate-from-rdbms-directly/migrate-from-rdbms-directly-raw-nodes.png)

### 4. Import relationships from corresponding tables
We can not do any graph use cases without connections between the nodes, so in this section, we will update the relationships.
However, in the first argument we will provide a query that selects columns from the table.

```cypher
CALL migrate.postgresql('SELECT * FROM BandMemberships' , {
  user:'postgres',
  password:'xxxxxx',
  host:'localhost',
  database:'postgresdb'
})
YIELD row
RETURN row.band_id AS band_id, row.musician_id AS musician_id;
```

![](/pages/data-migration/migrate-from-rdbms-directly/migrate-from-rdbms-directly-relationships-row.png)

This query is useful as sometimes you don't need all the columns to be migrated to Memgraph, you only need a fraction
of them. Although you can omit creation of properties when the row is received, this approach consumes less memory on
the row level. We can create the relationships by matching the source and destination node we migrated previously. Now,
the indices will play a big role, as the graph can be connected effectively and with optimal performance.

```cypher
CALL migrate.postgresql('SELECT * FROM BandMemberships' , {
  user:'postgres',
  password:'xxxxxx',
  host:'localhost',
  database:'postgresdb'
})
YIELD row
MATCH (m:Musician {id: row.musician_id}), (b:Band {id: row.band_id})
CREATE (m)-[:PERFORMS_IN]->(b);
```

After migrating the relationships, we can see how our graph looks like:

```cypher
MATCH (n)-[r]->(m) RETURN n, r, m;
```

![](/pages/data-migration/migrate-from-rdbms-directly/migrate-from-rdbms-directly/connected-graph.png)

### 5. Switch back to in-memory transactional mode
If we want to give back the transactional guarantees, we can do so by switching back from
analytical to transactional mode with the query:
```cypher
STORAGE MODE IN_MEMORY_TRANSACTIONAL;
```


## Benefits of direct migration from RDBMS to Memgraph
We have shown how Memgraph can, with the easy integration of MAGE modules, migrate from an external
source to its graph storage in a matter of few queries. That offers a significant improvement in the
ease of use than the CSV import we have provided previously. Users are encouraged to see for themselves
which method suits them better.

## Frequently asked questions

### What are some of the best practices to lower memory when migrating data?
We have already mentioned the in-memory analytical mode that has less memory overhead since it 
strips Memgraph of some ACID guarantees.

We will look at some other techniques which we use to lower memory:
1. Omitting unnecessary columns when migrating
2. Appropriate data type conversion

####  1. Ommitting unnecessary columns when migrating
Most users will want to migrate full rows to Memgraph, which can sometimes be inefficient.
The columns in Postgres are meant to be stored on
disk, and therefore users can add new columns which can be big in size. This mainly is a concern
for unnecessary date strings and urls. 

This can be optimized by processing the minimal set of necessary columns.

#### 2. Appropriate data type conversion
When receiving rows from RDBMS to Memgraph, be sure that the appropriate types are utilized. That namely
is concerning converting strings to integers (`ToInteger`), floats (`ToFloat`), 
booleans (`ToBoolean`), or date-time objects (`date`, `localdatetime`, and `duration` constructors). For functions
that do the conversions between strings and other types, please check the 
pages for [functions](/querying/functions), as well
as [temporal types](/fundamentals/data-types#temporal-types).
