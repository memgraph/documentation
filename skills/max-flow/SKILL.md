---
name: max-flow
description: Calculate the maximum flow between two nodes in a network, determining the maximum amount that can flow from source to sink. Use for network capacity analysis, bandwidth optimization, or resource allocation problems.
license: Apache-2.0
metadata:
  author: memgraph
  version: "1.0"
  algorithm_type: optimization
  complexity: "O(V * E^2)"
---

# Maximum Flow

Find the maximum flow from a source node to a sink node in a flow network, where edges have capacity constraints. Based on the Ford-Fulkerson algorithm.

## When to Use This Skill

Use max flow when:
- Analyzing network bandwidth capacity
- Resource allocation optimization
- Supply chain capacity planning
- Traffic flow analysis
- Bipartite matching problems

## Basic Usage

### Calculate Max Flow

```cypher
MATCH (source:Node {name: "Source"}), (sink:Node {name: "Sink"})
CALL max_flow.get(source, sink, "capacity")
YIELD max_flow
RETURN max_flow;
```

### Max Flow with Default Capacity

```cypher
MATCH (s:Server {name: "Origin"}), (t:Server {name: "Destination"})
CALL max_flow.get(s, t)
YIELD max_flow
RETURN max_flow;
```

## Advanced Usage

### Max Flow with Flow Details

```cypher
MATCH (source:Node {id: 1}), (sink:Node {id: 10})
CALL max_flow.get_flow(source, sink, "capacity")
YIELD edge, flow
RETURN startNode(edge).name AS from, 
       endNode(edge).name AS to, 
       flow,
       edge.capacity AS capacity;
```

### Find Bottleneck Edges

```cypher
MATCH (source:Node {name: "S"}), (sink:Node {name: "T"})
CALL max_flow.get_flow(source, sink, "capacity")
YIELD edge, flow
WHERE flow = edge.capacity
RETURN startNode(edge).name AS from,
       endNode(edge).name AS to,
       flow AS saturated_flow;
```

### Max Flow on Subgraph

```cypher
MATCH (n:NetworkNode)-[r:LINK]->(m:NetworkNode)
WITH collect(DISTINCT n) + collect(DISTINCT m) AS nodes, collect(r) AS edges
MATCH (source:NetworkNode {type: "source"}), (sink:NetworkNode {type: "sink"})
CALL max_flow.get_subgraph(nodes, edges, source, sink, "bandwidth")
YIELD max_flow
RETURN max_flow;
```

### Multi-Source Multi-Sink (Using Super Nodes)

```cypher
// Create super source connected to all sources
// Create super sink connected from all sinks
// Then run max flow between super nodes
MATCH (source:Source), (sink:Sink)
WITH collect(source) AS sources, collect(sink) AS sinks
// Add super source/sink logic here
CALL max_flow.get(super_source, super_sink, "capacity")
YIELD max_flow
RETURN max_flow;
```

## Output Format

| Column | Type | Description |
|--------|------|-------------|
| max_flow | Float | Maximum flow value achievable |
| edge | Relationship | Edge in the flow network (for detailed version) |
| flow | Float | Flow through the edge |

## Example Results

```
╔══════════════════╗
║ max_flow         ║
╠══════════════════╣
║ 23.5             ║
╚══════════════════╝

╔════════════╦════════════╦═══════╦══════════╗
║ from       ║ to         ║ flow  ║ capacity ║
╠════════════╬════════════╬═══════╬══════════╣
║ "A"        ║ "B"        ║ 10.0  ║ 10.0     ║
║ "A"        ║ "C"        ║ 13.5  ║ 15.0     ║
║ "B"        ║ "D"        ║ 10.0  ║ 12.0     ║
╚════════════╩════════════╩═══════╩══════════╝
```

## Common Edge Cases

1. **No path exists**: Max flow = 0
2. **Source = Sink**: Max flow = 0 or infinity
3. **Negative capacities**: Not supported
4. **Zero capacity edges**: Ignored in flow
5. **Disconnected network**: Max flow = 0

## Applications

| Domain | Source | Sink | Capacity |
|--------|--------|------|----------|
| Network | Server | Client | Bandwidth |
| Supply chain | Warehouse | Store | Transport capacity |
| Traffic | Origin | Destination | Road capacity |
| Scheduling | Start | End | Time slots |

## Tips

- Ensure all edges have valid capacity property
- Saturated edges (flow = capacity) are bottlenecks
- Increase bottleneck capacities to increase max flow
- Use for min-cut problems (max-flow = min-cut)
- Consider directed vs undirected capacity constraints
