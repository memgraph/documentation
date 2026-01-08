---
name: pagerank
description: Calculate PageRank scores for nodes in a graph to measure their influence based on the number and quality of incoming connections. Use when the user wants to find important, influential, or central nodes, rank nodes by importance, identify key entities, or analyze node influence in networks.
license: Apache-2.0
metadata:
  author: memgraph
  version: "1.0"
  algorithm_type: centrality
  complexity: "O(V + E)"
---

# PageRank Algorithm

PageRank calculates the influence of nodes based on recursive information about connected nodes' influence. Originally developed for ranking web pages, it's useful for any network where influence propagates through connections.

## When to Use This Skill

Use PageRank when:
- Finding the most important/influential nodes in a network
- Ranking entities by their connectivity importance
- Identifying key players in social networks
- Finding authoritative sources in citation networks
- Detecting influential accounts in social media graphs

## Basic Usage

### Run PageRank on Entire Graph

```cypher
CALL pagerank.get()
YIELD node, rank
RETURN node, rank
ORDER BY rank DESC
LIMIT 10;
```

### Run PageRank with Custom Parameters

```cypher
CALL pagerank.get(100, 0.85)
YIELD node, rank
RETURN node, rank
ORDER BY rank DESC;
```

**Parameters:**
- `max_iterations` (default: 100) - Maximum number of iterations
- `damping_factor` (default: 0.85) - Probability of following a link (0-1)

## Advanced Usage

### PageRank on Subgraph

```cypher
MATCH (n:Person)-[r:KNOWS]->(m:Person)
WITH collect(n) + collect(m) AS nodes, collect(r) AS relationships
CALL pagerank.get_subgraph(nodes, relationships, 100, 0.85)
YIELD node, rank
RETURN node.name AS name, rank
ORDER BY rank DESC;
```

### Filter Results by Label

```cypher
CALL pagerank.get()
YIELD node, rank
WHERE node:Person
RETURN node.name AS name, rank
ORDER BY rank DESC
LIMIT 20;
```

## Output Format

| Column | Type | Description |
|--------|------|-------------|
| node | Node | The graph node |
| rank | Float | PageRank score (higher = more influential) |

## Example Results

```
╔════════════════════╦═══════════════╗
║ name               ║ rank          ║
╠════════════════════╬═══════════════╣
║ "Alice"            ║ 0.287         ║
║ "Bob"              ║ 0.234         ║
║ "Charlie"          ║ 0.198         ║
╚════════════════════╩═══════════════╝
```

## Common Edge Cases

1. **Disconnected graphs**: Nodes in disconnected components will have independent PageRank calculations
2. **Sink nodes** (no outgoing edges): The damping factor handles these by redistributing probability
3. **Self-loops**: Handled normally but may inflate a node's rank
4. **Empty graph**: Returns empty results

## Tips for Interpretation

- Scores are relative, not absolute - compare nodes within the same graph
- Higher damping factor (closer to 1) = more weight on link structure
- Lower damping factor = more uniform distribution
- Total PageRank sums to approximately 1.0 (or number of nodes depending on implementation)
