---
name: bridges
description: Find bridge edges in a graph - edges whose removal would disconnect the graph or increase the number of connected components. Use when identifying critical connections, finding vulnerabilities, or analyzing network resilience.
license: Apache-2.0
metadata:
  author: memgraph
  version: "1.0"
  algorithm_type: structure
  complexity: "O(V + E)"
---

# Bridge Detection

Find bridge edges - edges that are critical for maintaining graph connectivity. Removing a bridge edge increases the number of connected components.

## When to Use This Skill

Use bridge detection when:
- Identifying critical infrastructure connections
- Finding single points of failure
- Analyzing network resilience
- Understanding graph vulnerabilities
- Planning redundancy in networks

## Basic Usage

### Find All Bridges

```cypher
CALL bridges.get()
YIELD node1, node2
RETURN node1, node2;
```

### Count Bridges

```cypher
CALL bridges.get()
YIELD node1, node2
RETURN count(*) AS bridge_count;
```

## Advanced Usage

### Bridges with Full Edge Information

```cypher
CALL bridges.get()
YIELD node1, node2
MATCH (n1)-[r]-(n2)
WHERE id(n1) = id(node1) AND id(n2) = id(node2)
RETURN n1, r, n2;
```

### Find Nodes Connected Only by Bridges

```cypher
CALL bridges.get()
YIELD node1, node2
WITH collect(node1) + collect(node2) AS bridge_nodes
UNWIND bridge_nodes AS node
RETURN DISTINCT node.name AS vulnerable_node;
```

### Check if Specific Edge is a Bridge

```cypher
MATCH (a:Router {name: "R1"})-[r]-(b:Router {name: "R2"})
CALL bridges.get()
YIELD node1, node2
WITH a, b, collect([id(node1), id(node2)]) AS bridges
RETURN [id(a), id(b)] IN bridges OR [id(b), id(a)] IN bridges AS is_bridge;
```

### Bridges by Relationship Type

```cypher
CALL bridges.get()
YIELD node1, node2
MATCH (node1)-[r]-(node2)
RETURN type(r) AS relationship_type, count(*) AS bridge_count;
```

## Output Format

| Column | Type | Description |
|--------|------|-------------|
| node1 | Node | First endpoint of bridge edge |
| node2 | Node | Second endpoint of bridge edge |

## Example Results

```
╔═══════════════════╦═══════════════════╗
║ node1             ║ node2             ║
╠═══════════════════╬═══════════════════╣
║ Router_A          ║ Router_B          ║
║ Switch_1          ║ Switch_2          ║
╚═══════════════════╩═══════════════════╝
```

## Common Edge Cases

1. **Tree structures**: All edges are bridges
2. **Complete graphs**: No bridges (highly redundant)
3. **Cycles**: Edges in cycles are not bridges
4. **Single edge graphs**: The edge is a bridge

## Interpretation

| Bridge Count | Graph Characteristic |
|--------------|---------------------|
| 0 | Highly resilient, no single points of failure |
| Low | Good redundancy |
| High | Vulnerable to disconnection |
| All edges | Tree-like structure (fragile) |

## Tips

- Bridges indicate potential vulnerabilities
- Add redundant connections to eliminate bridges
- In network design, minimize bridges for reliability
- Bridges often connect different communities
- Combine with biconnected components analysis
