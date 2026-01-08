---
name: tsp
description: Solve the Traveling Salesman Problem to find the shortest route that visits each node exactly once and returns to the starting point. Use when optimizing routes, planning visits, or finding optimal tours through locations.
license: Apache-2.0
metadata:
  author: memgraph
  version: "1.0"
  algorithm_type: optimization
  complexity: "O(n!)"
---

# Traveling Salesman Problem (TSP)

Find the shortest possible route that visits each node exactly once and returns to the origin. A classic optimization problem useful for route planning and logistics.

## When to Use This Skill

Use TSP when:
- Planning delivery or visit routes
- Optimizing travel itineraries
- Circuit board drilling sequences
- DNA sequencing optimization
- Any shortest tour problem

## Basic Usage

### Solve TSP

```cypher
MATCH (n:City)
WITH collect(n) AS cities
CALL tsp.solve(cities)
YIELD path, total_weight
RETURN path, total_weight;
```

### TSP with Specific Start

```cypher
MATCH (start:City {name: "New York"})
MATCH (other:City)
WHERE other <> start
WITH start, collect(other) AS cities
CALL tsp.solve(cities, start)
YIELD path, total_weight
RETURN path, total_weight;
```

## Advanced Usage

### TSP with Custom Distance Property

```cypher
MATCH (n:Location)
WITH collect(n) AS locations
CALL tsp.solve(locations, "distance")
YIELD path, total_weight
RETURN path, total_weight;
```

### TSP on Subgraph

```cypher
MATCH (n:Warehouse)-[r:CONNECTED_TO]-(m:Warehouse)
WITH collect(DISTINCT n) AS warehouses
CALL tsp.solve(warehouses)
YIELD path, total_weight
RETURN [node IN nodes(path) | node.name] AS route, total_weight AS total_distance;
```

### Visualize TSP Route

```cypher
CALL tsp.solve(nodes)
YIELD path
UNWIND range(0, size(nodes(path))-2) AS i
WITH nodes(path)[i] AS from, nodes(path)[i+1] AS to
RETURN from.name AS from_city, to.name AS to_city;
```

## Output Format

| Column | Type | Description |
|--------|------|-------------|
| path | Path | The optimal tour as a path |
| total_weight | Float | Total distance/weight of the tour |

## Example Results

```
Route: New York → Boston → Philadelphia → Washington → New York
Total Distance: 892.5 km
```

## Common Edge Cases

1. **Less than 3 nodes**: Returns trivial solution
2. **Disconnected nodes**: May not find valid tour
3. **Large graphs**: Exponential complexity - use approximations
4. **Missing distances**: Uses default or Euclidean distance

## Tips

- TSP is NP-hard - exact solutions are slow for large graphs
- For >15-20 nodes, consider approximation algorithms
- Ensure all nodes are connected (directly or indirectly)
- Pre-compute distances for better performance
- For real-world routing, consider using VRP instead
