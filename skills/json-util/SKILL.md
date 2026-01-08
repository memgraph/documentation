---
name: json-util
description: Import and export JSON data to and from the graph database. Use when loading JSON files, converting graph data to JSON, or integrating with JSON-based APIs and systems.
license: Apache-2.0
metadata:
  author: memgraph
  version: "1.0"
  algorithm_type: utility
  complexity: "O(n)"
---

# JSON Utilities

Functions for importing JSON data into the graph and exporting graph data as JSON. Essential for data integration and external system connectivity.

## When to Use This Skill

Use JSON utilities when:
- Loading data from JSON files
- Exporting query results as JSON
- Integrating with REST APIs
- Converting between formats
- Parsing JSON strings in queries

## Basic Usage

### Parse JSON String

```cypher
WITH '{"name": "Alice", "age": 30}' AS json_string
CALL json_util.from_json(json_string)
YIELD result
RETURN result;
```

### Convert to JSON

```cypher
MATCH (p:Person)
WITH collect({name: p.name, age: p.age}) AS people
CALL json_util.to_json(people)
YIELD result
RETURN result;
```

### Load JSON from URL

```cypher
CALL json_util.load_from_url("https://api.example.com/data.json")
YIELD data
UNWIND data AS item
CREATE (n:Item)
SET n = item
RETURN count(n);
```

## Advanced Usage

### Load JSON File and Create Nodes

```cypher
CALL json_util.load_from_path("/path/to/data.json")
YIELD data
UNWIND data.users AS user
CREATE (p:Person {
    name: user.name,
    email: user.email,
    age: user.age
})
RETURN count(p) AS created;
```

### Parse JSON Array

```cypher
WITH '[{"id": 1}, {"id": 2}, {"id": 3}]' AS json_array
CALL json_util.from_json_list(json_array)
YIELD result
UNWIND result AS item
RETURN item.id;
```

### Export Graph to JSON

```cypher
MATCH (p:Person)-[r:KNOWS]->(friend:Person)
WITH {
    person: p.name,
    friends: collect(friend.name)
} AS data
CALL json_util.to_json(data)
YIELD result
RETURN result;
```

### Nested JSON Processing

```cypher
WITH '{"user": {"name": "Alice", "address": {"city": "NYC"}}}' AS nested_json
CALL json_util.from_json(nested_json)
YIELD result
RETURN result.user.name AS name, result.user.address.city AS city;
```

### Create Graph from JSON with Relationships

```cypher
CALL json_util.load_from_path("/data/social.json")
YIELD data
UNWIND data.users AS user
MERGE (p:Person {id: user.id})
SET p.name = user.name
WITH p, user
UNWIND user.friends AS friend_id
MATCH (friend:Person {id: friend_id})
MERGE (p)-[:KNOWS]->(friend)
RETURN count(*);
```

## Output Format

| Function | Input | Output |
|----------|-------|--------|
| from_json | JSON string | Map/List |
| from_json_list | JSON array string | List |
| to_json | Any value | JSON string |
| load_from_url | URL | Parsed JSON |
| load_from_path | File path | Parsed JSON |

## Example Results

### Parsing
```
Input: '{"name": "Alice", "age": 30}'
Output: {name: "Alice", age: 30}
```

### Exporting
```
Input: {name: "Alice", friends: ["Bob", "Charlie"]}
Output: '{"name":"Alice","friends":["Bob","Charlie"]}'
```

## Common Edge Cases

1. **Invalid JSON**: Throws parsing error
2. **Empty JSON**: Returns empty map/list
3. **Large files**: May impact memory
4. **Network errors**: URL loading may fail
5. **Encoding**: UTF-8 assumed

## Tips

- Validate JSON before loading into production
- Use UNWIND for array processing
- Create indexes before bulk imports
- Use transactions for large imports
- Consider streaming for very large files
- Handle null values explicitly in mappings
