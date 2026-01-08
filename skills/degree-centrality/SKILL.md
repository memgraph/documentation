---
name: degree-centrality
description: Calculate degree centrality which measures the number of connections a node has. Use when finding the most connected nodes, identifying hubs, or analyzing basic node importance based on direct connections.
license: Apache-2.0
metadata:
  author: memgraph
  version: "1.0"
  algorithm_type: centrality
  complexity: "O(E)"
---

# Degree Centrality

Degree centrality is the simplest centrality measure - it counts the number of edges connected to a node. Nodes with high degree centrality are directly connected to many other nodes.

## When to Use This Skill

Use degree centrality when:
- Finding the most connected nodes (hubs)
- Quick assessment of node importance
- Identifying popular entities
- Analyzing network structure basics
- Pre-filtering before expensive algorithms

## Basic Usage

### Calculate Degree Centrality

```cypher
CALL degree_centrality.get()
YIELD node, degree
RETURN node, degree
ORDER BY degree DESC
LIMIT 10;
```

### Normalized Degree Centrality

```cypher
CALL degree_centrality.get(True)
YIELD node, degree
RETURN node, degree
ORDER BY degree DESC;
```

**Parameters:**
- `normalized` (default: False) - Normalize by maximum possible degree (n-1)

## Advanced Usage

### In-Degree and Out-Degree (Manual)

```cypher
MATCH (n)
OPTIONAL MATCH (n)<-[in_rel]-()
OPTIONAL MATCH (n)-[out_rel]->()
WITH n, count(DISTINCT in_rel) AS in_degree, count(DISTINCT out_rel) AS out_degree
RETURN n.name, in_degree, out_degree, in_degree + out_degree AS total_degree
ORDER BY total_degree DESC;
```

### Degree by Relationship Type

```cypher
MATCH (n:Person)
OPTIONAL MATCH (n)-[r:KNOWS]-()
WITH n, count(r) AS knows_count
OPTIONAL MATCH (n)-[r:WORKS_WITH]-()
WITH n, knows_count, count(r) AS works_with_count
RETURN n.name, knows_count, works_with_count
ORDER BY knows_count + works_with_count DESC;
```

### Filter by Label

```cypher
CALL degree_centrality.get()
YIELD node, degree
WHERE node:Person
RETURN node.name AS name, degree
ORDER BY degree DESC
LIMIT 20;
```

### Degree Distribution

```cypher
MATCH (n)
WITH size((n)--()) AS degree
RETURN degree, count(*) AS frequency
ORDER BY degree;
```

### Find Hub Nodes (High Degree)

```cypher
CALL degree_centrality.get()
YIELD node, degree
WITH avg(degree) AS avg_degree, collect({node: node, degree: degree}) AS all_nodes
UNWIND all_nodes AS n
WHERE n.degree > avg_degree * 2
RETURN n.node.name AS hub, n.degree AS degree
ORDER BY degree DESC;
```

## Output Format

| Column | Type | Description |
|--------|------|-------------|
| node | Node | The graph node |
| degree | Integer/Float | Number of connections (or normalized score) |

## Example Results

```
╔════════════════════╦═══════════════╗
║ name               ║ degree        ║
╠════════════════════╬═══════════════╣
║ "Central_Hub"      ║ 150           ║
║ "Popular_User"     ║ 89            ║
║ "Connector"        ║ 67            ║
╚════════════════════╩═══════════════╝
```

## Common Edge Cases

1. **Isolated nodes**: Degree = 0
2. **Self-loops**: May count as 1 or 2 depending on implementation
3. **Multiple edges**: Each edge counted separately
4. **Directed graphs**: Consider in-degree vs out-degree

## Tips

- Fastest centrality measure - good for initial analysis
- Use as a filter before expensive algorithms
- High degree ≠ most important (consider betweenness/PageRank)
- Compare in-degree vs out-degree for directed graphs
- Watch for degree distribution (power-law vs normal)
