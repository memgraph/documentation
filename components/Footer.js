import React from 'react';

const Footer = () => {
  return (
    <footer className="nx-bg-gray-100 nx-pb-[env(safe-area-inset-bottom)] dark:nx-bg-neutral-900 print:nx-bg-transparent">
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between' }}>
      <div>
          <strong>Documentation</strong>
          <ul>
            <li><a href="/docs/memgraph">Memgraph</a></li>
            <li><a href="/docs/memgraph-lab">Memgraph Lab</a></li>
            <li><a href="/docs/memgraph-cloud">Memgraph Cloud</a></li>
            <li><a href="/docs/cypher-manual">Cypher manual</a></li>
            <li><a href="/docs/mage">MAGE</a></li>
            <li><a href="/docs/gqlalchemy">GQLAlchemy</a></li>
          </ul>
        </div>
        <div>
          <strong>Community</strong>
          <ul>
            <li><a href="https://discord.gg/memgraph" target="_blank" rel="noopener noreferrer">Discord</a></li>
            <li><a href="https://stackoverflow.com/questions/tagged/memgraphdb" target="_blank" rel="noopener noreferrer">Stack Overflow</a></li>
            <li><a href="https://twitter.com/memgraphdb" target="_blank" rel="noopener noreferrer">Twitter</a></li>
          </ul>
        </div>
        <div>
          <strong>More</strong>
          <ul>
            <li><a href="https://memgraph.com/cloud" target="_blank">Memgraph Cloud</a></li>
            <li><a href="https://playground.memgraph.com" target="_blank">Memgraph Playground</a></li>
            <li><a href="https://github.com/memgraph/memgraph" target="_blank">GitHub</a></li>
            <li><a href="https://www.youtube.com/channel/UCZ3HOJvHGxtQ_JHxOselBYg" target="_blank">YouTube</a></li>
          </ul>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>&copy; 2023 Memgraph. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
