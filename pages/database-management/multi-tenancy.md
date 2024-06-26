---
title: Multi-tenancy (Enterprise)
description: Discover the benefits of multi-tenancy for scalability, resource utilization, and performance. Also learn how to manage few isolated databases within a single instance in our detailed documentation.
---

# Multi-tenancy (Enterprise)

Multi-tenant support in Memgraph enables users to manage multiple isolated
databases within a single instance. The primary objective is to facilitate
efficient resource isolation, maintain data integrity, and manage access for
different clients.

In the current version, all isolated databases share the underlying resources so
there is no provision to restrict CPU or RAM usage for a specific database.
Instead, global limitations are imposed on Memgraph as a whole.

## Default database

A default database named 'memgraph' is automatically created during startup. New
users are granted access only to this default database. The default
database name cannot be altered.

## Isolated databases

Isolated databases within Memgraph function as distinct single-database Memgraph
instances. Queries executed on a specific database should operate as if it were
the sole database in the system, preventing cross-database contamination. Users
interact with individual databases, and cross-database queries are prohibited.

## Database configuration and data directory

At present, all isolated databases share identical configurations. There is no
provision to specify a per-database configuration.

The sole distinction lies in the location of the data directory. The designated
data directory serves as the root and retains data associated with the default
database. Other databases are housed in new directories within
`data_directory/databases/*db_name*`.

The default `memgraph` database also includes a directory
`data_directory/databases/memgraph`, which contains symbolic links leading back
to the root. Some links are proactively generated and their status may vary
based on configuration.

## User interface

### Cypher queries for multi-tenancy

Users interact with multi-tenant features through specialized Cypher queries:

1. `CREATE DATABASE name`: Creates a new database.
2. `DROP DATABASE name`: Deletes a specified database.
3. `SHOW DATABASE`: Shows the current used database. It will return `NULL` if
   there is not one.
4. `SHOW DATABASES`: Shows only the existing set of multitenant databases.
5. `USE DATABASE name`: Switches focus to a specific database (disabled during
   transactions).
6. `GRANT DATABASE name TO user`: Grants a user access to a specified database.
7. `DENY DATABASE name FROM user`: Denies a user's access to a specified
   database.
8. `REVOKE DATABASE name FROM user`: Removes database from user's authentication
   context.
9. `SET MAIN DATABASE name FOR user`: Sets a user's default (landing) database.
10. `SHOW DATABASE PRIVILEGES FOR user`: Lists a user's database access rights.

### User's main database

Administrators assign default databases to users, ensuring a seamless and secure
connection experience. Users cannot connect to Memgraph if they lack access
rights to their default database. This situation may arise from database
deletion or revoked access rights.

### User privileges and database access

Authentication and authorization data are shared across databases, providing a
unified source of truth. A single user can access multiple databases with a
global set of privileges, but currently, per-database privileges cannot be
granted.

Access to all databases can be granted or revoked using wildcards:
`GRANT DATABASE * TO user;`, `DENY DATABASE * TO user;` or 
`REVOKE DATABASE * FROM user;`.

### Additional multi-tenant privileges

Administrators manage multi-tenant privileges with:

- `MULTI_DATABASE_USE`: Enables database switching and listing.
- `MULTI_DATABASE_EDIT`: Permits database creation and deletion.

### Configuration flags

The `data-recovery-on-startup` flag replaces `storage-recover-on-startup`,
facilitating recovery of individual databases and their contents during startup.

### Connecting to a database

The user can interact with multi-tenant databases in two ways:

1. Through Cypher queries.
2. When using Neo4j drivers, by defining the `database` field. 
   The `USE DATABASE` query is disabled when the database field is defined. 
   All queries run against the specified database only.

When connecting to Memgraph without defining a particular landing database, 
you will be connected to the default database set for the user. In case the user
does not have a default (main) database, a database-less connection will be 
established. During this connection, the user can execute queries that do not 
manipulate any data. User can still use multi-tenant queries and define a 
database to use via the appropriate Cypher query.

Example using Neo4j Python driver:

```python
import neo4j

driver = neo4j.GraphDatabase.driver("bolt://localhost:7687", auth=("user", "pass"))

with driver.session() as session:
    session.run(...)  # Executes on the default database
    session.run("USE DATABASE db1")
    session.run(...)  # Executes on db1

with driver.session(database="db2") as session:
    session.run(...)  # Executes on db2
    session.run("USE DATABASE db1")  # Error: database switching disabled
```

### Audit Logs

Audit logs now encompass the active database name, positioned immediately after
the username field.

## Backwards compatibility

The multi-tenant feature ensures backwards compatibility, facilitating smooth
version upgrades and downgrades without disrupting user experience. During an
upgrade, previous data is migrated to the default database, while downgrading
retains data solely in the default database.
