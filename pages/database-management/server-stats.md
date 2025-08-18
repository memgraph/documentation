---
title: Server stats
description: Monitor the performance and health of your Memgraph server with confidence. Head over to Memgraph's documentation page to gain more insights into server stats.
---

# Server stats

Memgraph supports multiple queries to get information about the instance that is
being queried.

## Instance version

To get the version of the instance being queried, run the following query:

```cypher
SHOW VERSION;
```

## Storage information

Running the following query will return certain information about the storage of
the current instance:

```cypher
SHOW STORAGE INFO;
```

The result will contain the following fields:

| Field                        | Description                                                                                                                                                                                   |
|------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| name                         | Name of the current database.                    |
| vertex_count                 | The number of stored nodes (vertices).                                                                                                                                                        |
| edge_count                   | The number of stored relationships (edges).                                                                                                                                                   |
| average_degree               | The average number of relationships of a single node.                                                                                                                                         |
| vm_max_map_count             | The number of memory-mapped areas that the kernel allows a process to have. If it is unknown, returns -1. </br> For more info, check out [virtual memory section of the docs](/fundamentals/storage-memory-usage#virtual-memory).                                    |
| memory_res                   | The non-swapped physical RAM memory a task has used, reported by the OS (in B, KiB, MiB, GiB or TiB).                                                                                                                       |
| peak_memory_res              | Peak RAM memory usage in the system during the whole run.                                        |
| unreleased_delta_objects     | The current number of still allocated objects with the information about the changes that write transactions have made, called Delta objects. Refer to allocation and deallocation of Delta objects [on this page](/fundamentals/storage-memory-usage#in-memory-transactional-storage-mode-default).                        |
| disk_usage                   | The amount of disk space used by the data directory (in B, KiB, MiB, GiB or TiB).                                                                                                             |
| memory_tracked               | The amount of RAM allocated in the system and tracked by Memgraph (in B, KiB, MiB, GiB or TiB).<br/>For more info, check out [memory control](/fundamentals/storage-memory-usage).        |
| allocation_limit             | The current allocation limit set for this instance (in B, KiB, MiB, GiB or TiB).<br/>For more info, check out the [memory control](/fundamentals/storage-memory-usage#control-memory-usage).                       |
| global_isolation_level       | The current `global` isolation level.<br/>For more info, check out [isolation levels](/fundamentals/transactions#isolation-levels).                                                       |
| session_isolation_level      | The current `session` isolation level.                                                                                                                                                        |
| next_session_isolation_level | The current `next` isolation level.                                                                                                                                                           |
| storage_mode                 | The current storage mode.<br/>For more info, check out [storage modes](/fundamentals/storage-memory-usage#storage-modes).       |


## License information

Running the following query will return certain information about the Memgraph 
Enterprise License that was injected into the system.

```cypher
SHOW LICENSE INFO;
```

| Field             | Description                                         |
|-------------------|-----------------------------------------------------|
| organization_name | Organization name for the enterprise license.       |
| license_key       | Encoded license key.                                |
| is_valid          | Brief flag whether the license is currently valid.  |
| license_type      | Enterprise / OEM                                    |
| valid_until       | Date when the license expires.                      |
| memory_limit      | Memory limit (in GiB).                              |
| status            | Descriptive status of the license validity.         |



## Metrics information

Running this query will show the system metrics. Same metrics can be provided from the HTTP endpoint at default
port 9091. This is a query that only works with the Memgraph Enterprise License. For the information about the metrics,
please see the [information about monitoring via HTTP server](/database-management/monitoring#monitoring-via-http-server-enterprise).

```cypher
SHOW METRICS INFO;
```

users can also use the following query to get the same information:

```cypher
SHOW METRICS;
```

```copy=false
+------------------------------------------+---------------------+-------------+------------+
| name                                     | type                | metric type | value      |
+------------------------------------------+---------------------+-------------+------------+
| "AverageDegree"                          | "General"           | "Gauge"     | 41.2732    |
| "EdgeCount"                              | "General"           | "Gauge"     | 871978     |
| "VertexCount"                            | "General"           | "Gauge"     | 42254      |
| "SocketConnect_us_50p"                   | "General"           | "Histogram" | 0          |
| "SocketConnect_us_90p"                   | "General"           | "Histogram" | 0          |
| "SocketConnect_us_99p"                   | "General"           | "Histogram" | 0          |
| "BecomeLeaderSuccess"                    | "HighAvailability"  | "Counter"   | 0          |
| "DemoteInstance"                         | "HighAvailability"  | "Counter"   | 0          |
| "DemoteMainToReplicaRpcFail"             | "HighAvailability"  | "Counter"   | 0          |
| "DemoteMainToReplicaRpcSuccess"          | "HighAvailability"  | "Counter"   | 0          |
| "EnableWritingOnMainRpcFail"             | "HighAvailability"  | "Counter"   | 0          |
| "EnableWritingOnMainRpcSuccess"          | "HighAvailability"  | "Counter"   | 0          |
| "FailedToBecomeLeader"                   | "HighAvailability"  | "Counter"   | 0          |
| "GetDatabaseHistoriesRpcFail"            | "HighAvailability"  | "Counter"   | 0          |
| "GetDatabaseHistoriesRpcSuccess"         | "HighAvailability"  | "Counter"   | 0          |
| "NoAliveInstanceFailedFailovers"         | "HighAvailability"  | "Counter"   | 0          |
| "PromoteToMainRpcFail"                   | "HighAvailability"  | "Counter"   | 0          |
| "PromoteToMainRpcSuccess"                | "HighAvailability"  | "Counter"   | 0          |
| "RaftFailedFailovers"                    | "HighAvailability"  | "Counter"   | 0          |
| "RegisterReplicaOnMainRpcFail"           | "HighAvailability"  | "Counter"   | 0          |
| "RegisterReplicaOnMainRpcSuccess"        | "HighAvailability"  | "Counter"   | 0          |
| "RemoveCoordInstance"                    | "HighAvailability"  | "Counter"   | 0          |
| "ReplicaRecoveryFail"                    | "HighAvailability"  | "Counter"   | 0          |
| "ReplicaRecoverySkip"                    | "HighAvailability"  | "Counter"   | 0          |
| "ReplicaRecoverySuccess"                 | "HighAvailability"  | "Counter"   | 0          |
| "ShowInstance"                           | "HighAvailability"  | "Counter"   | 0          |
| "ShowInstances"                          | "HighAvailability"  | "Counter"   | 0          |
| "StateCheckRpcFail"                      | "HighAvailability"  | "Counter"   | 0          |
| "StateCheckRpcSuccess"                   | "HighAvailability"  | "Counter"   | 0          |
| "SuccessfulFailovers"                    | "HighAvailability"  | "Counter"   | 0          |
| "SwapMainUUIDRpcFail"                    | "HighAvailability"  | "Counter"   | 0          |
| "SwapMainUUIDRpcSuccess"                 | "HighAvailability"  | "Counter"   | 0          |
| "UnregisterReplInstance"                 | "HighAvailability"  | "Counter"   | 0          |
| "UnregisterReplicaRpcFail"               | "HighAvailability"  | "Counter"   | 0          |
| "UnregisterReplicaRpcSuccess"            | "HighAvailability"  | "Counter"   | 0          |
| "ChooseMostUpToDateInstance_us_50p"      | "HighAvailability"  | "Histogram" | 0          |
| "ChooseMostUpToDateInstance_us_90p"      | "HighAvailability"  | "Histogram" | 0          |
| "ChooseMostUpToDateInstance_us_99p"      | "HighAvailability"  | "Histogram" | 0          |
| "CurrentWalRpc_us_50p"                   | "HighAvailability"  | "Histogram" | 0          |
| "CurrentWalRpc_us_90p"                   | "HighAvailability"  | "Histogram" | 0          |
| "CurrentWalRpc_us_99p"                   | "HighAvailability"  | "Histogram" | 0          |
| "DataFailover_us_50p"                    | "HighAvailability"  | "Histogram" | 0          |
| "DataFailover_us_90p"                    | "HighAvailability"  | "Histogram" | 0          |
| "DataFailover_us_99p"                    | "HighAvailability"  | "Histogram" | 0          |
| "DemoteMainToReplicaRpc_us_50p"          | "HighAvailability"  | "Histogram" | 0          |
| "DemoteMainToReplicaRpc_us_90p"          | "HighAvailability"  | "Histogram" | 0          |
| "DemoteMainToReplicaRpc_us_99p"          | "HighAvailability"  | "Histogram" | 0          |
| "EnableWritingOnMainRpc_us_50p"          | "HighAvailability"  | "Histogram" | 0          |
| "EnableWritingOnMainRpc_us_90p"          | "HighAvailability"  | "Histogram" | 0          |
| "EnableWritingOnMainRpc_us_99p"          | "HighAvailability"  | "Histogram" | 0          |
| "FinalizeTxnReplication_us_50p"          | "HighAvailability"  | "Histogram" | 0          |
| "FinalizeTxnReplication_us_90p"          | "HighAvailability"  | "Histogram" | 0          |
| "FinalizeTxnReplication_us_99p"          | "HighAvailability"  | "Histogram" | 0          |
| "FrequentHeartbeatRpc_us_50p"            | "HighAvailability"  | "Histogram" | 0          |
| "FrequentHeartbeatRpc_us_90p"            | "HighAvailability"  | "Histogram" | 0          |
| "FrequentHeartbeatRpc_us_99p"            | "HighAvailability"  | "Histogram" | 0          |
| "GetDatabaseHistoriesRpc_us_50p"         | "HighAvailability"  | "Histogram" | 0          |
| "GetDatabaseHistoriesRpc_us_90p"         | "HighAvailability"  | "Histogram" | 0          |
| "GetDatabaseHistoriesRpc_us_99p"         | "HighAvailability"  | "Histogram" | 0          |
| "GetHistories_us_50p"                    | "HighAvailability"  | "Histogram" | 0          |
| "GetHistories_us_90p"                    | "HighAvailability"  | "Histogram" | 0          |
| "GetHistories_us_99p"                    | "HighAvailability"  | "Histogram" | 0          |
| "HeartbeatRpc_us_50p"                    | "HighAvailability"  | "Histogram" | 0          |
| "HeartbeatRpc_us_90p"                    | "HighAvailability"  | "Histogram" | 0          |
| "HeartbeatRpc_us_99p"                    | "HighAvailability"  | "Histogram" | 0          |
| "InstanceFailCallback_us_50p"            | "HighAvailability"  | "Histogram" | 0          |
| "InstanceFailCallback_us_90p"            | "HighAvailability"  | "Histogram" | 0          |
| "InstanceFailCallback_us_99p"            | "HighAvailability"  | "Histogram" | 0          |
| "InstanceSuccCallback_us_50p"            | "HighAvailability"  | "Histogram" | 0          |
| "InstanceSuccCallback_us_90p"            | "HighAvailability"  | "Histogram" | 0          |
| "InstanceSuccCallback_us_99p"            | "HighAvailability"  | "Histogram" | 0          |
| "PrepareCommitRpc_us_50p"                | "HighAvailability"  | "Histogram" | 0          |
| "PrepareCommitRpc_us_90p"                | "HighAvailability"  | "Histogram" | 0          |
| "PrepareCommitRpc_us_99p"                | "HighAvailability"  | "Histogram" | 0          |
| "PromoteToMainRpc_us_50p"                | "HighAvailability"  | "Histogram" | 0          |
| "PromoteToMainRpc_us_90p"                | "HighAvailability"  | "Histogram" | 0          |
| "PromoteToMainRpc_us_99p"                | "HighAvailability"  | "Histogram" | 0          |
| "RegisterReplicaOnMainRpc_us_50p"        | "HighAvailability"  | "Histogram" | 0          |
| "RegisterReplicaOnMainRpc_us_90p"        | "HighAvailability"  | "Histogram" | 0          |
| "RegisterReplicaOnMainRpc_us_99p"        | "HighAvailability"  | "Histogram" | 0          |
| "ReplicaStream_us_50p"                   | "HighAvailability"  | "Histogram" | 0          |
| "ReplicaStream_us_90p"                   | "HighAvailability"  | "Histogram" | 0          |
| "ReplicaStream_us_99p"                   | "HighAvailability"  | "Histogram" | 0          |
| "SnapshotRpc_us_50p"                     | "HighAvailability"  | "Histogram" | 0          |
| "SnapshotRpc_us_90p"                     | "HighAvailability"  | "Histogram" | 0          |
| "SnapshotRpc_us_99p"                     | "HighAvailability"  | "Histogram" | 0          |
| "StartTxnReplication_us_50p"             | "HighAvailability"  | "Histogram" | 0          |
| "StartTxnReplication_us_90p"             | "HighAvailability"  | "Histogram" | 0          |
| "StartTxnReplication_us_99p"             | "HighAvailability"  | "Histogram" | 0          |
| "StateCheckRpc_us_50p"                   | "HighAvailability"  | "Histogram" | 0          |
| "StateCheckRpc_us_90p"                   | "HighAvailability"  | "Histogram" | 0          |
| "StateCheckRpc_us_99p"                   | "HighAvailability"  | "Histogram" | 0          |
| "SystemRecoveryRpc_us_50p"               | "HighAvailability"  | "Histogram" | 0          |
| "SystemRecoveryRpc_us_90p"               | "HighAvailability"  | "Histogram" | 0          |
| "SystemRecoveryRpc_us_99p"               | "HighAvailability"  | "Histogram" | 0          |
| "UnregisterReplicaRpc_us_50p"            | "HighAvailability"  | "Histogram" | 0          |
| "UnregisterReplicaRpc_us_90p"            | "HighAvailability"  | "Histogram" | 0          |
| "UnregisterReplicaRpc_us_99p"            | "HighAvailability"  | "Histogram" | 0          |
| "WalFilesRpc_us_50p"                     | "HighAvailability"  | "Histogram" | 0          |
| "WalFilesRpc_us_90p"                     | "HighAvailability"  | "Histogram" | 0          |
| "WalFilesRpc_us_99p"                     | "HighAvailability"  | "Histogram" | 0          |
| "ActiveEdgePropertyIndices"              | "Index"             | "Counter"   | 0          |
| "ActiveEdgeTypeIndices"                  | "Index"             | "Counter"   | 0          |
| "ActiveEdgeTypePropertyIndices"          | "Index"             | "Counter"   | 0          |
| "ActiveLabelIndices"                     | "Index"             | "Counter"   | 6          |
| "ActiveLabelPropertyIndices"             | "Index"             | "Counter"   | 18         |
| "ActivePointIndices"                     | "Index"             | "Counter"   | 0          |
| "ActiveTextIndices"                      | "Index"             | "Counter"   | 0          |
| "ActiveVectorEdgeIndices"                | "Index"             | "Counter"   | 0          |
| "ActiveVectorIndices"                    | "Index"             | "Counter"   | 0          |
| "UnreleasedDeltaObjects"                 | "Memory"            | "Counter"   | 0          |
| "DiskUsage"                              | "Memory"            | "Gauge"     | 81508835   |
| "MemoryRes"                              | "Memory"            | "Gauge"     | 339640320  |
| "PeakMemoryRes"                          | "Memory"            | "Gauge"     | 339775488  |
| "AccumulateOperator"                     | "Operator"          | "Counter"   | 0          |
| "AggregateOperator"                      | "Operator"          | "Counter"   | 0          |
| "ApplyOperator"                          | "Operator"          | "Counter"   | 0          |
| "CallProcedureOperator"                  | "Operator"          | "Counter"   | 0          |
| "CartesianOperator"                      | "Operator"          | "Counter"   | 0          |
| "ConstructNamedPathOperator"             | "Operator"          | "Counter"   | 0          |
| "CreateExpandOperator"                   | "Operator"          | "Counter"   | 0          |
| "CreateNodeOperator"                     | "Operator"          | "Counter"   | 0          |
| "DeleteOperator"                         | "Operator"          | "Counter"   | 0          |
| "DistinctOperator"                       | "Operator"          | "Counter"   | 0          |
| "EdgeUniquenessFilterOperator"           | "Operator"          | "Counter"   | 0          |
| "EmptyResultOperator"                    | "Operator"          | "Counter"   | 0          |
| "EvaluatePatternFilterOperator"          | "Operator"          | "Counter"   | 0          |
| "ExpandOperator"                         | "Operator"          | "Counter"   | 0          |
| "ExpandVariableOperator"                 | "Operator"          | "Counter"   | 0          |
| "FilterOperator"                         | "Operator"          | "Counter"   | 0          |
| "ForeachOperator"                        | "Operator"          | "Counter"   | 0          |
| "HashJoinOperator"                       | "Operator"          | "Counter"   | 0          |
| "IndexedJoinOperator"                    | "Operator"          | "Counter"   | 0          |
| "LimitOperator"                          | "Operator"          | "Counter"   | 0          |
| "MergeOperator"                          | "Operator"          | "Counter"   | 0          |
| "OnceOperator"                           | "Operator"          | "Counter"   | 0          |
| "OptionalOperator"                       | "Operator"          | "Counter"   | 0          |
| "OrderByOperator"                        | "Operator"          | "Counter"   | 0          |
| "PeriodicCommitOperator"                 | "Operator"          | "Counter"   | 0          |
| "PeriodicSubqueryOperator"               | "Operator"          | "Counter"   | 0          |
| "ProduceOperator"                        | "Operator"          | "Counter"   | 0          |
| "RemoveLabelsOperator"                   | "Operator"          | "Counter"   | 0          |
| "RemovePropertyOperator"                 | "Operator"          | "Counter"   | 0          |
| "RollUpApplyOperator"                    | "Operator"          | "Counter"   | 0          |
| "ScanAllByEdgeIdOperator"                | "Operator"          | "Counter"   | 0          |
| "ScanAllByEdgeOperator"                  | "Operator"          | "Counter"   | 0          |
| "ScanAllByEdgePropertyOperator"          | "Operator"          | "Counter"   | 0          |
| "ScanAllByEdgePropertyRangeOperator"     | "Operator"          | "Counter"   | 0          |
| "ScanAllByEdgePropertyValueOperator"     | "Operator"          | "Counter"   | 0          |
| "ScanAllByEdgeTypeOperator"              | "Operator"          | "Counter"   | 0          |
| "ScanAllByEdgeTypePropertyOperator"      | "Operator"          | "Counter"   | 0          |
| "ScanAllByEdgeTypePropertyRangeOperator" | "Operator"          | "Counter"   | 0          |
| "ScanAllByEdgeTypePropertyValueOperator" | "Operator"          | "Counter"   | 0          |
| "ScanAllByIdOperator"                    | "Operator"          | "Counter"   | 0          |
| "ScanAllByLabelOperator"                 | "Operator"          | "Counter"   | 0          |
| "ScanAllByLabelPropertiesOperator"       | "Operator"          | "Counter"   | 0          |
| "ScanAllByPointDistanceOperator"         | "Operator"          | "Counter"   | 0          |
| "ScanAllByPointWithinbboxOperator"       | "Operator"          | "Counter"   | 0          |
| "ScanAllOperator"                        | "Operator"          | "Counter"   | 0          |
| "SetLabelsOperator"                      | "Operator"          | "Counter"   | 0          |
| "SetPropertiesOperator"                  | "Operator"          | "Counter"   | 0          |
| "SetPropertyOperator"                    | "Operator"          | "Counter"   | 0          |
| "SkipOperator"                           | "Operator"          | "Counter"   | 0          |
| "UnionOperator"                          | "Operator"          | "Counter"   | 0          |
| "UnwindOperator"                         | "Operator"          | "Counter"   | 0          |
| "QueryExecutionLatency_us_50p"           | "Query"             | "Histogram" | 0          |
| "QueryExecutionLatency_us_90p"           | "Query"             | "Histogram" | 0          |
| "QueryExecutionLatency_us_99p"           | "Query"             | "Histogram" | 0          |
| "ReadQuery"                              | "QueryType"         | "Counter"   | 0          |
| "ReadWriteQuery"                         | "QueryType"         | "Counter"   | 0          |
| "WriteQuery"                             | "QueryType"         | "Counter"   | 0          |
| "ShowSchema"                             | "SchemaInfo"        | "Counter"   | 0          |
| "ActiveBoltSessions"                     | "Session"           | "Counter"   | 1          |
| "ActiveSSLSessions"                      | "Session"           | "Counter"   | 0          |
| "ActiveSessions"                         | "Session"           | "Counter"   | 1          |
| "ActiveTCPSessions"                      | "Session"           | "Counter"   | 1          |
| "ActiveWebSocketSessions"                | "Session"           | "Counter"   | 0          |
| "BoltMessages"                           | "Session"           | "Counter"   | 4          |
| "SnapshotCreationLatency_us_50p"         | "Snapshot"          | "Histogram" | 0          |
| "SnapshotCreationLatency_us_90p"         | "Snapshot"          | "Histogram" | 0          |
| "SnapshotCreationLatency_us_99p"         | "Snapshot"          | "Histogram" | 0          |
| "SnapshotRecoveryLatency_us_50p"         | "Snapshot"          | "Histogram" | 10924534   |
| "SnapshotRecoveryLatency_us_90p"         | "Snapshot"          | "Histogram" | 10924534   |
| "SnapshotRecoveryLatency_us_99p"         | "Snapshot"          | "Histogram" | 10924534   |
| "MessagesConsumed"                       | "Stream"            | "Counter"   | 0          |
| "StreamsCreated"                         | "Stream"            | "Counter"   | 0          |
| "DeletedEdges"                           | "TTL"               | "Counter"   | 0          |
| "DeletedNodes"                           | "TTL"               | "Counter"   | 0          |
| "ActiveTransactions"                     | "Transaction"       | "Counter"   | 1          |
| "CommitedTransactions"                   | "Transaction"       | "Counter"   | 0          |
| "FailedPrepare"                          | "Transaction"       | "Counter"   | 0          |
| "FailedPull"                             | "Transaction"       | "Counter"   | 0          |
| "FailedQuery"                            | "Transaction"       | "Counter"   | 0          |
| "RollbackedTransactions"                 | "Transaction"       | "Counter"   | 0          |
| "SuccessfulQuery"                        | "Transaction"       | "Counter"   | 1          |
| "TriggersCreated"                        | "Trigger"           | "Counter"   | 0          |
| "TriggersExecuted"                       | "Trigger"           | "Counter"   | 0          |
+------------------------------------------+---------------------+-------------+------------+
```

## Build information

Running the following query will return certain information about the build type of
the current instance:

```cypher
SHOW BUILD INFO;
```

| Field      | Description                                         |
|------------|-----------------------------------------------------|
| build_type | The optimization level the instance was built with. |

## Active users information

Running this query will provide information about currently logged-in Memgraph users and their session details.

```cypher
SHOW ACTIVE USERS INFO;
```

```copy=false
| username | session uuid                           | login timestamp       |
|----------|----------------------------------------|-----------------------|
| test     | "550e8400-e29b-41d4-a716-446655440000" | "2024-08-03 18:53:00" |
```
