---
title: Database management
description: Learn the best practices on how to manage your Memgraph instance and utilize its features properly.
---

# Database management

Learn which features Memgraph offers for the smooth database management and how to utilize them.

## [Audit log](/configuration/audit-log)

Memgraph supports all query audit logging. When enabled, the audit log contains
records of all queries executed on the database.

## [Auth module](/configuration/auth-module)

Authentication modules play a crucial role in ensuring the security and
integrity of systems by preventing unauthorized access. For the purpose of
supporting LDAP authentication and (optional) authorization, we have built an
auth module that is packaged with Memgraph Enterprise. 

## [Configuration](/configuration/configuration-settings)

Memgraph can be configured by editing the Memgraph configuration file or by
including another configuration file.

## [Data durability and backup](/configuration/data-durability-and-backup) 

Memgraph uses snapshots and WAL to ensure the durability of the stored data and
it comes with a couple of queries that allow you to safely make a backup of
these files.

## [Enabling Memgraph Enterprise](/configuration/enabling-memgraph-enterprise) 

Check how to enable Memgraph Enterprise to get access to advanced security
features and multi-tenancy. 

## [Logs](/configuration/logs)

Check how to access logs and change log tracking level. 

## [Metadata](/configuration/metadata)

Bolt protocol specifies additional data (metadata) that can be sent along with
the requested results. Find out how to access it.

## [Monitoring server](/configuration/monitoring-server)

Receive logs and runtime information from Memgraph in real-time using a
WebSocket or HTTP server.

## [Multi-tenancy](/configuration/multi-tenancy)

Multi-tenant support in Memgraph enables users to manage multiple isolated
databases within a single instance. The primary objective is to facilitate
efficient resource isolation, maintain data integrity, and manage access for
different clients.

## [Replication](/configuration/replication)

Memgraph comes with a couple of queries that allow you to safely make a backup
of the files containing its data. Memgraph supports replication and allows you
to create a cluster of nodes running Memgraph instances.

### [Experimental Replication](/configuration/replication/experimental-replication)

When distributing data across several instances, Memgraph uses replication. This
has now been expanded to include not only user data but system data as well. 

## [Security](/configuration/security)

Memgraph comes with the option of granting, denying, or revoking a certain set
of privileges to users or groups of users.

## [Server stats](/configuration/server-stats)

Get information about the running instance. 

## [SSL encryption](/configuration/ssl-encryption)

Memgraph uses SSL (Secure Sockets Layer) protocol for establishing an
authenticated and encrypted connection to a database instance.

## [System configuration](/configuration/system-configuration)

Improving Memgraph's efficiency may occasionally require fine-tuning settings at
the operating system level. Such modifications are directly related to the rules
that control resource distribution and the management of processes.
