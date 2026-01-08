---
name: node-similarity
description: Calculate similarity between nodes based on their connections, properties, or embeddings. Use when the user wants to find similar nodes, recommendations, related entities, or measure node closeness.
license: Apache-2.0
metadata:
  author: memgraph
  version: "1.0"
  algorithm_type: similarity
  complexity: "O(V^2) or O(E)"
---

# Node Similarity

Calculate how similar two nodes are based on their neighborhood structure, shared connections, or properties. Useful for recommendations, duplicate detection, and finding related entities.

## When to Use This Skill

Use node similarity when:
- Finding similar nodes for recommendations
- Detecting potential duplicates
- Discovering related entities
- Building recommendation systems
- Comparing node neighborhoods

## Basic Usage

### Jaccard Similarity

```cypher
MATCH (a:Person {name: "Alice"}), (b:Person {name: "Bob"})
CALL node_similarity.jaccard(a, b)
YIELD similarity
RETURN similarity;
```

### Overlap Coefficient

```cypher
MATCH (a:Person {name: "Alice"}), (b:Person {name: "Bob"})
CALL node_similarity.overlap(a, b)
YIELD similarity
RETURN similarity;
```

### Cosine Similarity

```cypher
MATCH (a:Person {name: "Alice"}), (b:Person {name: "Bob"})
CALL node_similarity.cosine(a, b)
YIELD similarity
RETURN similarity;
```

## Advanced Usage

### Find Most Similar Nodes

```cypher
MATCH (target:Person {name: "Alice"})
MATCH (other:Person)
WHERE other <> target
CALL node_similarity.jaccard(target, other)
YIELD similarity
RETURN other.name AS person, similarity
ORDER BY similarity DESC
LIMIT 5;
```

### Similarity Based on Specific Relationship

```cypher
MATCH (a:Person {name: "Alice"})-[:LIKES]->(item1)
MATCH (b:Person {name: "Bob"})-[:LIKES]->(item2)
WITH a, b, collect(DISTINCT item1) AS items_a, collect(DISTINCT item2) AS items_b
WITH a, b, 
     [x IN items_a WHERE x IN items_b] AS intersection,
     items_a + [x IN items_b WHERE NOT x IN items_a] AS union_set
RETURN a.name, b.name, 
       toFloat(size(intersection)) / size(union_set) AS jaccard_similarity;
```

### Pairwise Similarity for All Nodes

```cypher
MATCH (a:Product), (b:Product)
WHERE id(a) < id(b)
CALL node_similarity.jaccard(a, b)
YIELD similarity
WHERE similarity > 0.5
RETURN a.name, b.name, similarity
ORDER BY similarity DESC;
```

## Similarity Measures Explained

| Measure | Formula | Best For |
|---------|---------|----------|
| Jaccard | \|A ∩ B\| / \|A ∪ B\| | General similarity |
| Overlap | \|A ∩ B\| / min(\|A\|, \|B\|) | Subset detection |
| Cosine | A · B / (\|A\| * \|B\|) | Normalized comparison |

## Output Format

| Column | Type | Description |
|--------|------|-------------|
| similarity | Float | Similarity score between 0 and 1 |

## Example Results

```
╔════════════════════╦═══════════════╗
║ person             ║ similarity    ║
╠════════════════════╬═══════════════╣
║ "Charlie"          ║ 0.857         ║
║ "David"            ║ 0.714         ║
║ "Eve"              ║ 0.625         ║
╚════════════════════╩═══════════════╝
```

## Common Edge Cases

1. **No common neighbors**: Similarity = 0
2. **Identical neighborhoods**: Similarity = 1
3. **Isolated nodes**: Similarity = 0 (no neighbors to compare)
4. **Self-similarity**: Always = 1

## Tips

- Jaccard is most commonly used for general similarity
- Use Overlap when one set may be a subset of another
- For large graphs, filter candidates first before computing similarity
- Consider the relationship types that define "neighbors"
- Combine with property-based similarity for better results
