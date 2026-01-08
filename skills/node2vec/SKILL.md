---
name: node2vec
description: Generate node embeddings using the Node2Vec algorithm, which learns vector representations of nodes based on random walks. Use when you need node features for machine learning, similarity calculations, or visualization.
license: Apache-2.0
metadata:
  author: memgraph
  version: "1.0"
  algorithm_type: ml
  complexity: "O(V * E)"
---

# Node2Vec - Node Embeddings

Node2Vec learns continuous feature representations (embeddings) for nodes in a graph using random walks. These embeddings capture structural information and can be used for machine learning tasks.

## When to Use This Skill

Use Node2Vec when:
- Creating features for node classification
- Generating embeddings for similarity search
- Preparing data for machine learning
- Visualizing graph structure in lower dimensions
- Link prediction tasks

## Basic Usage

### Generate Node Embeddings

```cypher
CALL node2vec.get()
YIELD node, embedding
RETURN node, embedding
LIMIT 10;
```

### Node2Vec with Parameters

```cypher
CALL node2vec.get(128, 10, 80, 1.0, 1.0)
YIELD node, embedding
RETURN node, embedding;
```

**Parameters:**
- `dimensions` (default: 128) - Embedding vector size
- `walk_length` (default: 10) - Length of random walks
- `num_walks` (default: 80) - Number of walks per node
- `p` (default: 1.0) - Return parameter (controls revisiting)
- `q` (default: 1.0) - In-out parameter (BFS vs DFS tendency)

## Advanced Usage

### Store Embeddings on Nodes

```cypher
CALL node2vec.get()
YIELD node, embedding
SET node.embedding = embedding
RETURN count(*) AS nodes_updated;
```

### Find Similar Nodes Using Embeddings

```cypher
// First generate embeddings
CALL node2vec.get() YIELD node, embedding
WITH node, embedding
SET node.embedding = embedding;

// Then find similar nodes
MATCH (target:Person {name: "Alice"})
MATCH (other:Person)
WHERE other <> target
WITH target, other, 
     gds.similarity.cosine(target.embedding, other.embedding) AS similarity
RETURN other.name, similarity
ORDER BY similarity DESC
LIMIT 5;
```

### Node2Vec on Subgraph

```cypher
MATCH (n:User)-[r:FOLLOWS]->(m:User)
WITH collect(DISTINCT n) + collect(DISTINCT m) AS nodes, collect(r) AS rels
CALL node2vec.get_subgraph(nodes, rels, 64)
YIELD node, embedding
RETURN node.name AS user, embedding;
```

### Visualize Embeddings (Export for t-SNE/UMAP)

```cypher
CALL node2vec.get(2)
YIELD node, embedding
RETURN node.name AS name, embedding[0] AS x, embedding[1] AS y;
```

## Parameter Tuning

| Parameter | Low Value | High Value |
|-----------|-----------|------------|
| p (return) | Explores locally (DFS-like) | Explores broadly (BFS-like) |
| q (in-out) | Explores outward | Explores inward |
| dimensions | Faster, less expressive | Slower, more expressive |
| walk_length | Local context | Global context |
| num_walks | Noisier embeddings | Smoother embeddings |

## Output Format

| Column | Type | Description |
|--------|------|-------------|
| node | Node | The graph node |
| embedding | List[Float] | Vector embedding of specified dimension |

## Example Results

```
╔════════════════════╦══════════════════════════════════════════╗
║ node               ║ embedding                                ║
╠════════════════════╬══════════════════════════════════════════╣
║ Person(Alice)      ║ [0.123, -0.456, 0.789, ...]             ║
║ Person(Bob)        ║ [0.234, -0.567, 0.891, ...]             ║
╚════════════════════╩══════════════════════════════════════════╝
```

## Common Edge Cases

1. **Isolated nodes**: Will have random/default embeddings
2. **Small graphs**: May not need high dimensions
3. **Dense graphs**: Lower q values work better
4. **Sparse graphs**: Higher p values work better

## Tips

- Start with default parameters, then tune
- Use p=1, q=1 for neutral exploration (like DeepWalk)
- p<1, q>1 for homophily (similar nodes cluster)
- p>1, q<1 for structural equivalence
- Store embeddings as node properties for reuse
- Retrain when graph structure changes significantly
