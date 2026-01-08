# MAGE Algorithm Skills for GitHub Copilot

This directory contains [Agent Skills](https://agentskills.io/) that provide GitHub Copilot with expertise in Memgraph's MAGE (Memgraph Advanced Graph Extensions) algorithms.

## What are Agent Skills?

Agent Skills are folders of instructions that GitHub Copilot can load when relevant to perform specialized tasks. Each skill teaches Copilot how to use specific graph algorithms with Memgraph.

## Using These Skills

These skills work automatically with:
- **GitHub Copilot coding agent** (in VS Code and other editors)
- **GitHub Copilot CLI**
- **VS Code Insiders agent mode**

When you ask Copilot about graph algorithms, it will automatically discover and use these skills to help you write correct Cypher queries and understand algorithm usage.

## Available Skills

### Graph Analytics & Centrality
- **pagerank** - Measure node influence based on connections
- **betweenness-centrality** - Find bridge nodes and connectors
- **degree-centrality** - Count node connections
- **katz-centrality** - Influence based on all paths

### Community & Clustering
- **community-detection** - Louvain algorithm for finding communities
- **leiden-community-detection** - Improved community detection
- **weakly-connected-components** - Find connected groups

### Path Finding & Traversal
- **shortest-path** - Find optimal paths between nodes
- **bfs** - Breadth-first search traversal
- **tsp** - Traveling Salesman Problem solver

### Graph Structure
- **bridges** - Detect critical edges
- **cycles** - Find cycles in graphs
- **graph-analyzer** - Graph statistics and profiling

### Similarity & Machine Learning
- **node-similarity** - Calculate node similarity
- **node2vec** - Generate node embeddings

### Optimization
- **max-flow** - Maximum flow in networks

### Utilities
- **collections** - List manipulation utilities
- **json-util** - JSON import/export

## Example Usage

Simply ask Copilot natural language questions like:

```
"Find the most influential nodes in my graph using PageRank"
"Detect communities in the social network"
"What's the shortest path between node A and node B?"
"Calculate betweenness centrality to find bridge nodes"
```

Copilot will:
1. Recognize the request matches a skill
2. Load the skill instructions
3. Generate appropriate Cypher queries
4. Help you understand and use the results

## Skill Structure

Each skill follows the [Agent Skills specification](https://agentskills.io/specification):

```
skill-name/
└── SKILL.md          # Skill definition with frontmatter + instructions
```

The `SKILL.md` file contains:
- **YAML frontmatter** with name, description, and metadata
- **Detailed instructions** on when and how to use the algorithm
- **Cypher query examples** with Memgraph MAGE procedures
- **Common edge cases** and tips

## Requirements

- GitHub Copilot Pro, Pro+, Business, or Enterprise
- Memgraph database with MAGE library installed
- These skills are specifically designed for Memgraph's Cypher dialect and MAGE procedures

## Learn More

- [Agent Skills Specification](https://agentskills.io/)
- [GitHub Copilot Skills Documentation](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
- [Memgraph MAGE Documentation](https://memgraph.com/docs/advanced-algorithms/available-algorithms)

## License

Apache-2.0
