---
name: cycles
description: Detect cycles in a graph - paths that start and end at the same node. Use when checking for circular dependencies, finding loops, validating acyclic structures, or detecting circular references.
license: Apache-2.0
metadata:
  author: memgraph
  version: "1.0"
  algorithm_type: structure
  complexity: "O(V + E)"
---

# Cycle Detection

Detect cycles (circular paths) in a graph. A cycle is a path where you can start from a node and return to the same node by following edges.

## When to Use This Skill

Use cycle detection when:
- Checking for circular dependencies
- Validating DAG (directed acyclic graph) property
- Finding loops in workflows or processes
- Detecting circular references in data
- Analyzing feedback loops in systems

## Basic Usage

### Find All Cycles

```cypher
CALL cycles.get()
YIELD cycle
RETURN cycle;
```

### Check if Graph Has Cycles

```cypher
CALL cycles.get()
YIELD cycle
RETURN count(cycle) > 0 AS has_cycles;
```

## Advanced Usage

### Cycles Starting from Specific Node

```cypher
MATCH (start:Task {name: "Task A"})
CALL cycles.get(start)
YIELD cycle
RETURN cycle;
```

### Find Cycle Lengths

```cypher
CALL cycles.get()
YIELD cycle
RETURN size(cycle) AS cycle_length, count(*) AS count
ORDER BY cycle_length;
```

### Manual Cycle Detection for Small Graphs

```cypher
MATCH path = (n)-[*]->(n)
RETURN path, length(path) AS cycle_length
ORDER BY cycle_length
LIMIT 10;
```

### Detect Self-Loops

```cypher
MATCH (n)-[r]->(n)
RETURN n, r;
```

### Find Shortest Cycle Through a Node

```cypher
MATCH (target:Node {id: 1})
MATCH path = (target)-[*]->(target)
RETURN path, length(path) AS cycle_length
ORDER BY cycle_length
LIMIT 1;
```

## Output Format

| Column | Type | Description |
|--------|------|-------------|
| cycle | List | List of nodes forming the cycle |

## Example Results

```
╔═══════════════════════════════════════════════════╗
║ cycle                                             ║
╠═══════════════════════════════════════════════════╣
║ [Task_A, Task_B, Task_C, Task_A]                  ║
║ [Process_1, Process_2, Process_1]                 ║
╚═══════════════════════════════════════════════════╝
```

## Common Edge Cases

1. **Self-loops**: Cycles of length 1 (node to itself)
2. **Acyclic graph**: No cycles returned
3. **Multiple cycles sharing nodes**: Each cycle reported separately
4. **Undirected graphs**: Consider both directions

## Use Cases by Domain

| Domain | Cycle Meaning |
|--------|---------------|
| Dependencies | Circular dependency (error) |
| Workflows | Infinite loop (usually error) |
| Social networks | Mutual connections |
| Financial | Round-tripping transactions |
| Biology | Feedback mechanisms |

## Tips

- Self-loops are the simplest cycles
- Cycles in dependency graphs usually indicate errors
- Consider if you need directed or undirected cycle detection
- For very large graphs, limit cycle length in search
- Visualize cycles to understand their structure
