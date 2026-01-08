---
name: shortest-path
description: Find the shortest path between two nodes in a graph, optionally considering edge weights. Use when the user wants to find paths, routes, connections, distances, or navigation between nodes.
license: Apache-2.0
metadata:
  author: memgraph
  version: "1.0"
  algorithm_type: pathfinding
  complexity: "O(V + E log V)"
---

# Weighted Shortest Path

Find the path between two nodes that minimizes the total weight (or hop count if unweighted). Essential for navigation, routing, and finding optimal connections.

## When to Use This Skill

Use shortest path when:
- Finding the most efficient route between two points
- Calculating distances or costs between nodes
- Navigation and routing problems
- Finding how entities are connected
- Determining degrees of separation

## Basic Usage

### Unweighted Shortest Path (BFS)

```cypher
MATCH p = (a:Person {name: "Alice"})-[*BFS]-(b:Person {name: "Bob"})
RETURN p;
```

### Weighted Shortest Path (Dijkstra)

```cypher
MATCH p = (a:City {name: "New York"})-[*WSHORTEST (r, n | r.distance)]-(b:City {name: "Los Angeles"})
RETURN p, reduce(total = 0, r IN relationships(p) | total + r.distance) AS total_distance;
```

### Using algo Module

```cypher
MATCH (a:Person {name: "Alice"}), (b:Person {name: "Bob"})
CALL algo.dijkstra(a, b, "distance")
YIELD path, weight
RETURN path, weight;
```

## Advanced Usage

### All Shortest Paths (Same Length)

```cypher
MATCH p = allShortestPaths((a:Person {name: "Alice"})-[*]-(b:Person {name: "Bob"}))
RETURN p;
```

### K Shortest Paths

```cypher
MATCH (a:City {name: "NYC"}), (b:City {name: "LA"})
CALL algo.k_shortest_paths(a, b, 5, "distance")
YIELD path, weight
RETURN path, weight
ORDER BY weight ASC;
```

### Shortest Path with Relationship Type Filter

```cypher
MATCH p = (a:Person {name: "Alice"})-[:KNOWS|WORKS_WITH *BFS]-(b:Person {name: "Bob"})
RETURN p, length(p) AS path_length;
```

### Shortest Path with Max Depth

```cypher
MATCH p = (a:Person {name: "Alice"})-[*BFS..5]-(b:Person {name: "Bob"})
RETURN p;
```

## Output Format

| Column | Type | Description |
|--------|------|-------------|
| path | Path | The shortest path as a sequence of nodes and relationships |
| weight | Float | Total path weight (for weighted queries) |

## Example Results

```
Path: (Alice)-[:KNOWS]->(Charlie)-[:KNOWS]->(Bob)
Total Weight: 2.5
```

## Weighted vs Unweighted

| Type | Use When | Syntax |
|------|----------|--------|
| Unweighted | All edges equal | `*BFS` |
| Weighted | Edges have costs | `*WSHORTEST (r, n \| r.cost)` |

## Common Edge Cases

1. **No path exists**: Returns NULL/empty result
2. **Multiple shortest paths**: Use `allShortestPaths` to get all
3. **Negative weights**: Not supported (use appropriate algorithm)
4. **Self-loops**: Source equals target returns empty path
5. **Disconnected nodes**: No path returned

## Tips

- Use `*BFS` for unweighted graphs (faster)
- Use `*WSHORTEST` when edge weights matter
- Specify relationship types to constrain the search
- Add max depth to limit search scope
- Consider using indexes on starting/ending node properties
