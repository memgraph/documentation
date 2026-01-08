---
name: bfs
description: Perform breadth-first search traversal starting from a node, visiting neighbors level by level. Use when exploring graphs layer by layer, finding shortest unweighted paths, or discovering all nodes within a certain distance. 
license: Apache-2.0
metadata:
  author: memgraph
  version: "1.0"
  algorithm_type: traversal
  complexity: "O(V + E)"
---

# Breadth-First Search (BFS)

Traverse a graph starting from a source node, exploring all neighbors at the current depth before moving to nodes at the next depth level. Fundamental for shortest paths in unweighted graphs.

## When to Use This Skill

Use BFS when:
- Finding shortest path in unweighted graph
- Exploring nodes level by level
- Finding all nodes within N hops
- Discovering connected components
- Web crawling or social network exploration

## Basic Usage

### BFS Shortest Path

```cypher
MATCH p = (a:Person {name: "Alice"})-[*BFS]-(b:Person {name: "Bob"})
RETURN p, length(p) AS distance;
```

### BFS with Depth Limit

```cypher
MATCH p = (a:Person {name: "Alice"})-[*BFS..3]-(b)
RETURN b.name AS reachable_node, length(p) AS distance
ORDER BY distance;
```

### BFS with Relationship Filter

```cypher
MATCH p = (a:Person {name: "Alice"})-[:KNOWS|WORKS_WITH *BFS]-(b)
RETURN b, length(p) AS distance;
```

## Advanced Usage

### Find All Nodes at Specific Distance

```cypher
MATCH p = (a:Person {name: "Alice"})-[*BFS]-(b)
WHERE length(p) = 2
RETURN b.name AS two_hops_away;
```

### BFS with Filter Lambda

```cypher
MATCH p = (a:Person {name: "Alice"})-[*BFS (e, n | n.active = true)]-(b)
RETURN b;
```

### Count Nodes by Distance

```cypher
MATCH p = (a:Person {name: "Alice"})-[*BFS..5]-(b)
WHERE a <> b
RETURN length(p) AS distance, count(b) AS nodes_at_distance
ORDER BY distance;
```

### BFS for Finding Shortest Path Length

```cypher
MATCH p = shortestPath((a:Person {name: "Alice"})-[*]-(b:Person {name: "Bob"}))
RETURN length(p) AS shortest_distance;
```

## Output Format

| Column | Type | Description |
|--------|------|-------------|
| path | Path | The BFS path from source |
| node | Node | Discovered node |
| distance | Integer | Number of hops from source |

## BFS vs DFS

| Aspect | BFS | DFS |
|--------|-----|-----|
| Strategy | Level by level | Deep first |
| Shortest path | Yes (unweighted) | No guarantee |
| Memory | O(width) | O(depth) |
| Use case | Shortest paths, nearby nodes | Full exploration, cycles |

## Example Results

```
╔════════════════════╦═══════════════╗
║ reachable_node     ║ distance      ║
╠════════════════════╬═══════════════╣
║ "Bob"              ║ 1             ║
║ "Charlie"          ║ 1             ║
║ "David"            ║ 2             ║
║ "Eve"              ║ 2             ║
║ "Frank"            ║ 3             ║
╚════════════════════╩═══════════════╝
```

## Common Edge Cases

1. **No path exists**: Empty result
2. **Source equals target**: Returns empty path (distance 0)
3. **Cycles**: BFS naturally handles cycles (visits each node once)
4. **Disconnected graph**: Only reaches nodes in same component

## Tips

- Use `*BFS` for guaranteed shortest unweighted path
- Add depth limit (`..N`) to avoid exploring entire graph
- Filter relationship types to constrain traversal
- Use filter lambda for property-based traversal rules
- Consider indexes on starting node properties
