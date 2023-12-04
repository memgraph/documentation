import React from "react";
import { useRouter } from 'next/router';
import { useConfig } from 'nextra-theme-docs';
import { DocsThemeConfig } from "nextra-theme-docs";
import Footer from "./components/Footer";
import Docsearch from './components/docsearch';

const config: DocsThemeConfig = {
  logo: (
    <>
      <img
        src="/docs/memgraph-logo-navigation.svg"
        alt="Memgraph Logo"
        style={{ height: "24px", verticalAlign: "middle", marginRight: "1em" }}
      />
      <span>Memgraph Documentation</span>
    </>
  ),
  darkMode: true,
  logoLink: "/",
  project: {
    link: "https://github.com/memgraph/memgraph",
  },
  chat: {
    link: "https://discord.gg/memgraph",
  },
  docsRepositoryBase: "https://github.com/memgraph/documentation/tree/main/",
  footer: {
    component: (
      <div className="whole-footer-wrapper">
        <Footer />
      </div>
    ),
  },
  head: () => {
    const { asPath, defaultLocale, locale } = useRouter()
    const { frontMatter } = useConfig()
    const url =
      'https://memgraph.com/docs' +
      (defaultLocale === locale ? asPath : `/${locale}${asPath}`)
    const description = frontMatter.description || 'Discover the comprehensive Memgraph documentation and learn how to use the powerful graph database to its full potential.';
    const imageUrl = frontMatter.image || "https://memgraph.com/docs/memgraph-docs-ogimage-small.png";

    return (
      <>
        <link rel="icon" href="/docs/favicon.png" type="image/png" />
        
        {/* Open Graph meta tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={frontMatter.title || 'Memgraph documentation'} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="314" />

        {/* Twitter meta tags */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={imageUrl} />
      </>
    );
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    autoCollapse: true,
  },
  navigation: {
    prev: false,
    next: false,
  },
  useNextSeoProps() {
    return {
      titleTemplate: "%s",
    };
  },
  search: {
    component: <Docsearch />,
    placeholder: 'Search...',
    emptyResult: 'No results found.',
    loading: 'Searching...',
    error: 'An error occurred while searching.',
  },
};

export default config;