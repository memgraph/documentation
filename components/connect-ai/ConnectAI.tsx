"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { CLIENTS, DOCS_MCP_URL } from "./clients";

declare global {
  interface Window {
    dataLayer?: object[];
  }
}

// Counts only which client was picked, never page content.
const track = (event: string, client: string) =>
  window.dataLayer?.push({ event, client });

export default function ConnectAI() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(CLIENTS[0].id);
  const [copied, setCopied] = useState(false);
  const client = CLIENTS.find((c) => c.id === active)!;

  const open = () => {
    dialog.current?.showModal();
    track("connect_ai_open", active);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(client.snippet);
    setCopied(true);
    track("connect_ai_copy", client.id);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="whitespace-nowrap rounded-full border border-[#8C0081] px-3 py-1 text-sm font-medium text-[#8C0081] hover:bg-[#8C0081] hover:text-white dark:border-[#e27ad6] dark:text-[#e27ad6] dark:hover:bg-[#e27ad6] dark:hover:text-[#231F20]"
      >
        Connect AI
      </button>

      <dialog
        ref={dialog}
        // Close when clicking the backdrop, outside the dialog's box.
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
        className="w-[min(36rem,calc(100vw-2rem))] rounded-xl p-0 text-[#231F20] shadow-xl backdrop:bg-black/50 dark:bg-[#2f2a2b] dark:text-[#f9f9f9]"
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-lg font-semibold">
              Connect your AI assistant to the Memgraph docs
            </h2>
            <button
              type="button"
              aria-label="Close"
              onClick={() => dialog.current?.close()}
              className="text-xl leading-none opacity-60 hover:opacity-100"
            >
              ×
            </button>
          </div>
          <p className="mt-2 text-sm opacity-80">
            The docs MCP server lets your assistant search the current Memgraph
            docs and answer with links. No API key needed.
          </p>

          <div role="tablist" className="mt-4 flex flex-wrap gap-2">
            {CLIENTS.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={c.id === active}
                onClick={() => {
                  setActive(c.id);
                  setCopied(false);
                }}
                className={`rounded-full px-3 py-1 text-sm ${
                  c.id === active
                    ? "bg-[#8C0081] text-white"
                    : "bg-[#f2f2f2] hover:bg-[#e6e6e6] dark:bg-[#3a3536] dark:hover:bg-[#4a4445]"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div role="tabpanel" className="mt-4">
            {client.install && (
              <a
                href={client.install.href}
                onClick={() => track("connect_ai_install", client.id)}
                className="mb-3 inline-block rounded-lg bg-[#8C0081] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                {client.install.label}
              </a>
            )}
            <div className="flex items-end justify-between gap-4">
              <p className="text-sm opacity-80">{client.where}</p>
              <button
                type="button"
                onClick={copy}
                className="shrink-0 rounded-md px-2 py-1 text-xs hover:bg-black/5 dark:hover:bg-white/10"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-[#f9f9f9] p-3 text-[13px] dark:bg-[#3a3536]">
              <code>{client.snippet}</code>
            </pre>
          </div>

          <p className="mt-4 text-sm opacity-80">
            Endpoint: <code>{DOCS_MCP_URL}</code>.{" "}
            <Link
              href="/ai-ecosystem/mcp#mcp-server-for-docs"
              onClick={() => dialog.current?.close()}
              className="text-[#8C0081] underline dark:text-[#e27ad6]"
            >
              Setup and sample prompts
            </Link>
          </p>
        </div>
      </dialog>
    </>
  );
}
