---
name: katz-centrality
description: Calculate Katz centrality which measures node influence based on the total number of walks between nodes with exponentially decaying weights. Use when measuring influence in networks where indirect connections matter, or when PageRank doesn't account for all paths.
license: Apache-2.0
metadata:
  author: memgraph
  version: "1.0"
  algorithm_type: centrality
  complexity: "O(V * E)"
---

# Katz Centrality

Katz centrality measures influence based on the total number of walks (paths of any length) between a node and all other nodes, with longer walks weighted less through an attenuation factor.

## When to Use This Skill

Use Katz centrality when:
- Measuring influence considering all paths (not just shortest)
- Networks where indirect connections matter
- Analyzing information spread potential
- Finding nodes with high reachability
- Alternative to PageRank for certain networks

## Basic Usage

### Calculate Katz Centrality

```cypher
CALL katz_centrality.get()
YIELD node, score
RETURN node, score
ORDER BY score DESC
LIMIT 10;
```

### With Custom Alpha (Attenuation Factor)

```cypher
CALL katz_centrality.get(0.1)
YIELD node, score
RETURN node, score
ORDER BY score DESC;
```

**Parameters:**
- `alpha` (default: 0.2) - Attenuation factor (0 < alpha < 1/λ where λ is largest eigenvalue)

## Advanced Usage

### Compare with PageRank

```cypher
CALL katz_centrality.get() YIELD node AS knode, score AS katz
CALL pagerank.get() YIELD node AS pnode, rank AS pagerank
WHERE id(knode) = id(pnode)
RETURN knode.name AS name, katz, pagerank
ORDER BY katz DESC
LIMIT 10;
```

### Katz on Subgraph

```cypher
MATCH (n:Person)-[r:INFLUENCES]->(m:Person)
WITH collect(DISTINCT n) + collect(DISTINCT m) AS nodes, collect(r) AS rels
CALL katz_centrality.get_subgraph(nodes, rels, 0.1)
YIELD node, score
RETURN node.name AS name, score
ORDER BY score DESC;
```

### Filter by Label

```cypher
CALL katz_centrality.get()
YIELD node, score
WHERE node:Influencer
RETURN node.name AS name, score
ORDER BY score DESC;
```

## Output Format

| Column | Type | Description |
|--------|------|-------------|
| node | Node | The graph node |
| score | Float | Katz centrality score |

## Katz vs PageRank

| Aspect | Katz | PageRank |
|--------|------|----------|
| Walks considered | All walks | Random walks |
| Path weighting | Exponential decay | Damping factor |
| Sink handling | Natural | Requires adjustment |
| Use case | General influence | Link importance |

## Example Results

```
╔════════════════════╦═══════════════╗
║ name               ║ score         ║
╠════════════════════╬═══════════════╣
║ "Influencer_A"     ║ 0.892         ║
║ "Hub_Node"         ║ 0.756         ║
║ "Connector_B"      ║ 0.634         ║
╚════════════════════╩═══════════════╝
```

## Common Edge Cases

1. **Alpha too high**: May not converge (should be < 1/λ)
2. **Disconnected nodes**: Score based only on reachable nodes
3. **Dense graphs**: Many paths increase scores
4. **Self-loops**: Contribute to own score

## Tips

- Alpha controls how much distant connections matter
- Lower alpha = more focus on direct connections
- Higher alpha = more weight on indirect paths
- If convergence fails, try lower alpha
- Good for networks where "any path" matters (not just shortest)
