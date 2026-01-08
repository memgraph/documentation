---
name: graph-analyzer
description: Analyze graph structure and calculate statistics like node count, edge count, density, average degree, and other metrics. Use when the user wants to understand graph properties, get statistics, profile the database, or explore the graph structure.
license: Apache-2.0
metadata:
  author: memgraph
  version: "1.0"
  algorithm_type: utility
  complexity: "O(V + E)"
---

# Graph Analyzer

Analyze the structure of a graph and compute various statistics. Essential for understanding data characteristics and profiling graph databases.

## When to Use This Skill

Use graph analyzer when:
- Understanding the overall structure of a graph
- Getting basic statistics (counts, density, degrees)
- Profiling a database before running algorithms
- Comparing graph characteristics over time
- Identifying potential data quality issues

## Basic Usage

### Full Graph Analysis

```cypher
CALL graph_analyzer.analyze()
YIELD name, value
RETURN name, value;
```

### Get Specific Metrics

```cypher
CALL graph_analyzer.analyze()
YIELD name, value
WHERE name IN ["node_count", "edge_count", "density"]
RETURN name, value;
```

## Available Metrics

| Metric | Description |
|--------|-------------|
| `node_count` | Total number of nodes |
| `edge_count` | Total number of edges |
| `density` | Graph density (edges / possible edges) |
| `avg_degree` | Average node degree |
| `max_in_degree` | Maximum incoming degree |
| `max_out_degree` | Maximum outgoing degree |
| `self_loops` | Number of self-loop edges |
| `is_directed` | Whether the graph is directed |
| `is_dag` | Whether the graph is a directed acyclic graph |

## Advanced Usage

### Analyze Subgraph by Label

```cypher
MATCH (n:Person)-[r:KNOWS]->(m:Person)
WITH collect(DISTINCT n) + collect(DISTINCT m) AS nodes, collect(r) AS rels
CALL graph_analyzer.analyze_subgraph(nodes, rels)
YIELD name, value
RETURN name, value;
```

### Compare Label Statistics

```cypher
MATCH (n)
WITH labels(n)[0] AS label, count(*) AS count
RETURN label, count
ORDER BY count DESC;
```

### Degree Distribution

```cypher
MATCH (n)
WITH n, size((n)--()) AS degree
RETURN degree, count(*) AS frequency
ORDER BY degree;
```

### Relationship Type Distribution

```cypher
MATCH ()-[r]->()
RETURN type(r) AS relationship_type, count(*) AS count
ORDER BY count DESC;
```

## Output Format

| Column | Type | Description |
|--------|------|-------------|
| name | String | Metric name |
| value | Any | Metric value (number, boolean, or string) |

## Example Results

```
╔════════════════════╦═══════════════╗
║ name               ║ value         ║
╠════════════════════╬═══════════════╣
║ "node_count"       ║ 1000          ║
║ "edge_count"       ║ 5000          ║
║ "density"          ║ 0.005         ║
║ "avg_degree"       ║ 10.0          ║
║ "max_in_degree"    ║ 150           ║
║ "max_out_degree"   ║ 89            ║
╚════════════════════╩═══════════════╝
```

## Common Edge Cases

1. **Empty graph**: Returns zeros for counts
2. **No edges**: Edge count = 0, density = 0
3. **Single node**: Degree = 0

## Tips

- Run analysis before choosing algorithms
- Low density graphs may need different approaches than dense ones
- High max degree nodes may be worth investigating
- Use as a sanity check after data import
- Compare metrics before and after data modifications
