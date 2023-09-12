import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';
import Footer from './components/Footer';
import Copyright from './components/Copyright';

const config: DocsThemeConfig = {
  logo: (
    <>
      <img src="/docs/memgraph-logo-navigation.svg" alt="Memgraph Logo" style={{ height: '24px', verticalAlign: 'middle', marginRight: '1em' }} />
      <span>Memgraph Documentation</span>
    </>
  ),
  darkMode: true,
  logoLink: '/',
  project: {
    link: 'https://github.com/memgraph/memgraph',
  },
  chat: {
    link: 'https://discord.gg/memgraph',
  },
  docsRepositoryBase: 'https://github.com/memgraph/documentation/tree/main/',
  footer: {
    component: (
      <div className="whole-footer-wrapper">
        <Footer />
        <Copyright />
      </div>
    ),
  },
  head: (
    <>
      <link rel="icon" href="/docs/favicon.png" type="image/png" />
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
  useNextSeoProps() {
    return {
      titleTemplate: '%s'
    }
  }
}

export default config;
