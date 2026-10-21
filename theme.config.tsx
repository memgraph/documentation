import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";
import ConnectAI from "./components/connect-ai/ConnectAI";
import Footer from "./components/Footer";
import { HeadComponent } from "./components/HeadComponent";
import { MemgraphLogo } from "./components/icons/MemgraphLogo";

const config: DocsThemeConfig = {
  logo: MemgraphLogo,
  darkMode: true,
  logoLink: "https://memgraph.com",
  project: {
    link: "https://github.com/memgraph/memgraph",
  },
  chat: {
    link: "https://discord.gg/memgraph",
  },
  navbar: {
    extraContent: <ConnectAI />,
  },
  docsRepositoryBase: "https://github.com/memgraph/documentation/tree/main",
  footer: { component: Footer},
  head: HeadComponent,
  sidebar: {
    defaultMenuCollapseLevel: 1,
    autoCollapse: true,
    toggleButton: false
  },
  navigation: true,
  gitTimestamp: true,
  backgroundColor: { light: "#FFFFFF", dark: "#231F20" },
};

export default config;