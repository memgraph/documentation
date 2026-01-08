---
name: community-detection
description: Detect communities in a graph using the Louvain algorithm to find groups of densely connected nodes. Use when the user wants to find clusters, groups, communities, detect graph partitions, identify related entities, or segment a network.
license: Apache-2.0
metadata:
  author: memgraph
  version: "1.0"
  algorithm_type: community
  complexity: "O(n log n)"
---

# Community Detection (Louvain Algorithm)

The Louvain method is a greedy algorithm for finding communities with maximum modularity in a graph. It identifies groups of nodes that are more densely connected internally than with the rest of the graph.

## When to Use This Skill

Use community detection when:
- Finding natural groupings or clusters in a network
- Identifying related entities that form communities
- Segmenting social networks into friend groups
- Discovering topic clusters in document networks
- Partitioning large graphs for analysis

## Basic Usage

### Detect Communities

```cypher
CALL community_detection.get()
YIELD node, community_id
RETURN node, community_id
ORDER BY community_id;
```

### Get Community Statistics

```cypher
CALL community_detection.get()
YIELD node, community_id
RETURN community_id, count(node) AS size
ORDER BY size DESC;
```

## Advanced Usage

### Community Detection with Weight

```cypher
CALL community_detection.get(True, True, "weight", 1.0)
YIELD node, community_id
RETURN node, community_id;
```

**Parameters:**
- `directed` (default: False) - Treat graph as directed
- `weighted` (default: False) - Use edge weights
- `weight_property` (default: "weight") - Property name for weights
- `resolution` (default: 1.0) - Resolution parameter (higher = smaller communities)

### Community Detection on Subgraph

```cypher
MATCH (n:Person)-[r:KNOWS]->(m:Person)
WITH collect(n) + collect(m) AS nodes, collect(r) AS rels
CALL community_detection.get_subgraph(nodes, rels)
YIELD node, community_id
RETURN node.name AS name, community_id
ORDER BY community_id;
```

### Find Community Members

```cypher
CALL community_detection.get()
YIELD node, community_id
WITH community_id, collect(node.name) AS members
RETURN community_id, members, size(members) AS member_count
ORDER BY member_count DESC;
```

## Output Format

| Column | Type | Description |
|--------|------|-------------|
| node | Node | The graph node |
| community_id | Integer | Community identifier (nodes with same ID are in same community) |

## Example Results

```
╔════════════════════╦═══════════════╗
║ name               ║ community_id  ║
╠════════════════════╬═══════════════╣
║ "Alice"            ║ 0             ║
║ "Bob"              ║ 0             ║
║ "Charlie"          ║ 1             ║
║ "David"            ║ 1             ║
╚════════════════════╩═══════════════╝
```

## Common Edge Cases

1. **Single node communities**: Isolated nodes form their own communities
2. **Highly connected graphs**: May result in one large community
3. **Disconnected components**: Each component analyzed separately
4. **Resolution parameter**: Adjust to control community granularity

## Tips for Better Results

- Start with default parameters, then adjust resolution
- Higher resolution (>1.0) finds smaller, more granular communities
- Lower resolution (<1.0) finds larger, coarser communities
- For weighted graphs, ensure weight property exists on edges
- Compare results at different resolution values
