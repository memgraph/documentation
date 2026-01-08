---
name: weakly-connected-components
description: Find weakly connected components in a graph - groups of nodes where each node can reach every other node in the group, ignoring edge direction. Use when the user wants to find connected groups, isolated subgraphs, or check graph connectivity.
license: Apache-2.0
metadata:
  author: memgraph
  version: "1.0"
  algorithm_type: connectivity
  complexity: "O(V + E)"
---

# Weakly Connected Components

Find groups of nodes where there exists a path between any two nodes in the group (ignoring edge direction). Essential for understanding graph structure and finding isolated subgraphs.

## When to Use This Skill

Use weakly connected components when:
- Finding separate groups or clusters in a graph
- Checking if a graph is fully connected
- Identifying isolated nodes or subgraphs
- Preprocessing before other algorithms
- Analyzing network fragmentation

## Basic Usage

### Find All Components

```cypher
CALL weakly_connected_components.get()
YIELD node, component_id
RETURN node, component_id
ORDER BY component_id;
```

### Count Components

```cypher
CALL weakly_connected_components.get()
YIELD node, component_id
RETURN count(DISTINCT component_id) AS num_components;
```

### Get Component Sizes

```cypher
CALL weakly_connected_components.get()
YIELD node, component_id
RETURN component_id, count(node) AS size
ORDER BY size DESC;
```

## Advanced Usage

### Find Largest Component

```cypher
CALL weakly_connected_components.get()
YIELD node, component_id
WITH component_id, collect(node) AS nodes, count(*) AS size
ORDER BY size DESC
LIMIT 1
UNWIND nodes AS node
RETURN node, component_id;
```

### Find Isolated Nodes (Components of Size 1)

```cypher
CALL weakly_connected_components.get()
YIELD node, component_id
WITH component_id, collect(node) AS nodes
WHERE size(nodes) = 1
UNWIND nodes AS isolated_node
RETURN isolated_node;
```

### Components on Subgraph

```cypher
MATCH (n:Person)-[r:KNOWS]->(m:Person)
WITH collect(n) + collect(m) AS nodes, collect(r) AS rels
CALL weakly_connected_components.get_subgraph(nodes, rels)
YIELD node, component_id
RETURN node.name AS name, component_id
ORDER BY component_id;
```

### Check If Graph Is Connected

```cypher
CALL weakly_connected_components.get()
YIELD node, component_id
WITH count(DISTINCT component_id) AS num_components
RETURN CASE WHEN num_components = 1 THEN "Connected" ELSE "Disconnected" END AS status;
```

## Output Format

| Column | Type | Description |
|--------|------|-------------|
| node | Node | The graph node |
| component_id | Integer | Component identifier (same ID = same component) |

## Example Results

```
╔════════════════════╦═══════════════╗
║ name               ║ component_id  ║
╠════════════════════╬═══════════════╣
║ "Alice"            ║ 0             ║
║ "Bob"              ║ 0             ║
║ "Charlie"          ║ 0             ║
║ "David"            ║ 1             ║
║ "Eve"              ║ 1             ║
╚════════════════════╩═══════════════╝
```

## Common Edge Cases

1. **Empty graph**: No components returned
2. **Single node**: Forms its own component
3. **Fully connected**: One component containing all nodes
4. **Directed edges**: Direction is ignored (weakly connected)

## Tips

- Use before other algorithms to analyze components separately
- Component IDs are arbitrary - only equality matters
- For directed connectivity, use strongly connected components
- Useful for data quality checks (unexpected disconnected parts)
- Consider visualizing small components to understand fragmentation
