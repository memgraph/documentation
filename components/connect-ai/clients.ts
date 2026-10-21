// Setup for each AI client in the "Connect AI" dialog in the navbar.
// When a client changes its config format, update its entry here and in
// pages/ai-ecosystem/mcp.mdx (MCP server for docs).

export const DOCS_MCP_URL = "https://mcp-docs.memgraph.com";
const NAME = "memgraph-docs";

export type Client = {
  id: string;
  label: string;
  // Where the snippet goes, shown above it.
  where: string;
  snippet: string;
  // One-click install link, for clients that support one.
  install?: { label: string; href: string };
};

const json = (value: unknown) => JSON.stringify(value, null, 2);

export const CLIENTS: Client[] = [
  {
    id: "claude-code",
    label: "Claude Code",
    where: "Run in your terminal:",
    snippet: `claude mcp add --transport http ${NAME} ${DOCS_MCP_URL}`,
  },
  {
    id: "codex",
    label: "Codex",
    where: "Run in your terminal (needs Node.js):",
    snippet: `codex mcp add ${NAME} -- npx -y mcp-remote@latest ${DOCS_MCP_URL}`,
  },
  {
    id: "cursor",
    label: "Cursor",
    where: "Or add to ~/.cursor/mcp.json:",
    snippet: json({ mcpServers: { [NAME]: { url: DOCS_MCP_URL } } }),
    install: {
      label: "Add to Cursor",
      href: `cursor://anysphere.cursor-deeplink/mcp/install?name=${NAME}&config=${btoa(JSON.stringify({ url: DOCS_MCP_URL }))}`,
    },
  },
  {
    id: "vscode",
    label: "VS Code",
    where: "Or add to .vscode/mcp.json:",
    snippet: json({ servers: { [NAME]: { type: "http", url: DOCS_MCP_URL } } }),
    install: {
      label: "Add to VS Code",
      href: `vscode:mcp/install?${encodeURIComponent(
        JSON.stringify({ name: NAME, type: "http", url: DOCS_MCP_URL })
      )}`,
    },
  },
  {
    id: "other",
    label: "Other",
    where: "Claude Desktop and other clients that only run local servers (needs Node.js):",
    snippet: json({
      mcpServers: {
        [NAME]: { command: "npx", args: ["-y", "mcp-remote@latest", DOCS_MCP_URL] },
      },
    }),
  },
];
