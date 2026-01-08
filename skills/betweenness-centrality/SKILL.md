---
name: betweenness-centrality
description: Calculate betweenness centrality to find nodes that act as bridges or connectors in the graph by measuring how often they appear on shortest paths between other nodes. Use when finding bridge nodes, connectors, bottlenecks, or nodes that control information flow.
license: Apache-2.0
metadata:
  author: memgraph
  version: "1.0"
  algorithm_type: centrality
  complexity: "O(V * E)"
---

# Betweenness Centrality

Betweenness centrality measures the extent to which a node lies on paths between other nodes. Nodes with high betweenness centrality act as bridges or gatekeepers in the network.

## When to Use This Skill

Use betweenness centrality when:
- Finding bridge nodes that connect different parts of a network
- Identifying bottlenecks or critical points
- Detecting nodes that control information flow
- Finding connectors between communities
- Analyzing network resilience (removing high-betweenness nodes)

## Basic Usage

### Calculate Betweenness Centrality

```cypher
CALL betweenness_centrality.get()
YIELD node, betweenness_centrality
RETURN node, betweenness_centrality
ORDER BY betweenness_centrality DESC
LIMIT 10;
```

### Normalized Betweenness Centrality

```cypher
CALL betweenness_centrality.get(True, True)
YIELD node, betweenness_centrality
RETURN node, betweenness_centrality
ORDER BY betweenness_centrality DESC;
```

**Parameters:**
- `directed` (default: True) - Whether to treat the graph as directed
- `normalized` (default: True) - Normalize scores to [0, 1] range

## Advanced Usage

### Betweenness on Subgraph

```cypher
MATCH (n:Person)-[r:WORKS_WITH]->(m:Person)
WITH collect(n) + collect(m) AS nodes, collect(r) AS rels
CALL betweenness_centrality.get_subgraph(nodes, rels)
YIELD node, betweenness_centrality
RETURN node.name AS name, betweenness_centrality
ORDER BY betweenness_centrality DESC;
```

### Filter by Label

```cypher
CALL betweenness_centrality.get()
YIELD node, betweenness_centrality
WHERE node:Router
RETURN node.name AS router, betweenness_centrality
ORDER BY betweenness_centrality DESC;
```

### Compare with Other Centralities

```cypher
CALL betweenness_centrality.get() YIELD node, betweenness_centrality
WITH node, betweenness_centrality
CALL pagerank.get() YIELD node AS pr_node, rank
WHERE node = pr_node
RETURN node.name, betweenness_centrality, rank AS pagerank
ORDER BY betweenness_centrality DESC;
```

## Output Format

| Column | Type | Description |
|--------|------|-------------|
| node | Node | The graph node |
| betweenness_centrality | Float | Centrality score (higher = more important as bridge) |

## Example Results

```
╔════════════════════╦═══════════════════════════╗
║ name               ║ betweenness_centrality    ║
╠════════════════════╬═══════════════════════════╣
║ "Gateway_Router"   ║ 0.892                     ║
║ "Central_Hub"      ║ 0.734                     ║
║ "Bridge_Node"      ║ 0.651                     ║
╚════════════════════╩═══════════════════════════╝
```

## Common Edge Cases

1. **Disconnected graphs**: Nodes in separate components have 0 betweenness relative to each other
2. **Star topology**: Central node has maximum betweenness
3. **Complete graphs**: All nodes have equal (low) betweenness
4. **Linear chains**: Middle nodes have highest betweenness

## Interpretation Tips

- High betweenness = critical for connectivity
- Removing high-betweenness nodes may fragment the network
- Compare normalized scores across different graphs
- Often complements PageRank (different aspects of importance)
