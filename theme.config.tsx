import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>Memgraph Documentation</span>,
  project: {
    link: 'https://github.com/memgraph/memgraph',
  },
  chat: {
    link: 'https://discord.gg/memgraph',
  },
  docsRepositoryBase: 'https://github.com/memgraph/memgraph',
  footer: {
    text: 'Memgraph',
  },
  head: (
    <>
      <link rel="icon" href="/favicon.png" />
    </>
  )
}

export default config
