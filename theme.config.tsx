import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: (
    <>
      <img src="/docs/memgraph-logo-navigation.svg" alt="Memgraph Logo" style={{ height: '24px', verticalAlign: 'middle', marginRight: '1em' }} />
      <span>Memgraph Documentation</span>
    </>
  ),
  logoLink: '/', 
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
  ),
  sidebar: {
    defaultMenuCollapseLevel: 1,
    autoCollapse: true, 
  },
  navigation: {
    prev: false,
    next: false
  },
  editLink: {
    text: null
  },
  feedback: {
    content: null
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s'
    }
  }
}

export default config
