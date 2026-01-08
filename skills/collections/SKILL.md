---
name: collections
description: Utility functions for manipulating lists and collections in Cypher queries, including filtering, sorting, union, intersection, and other list operations. Use when you need to work with arrays, combine lists, or perform set operations on collections.
license: Apache-2.0
metadata:
  author: memgraph
  version: "1.0"
  algorithm_type: utility
  complexity: "O(n)"
---

# Collections Utilities

A comprehensive set of functions for manipulating lists and collections in Cypher queries. Essential for data transformation and list operations.

## When to Use This Skill

Use collections utilities when:
- Combining or intersecting lists
- Removing duplicates from lists
- Filtering or transforming collections
- Performing set operations (union, difference)
- Partitioning or chunking data

## Basic Functions

### Union (Remove Duplicates)

```cypher
WITH [1, 2, 3] AS list1, [2, 3, 4, 5] AS list2
CALL collections.union(list1, list2)
YIELD result
RETURN result;
// Result: [1, 2, 3, 4, 5]
```

### Union All (Keep Duplicates)

```cypher
WITH [1, 2, 3] AS list1, [2, 3, 4] AS list2
CALL collections.union_all(list1, list2)
YIELD result
RETURN result;
// Result: [1, 2, 3, 2, 3, 4]
```

### Remove All

```cypher
WITH [1, 2, 3, 4, 5] AS original, [2, 4] AS to_remove
CALL collections.remove_all(original, to_remove)
YIELD result
RETURN result;
// Result: [1, 3, 5]
```

### Contains

```cypher
WITH [1, 2, 3, 4, 5] AS list
CALL collections.contains(list, 3)
YIELD result
RETURN result;
// Result: true
```

## Advanced Functions

### Flatten Nested Lists

```cypher
WITH [[1, 2], [3, 4], [5]] AS nested
CALL collections.flatten(nested)
YIELD result
RETURN result;
// Result: [1, 2, 3, 4, 5]
```

### Frequency Map

```cypher
WITH ["a", "b", "a", "c", "b", "a"] AS items
CALL collections.frequencies_as_map(items)
YIELD result
RETURN result;
// Result: {a: 3, b: 2, c: 1}
```

### Create Pairs

```cypher
WITH [1, 2, 3, 4] AS list
CALL collections.pairs(list)
YIELD result
RETURN result;
// Result: [[1,2], [2,3], [3,4]]
```

### To Set (Remove Duplicates)

```cypher
WITH [1, 2, 2, 3, 3, 3] AS list
CALL collections.to_set(list)
YIELD result
RETURN result;
// Result: [1, 2, 3]
```

### Sum

```cypher
WITH [1, 2, 3, 4, 5] AS numbers
CALL collections.sum(numbers)
YIELD result
RETURN result;
// Result: 15
```

### Partition (Chunk)

```cypher
WITH [1, 2, 3, 4, 5, 6, 7] AS list
CALL collections.partition(list, 3)
YIELD result
RETURN result;
// Result: [[1,2,3], [4,5,6], [7]]
```

## Practical Examples

### Combine Node Properties from Multiple Queries

```cypher
MATCH (p:Person)-[:KNOWS]->(friend)
WITH p, collect(friend.name) AS friends
MATCH (p)-[:WORKS_WITH]->(colleague)
WITH p, friends, collect(colleague.name) AS colleagues
CALL collections.union(friends, colleagues)
YIELD result AS all_connections
RETURN p.name, all_connections;
```

### Find Common Interests

```cypher
MATCH (a:Person {name: "Alice"})-[:LIKES]->(item)
WITH collect(item.name) AS alice_likes
MATCH (b:Person {name: "Bob"})-[:LIKES]->(item)
WITH alice_likes, collect(item.name) AS bob_likes
WITH [x IN alice_likes WHERE x IN bob_likes] AS common
RETURN common AS shared_interests;
```

### Batch Processing with Partition

```cypher
MATCH (n:Node)
WITH collect(n) AS all_nodes
CALL collections.partition(all_nodes, 100)
YIELD result AS batch
// Process each batch
RETURN size(batch) AS batch_size;
```

## Output Format

| Function | Return Type | Description |
|----------|-------------|-------------|
| union | List | Combined list without duplicates |
| union_all | List | Combined list with duplicates |
| remove_all | List | List with elements removed |
| contains | Boolean | Whether element exists |
| flatten | List | Flattened nested list |
| frequencies_as_map | Map | Count of each element |
| pairs | List of Lists | Adjacent pairs |
| to_set | List | Deduplicated list |
| sum | Number | Sum of numeric elements |
| partition | List of Lists | Chunked list |

## Tips

- Use `to_set` before comparisons for better performance
- `partition` is useful for batch processing large lists
- `frequencies_as_map` great for distribution analysis
- Combine functions for complex transformations
- Most functions preserve order where meaningful
