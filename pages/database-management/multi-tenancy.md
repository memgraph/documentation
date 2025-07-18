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

### Default database best practices

In multi-tenant environments, we recommend treating the default "memgraph" database as an administrative/system database rather than storing application data in it. This approach provides better security and isolation, especially given recent changes to authentication and authorization requirements.

#### Why treat memgraph as an admin database?

Recent changes to Memgraph require that users have both the `AUTH` privilege and access to the default "memgraph" database to execute authentication and authorization queries. Additionally, replication queries (such as `REGISTER REPLICA`, `SHOW REPLICAS`, etc.) and multi-database queries (such as `SHOW DATABASES`, `CREATE DATABASE`, etc.) also now target the "memgraph" database and require access to it. This requirement affects multi-tenant environments where users might have access to other databases but not the default one.

#### Recommended setup

1. **Restrict memgraph database access**: Only grant access to the "memgraph" database to privileged users who need to perform system administration tasks
2. **Use tenant-specific databases**: Store all application data in dedicated tenant databases
3. **Separate concerns**: Keep user management, role management, system administration, replication management, and multi-database management separate from application data

#### Example configuration

```cypher
-- Create admin role with full system privileges
CREATE ROLE system_admin;
GRANT ALL PRIVILEGES TO system_admin;
GRANT DATABASE memgraph TO system_admin;

-- Create tenant-specific roles (no access to memgraph database)
CREATE ROLE tenant1_admin;
CREATE ROLE tenant1_user;
CREATE ROLE tenant2_admin;
CREATE ROLE tenant2_user;

-- Grant appropriate permissions to tenant roles
GRANT MATCH, CREATE, MERGE, SET, DELETE, INDEX TO tenant1_admin;
GRANT MATCH, CREATE, MERGE, SET, DELETE TO tenant1_user;
GRANT MATCH, CREATE, MERGE, SET, DELETE, INDEX TO tenant2_admin;
GRANT MATCH, CREATE, MERGE, SET, DELETE TO tenant2_user;

-- Grant access only to tenant databases
GRANT DATABASE tenant1_db TO tenant1_admin, tenant1_user;
GRANT DATABASE tenant2_db TO tenant2_admin, tenant2_user;

-- Create users
CREATE USER system_admin_user IDENTIFIED BY 'admin_password';
CREATE USER tenant1_admin_user IDENTIFIED BY 't1_admin_pass';
CREATE USER tenant1_regular_user IDENTIFIED BY 't1_user_pass';
CREATE USER tenant2_admin_user IDENTIFIED BY 't2_admin_pass';
CREATE USER tenant2_regular_user IDENTIFIED BY 't2_user_pass';

-- Assign roles
SET ROLE FOR system_admin_user TO system_admin;
SET ROLE FOR tenant1_admin_user TO tenant1_admin;
SET ROLE FOR tenant1_regular_user TO tenant1_user;
SET ROLE FOR tenant2_admin_user TO tenant2_admin;
SET ROLE FOR tenant2_regular_user TO tenant2_user;
```

In this configuration:
- `system_admin_user` can perform all authentication/authorization, replication, and multi-database operations and has access to the "memgraph" database
- Tenant users can only access their respective tenant databases
- Application data is completely isolated in tenant-specific databases
- The "memgraph" database serves purely as an administrative database

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

### Multi-database queries and the memgraph database

Recent changes to Memgraph have modified how multi-database queries are executed. Multi-database queries (such as `SHOW DATABASES`, `CREATE DATABASE`, `DROP DATABASE`, etc.) now target the default "memgraph" database and require access to it.

#### Requirements for multi-database queries

To execute multi-database queries, users must have:
1. The appropriate multi-database privileges (`MULTI_DATABASE_USE`, `MULTI_DATABASE_EDIT`)
2. Access to the default "memgraph" database

#### Impact on multi-tenant environments

In multi-tenant environments where users might not have access to the "memgraph" database, multi-database management operations will fail. This reinforces the recommendation to treat the "memgraph" database as an administrative/system database.

#### Example: Admin user with multi-database privileges

```cypher
-- Create admin role with multi-database privileges
CREATE ROLE multi_db_admin;
GRANT MULTI_DATABASE_USE, MULTI_DATABASE_EDIT TO multi_db_admin;
GRANT DATABASE memgraph TO multi_db_admin;

-- Create user with multi-database admin role
CREATE USER db_admin IDENTIFIED BY 'admin_password';
SET ROLE FOR db_admin TO multi_db_admin;
```

In this setup, `db_admin` can:
- Execute all multi-database queries (`SHOW DATABASES`, `CREATE DATABASE`, etc.)
- Access the "memgraph" database for administrative operations
- Manage the multi-tenant database configuration

#### Best practice

For multi-database management, ensure that users who need to perform multi-database operations have both the appropriate multi-database privileges and access to the "memgraph" database. This aligns with the overall recommendation to treat the "memgraph" database as an administrative database in multi-tenant environments.

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
