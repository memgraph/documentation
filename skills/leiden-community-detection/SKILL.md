---
name: leiden-community-detection
description: Detect communities using the Leiden algorithm, an improved version of Louvain that guarantees well-connected communities. Use when finding communities, clusters, or groups in large graphs with better quality guarantees than basic community detection.
license: Apache-2.0
metadata:
  author: memgraph
  version: "1.0"
  algorithm_type: community
  complexity: "O(L * E)"
---

# Leiden Community Detection

The Leiden algorithm is an improvement over the Louvain method for community detection. It guarantees that all communities are well-connected and avoids the problem of poorly connected or disconnected communities that can occur with Louvain.

## When to Use This Skill

Use Leiden community detection when:
- Quality of community structure is important
- Working with large graphs
- Louvain produces fragmented communities
- Need guaranteed well-connected communities
- Analyzing complex network structures

## Basic Usage

### Detect Communities

```cypher
CALL leiden_community_detection.get()
YIELD node, community_id
RETURN node, community_id
ORDER BY community_id;
```

### Community Statistics

```cypher
CALL leiden_community_detection.get()
YIELD node, community_id
RETURN community_id, count(node) AS size
ORDER BY size DESC;
```

## Advanced Usage

### With Custom Parameters

```cypher
CALL leiden_community_detection.get(1.0, 0.01, True)
YIELD node, community_id
RETURN node, community_id;
```

**Parameters:**
- `resolution` (default: 1.0) - Higher values produce more, smaller communities
- `beta` (default: 0.01) - Randomness parameter for refinement phase
- `weighted` (default: False) - Use edge weights

### Leiden on Subgraph

```cypher
MATCH (n:User)-[r:FOLLOWS]->(m:User)
WITH collect(DISTINCT n) + collect(DISTINCT m) AS nodes, collect(r) AS rels
CALL leiden_community_detection.get_subgraph(nodes, rels)
YIELD node, community_id
RETURN node.name AS name, community_id
ORDER BY community_id;
```

### Community Members with Labels

```cypher
CALL leiden_community_detection.get()
YIELD node, community_id
WITH community_id, collect(node.name) AS members
RETURN community_id, members, size(members) AS size
ORDER BY size DESC
LIMIT 10;
```

### Resolution Parameter Comparison

```cypher
// Higher resolution - more communities
CALL leiden_community_detection.get(2.0)
YIELD node, community_id
RETURN "resolution=2.0" AS config, count(DISTINCT community_id) AS num_communities
UNION
// Lower resolution - fewer communities
CALL leiden_community_detection.get(0.5)
YIELD node, community_id
RETURN "resolution=0.5" AS config, count(DISTINCT community_id) AS num_communities;
```

## Output Format

| Column | Type | Description |
|--------|------|-------------|
| node | Node | The graph node |
| community_id | Integer | Community identifier |

## Leiden vs Louvain

| Aspect | Louvain | Leiden |
|--------|---------|--------|
| Speed | Faster | Slightly slower |
| Quality | Good | Better (guaranteed connectivity) |
| Disconnected communities | Possible | Never |
| Use case | Quick analysis | Quality-critical analysis |

## Example Results

```
╔════════════════════╦═══════════════╗
║ name               ║ community_id  ║
╠════════════════════╬═══════════════╣
║ "Alice"            ║ 0             ║
║ "Bob"              ║ 0             ║
║ "Charlie"          ║ 1             ║
║ "David"            ║ 1             ║
║ "Eve"              ║ 2             ║
╚════════════════════╩═══════════════╝
```

## Common Edge Cases

1. **Single node**: Forms its own community
2. **Disconnected graph**: Each component analyzed separately
3. **Complete graph**: May form one large community
4. **Very sparse graph**: Many small communities

## Tips

- Start with default parameters, then adjust resolution
- Use Leiden over Louvain when community quality matters
- For very large graphs, consider sampling first
- Compare results at multiple resolution values
- Visualize communities to validate results
