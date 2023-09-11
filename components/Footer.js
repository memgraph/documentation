import React from 'react';
import Image from 'next/image';

const ExternalLink = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="external-link">
      <span className="external-link-text">{children}</span>
      <Image src="/docs/external-link.svg" alt="External Link" width={16} height={17} />
  </a>
);

const Footer = () => (
  <footer className="footer-container">
        <div>
          <img src="/docs/memgraph-logo-footer.svg" alt="Memgraph Logo" width="162" height="55" />
        </div>
        <div>
            <ul className="column-text">
                <li><span className="column-title">Documentation</span ></li>
                <li><a href="/docs/getting-started">Get started</a></li>
                <li><a href="/docs/data-migration">Migrate data</a></li>
                <li><a href="/docs/querying">Query data</a></li>
                <li><a href="/docs/custom-query-modules">Create an app</a></li>
                <li><a href="/docs/data-visualization">Visualize data</a></li>
                <li><a href="/docs/advanced-algorithms">Use advanced algorithms</a></li>
            </ul>
        </div>
        <div>
            <ul className="column-text">
                <li><span className="column-title">Community</span ></li>
                <li><ExternalLink href="https://discord.gg/memgraph">Discord</ExternalLink></li>
                <li><ExternalLink href="https://stackoverflow.com/questions/tagged/memgraphdb">Stack Overflow</ExternalLink></li>
                <li><ExternalLink href="https://twitter.com/memgraphdb">Twitter</ExternalLink></li>
            </ul>
        </div>
        <div>
            <ul className="column-text">
                <li><span className="column-title">More</span ></li>
                <li><ExternalLink href="https://cloud.memgraph.com/login">Memgraph Cloud</ExternalLink></li>
                <li><ExternalLink href="https://playground.memgraph.com">Memgraph Playground</ExternalLink></li>
                <li><ExternalLink href="https://github.com/memgraph/memgraph">GitHub</ExternalLink></li>
                <li><ExternalLink href="https://www.youtube.com/channel/UCZ3HOJvHGxtQ_JHxOselBYg">YouTube</ExternalLink></li>
            </ul>
        </div>
    </footer>
);

export default Footer;
