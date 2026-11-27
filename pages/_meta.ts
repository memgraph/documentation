export default {
  // Memgraph (the database) is the default product and lives at the root, as before.
  // The docs home at /docs presents every product: hidden from the sidebar and
  // shown full width.
  "index": {
    title: "Home",
    display: "hidden",
    theme: {
      sidebar: false,
      layout: "full",
    },
  },
  "getting-started": "Getting started",
  "ai-ecosystem": "AI applications",
  "client-libraries": "Client libraries",
  "fundamentals": "Fundamentals",
  "data-modeling": "Data modeling",
  "data-migration": "Data migration",
  "querying": "Querying",
  "advanced-algorithms": "Advanced algorithms",
  "custom-query-modules": "Custom query modules",
  "database-management": "Database management",
  "deployment": "Deployment",
  "memgraph-lab": "Memgraph Lab",
  "memgraph-agent": "Memgraph Agent",
  "help-center": "Help center",
  "release-notes": "Release notes",
  "coming-soon": "What's coming soon to Memgraph?",
  // Other products, each with its own sidebar. Their navbar links are hidden
  // in globals.css; the product switcher in the logo replaces them.
  "memgraph-zero": {
    title: "Memgraph Zero",
    type: "page",
  },
  "memgraph-lore": {
    title: "Memgraph Lore",
    type: "page",
  },
}
