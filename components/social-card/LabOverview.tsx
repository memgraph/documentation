import { SocialCards } from './SocialCards';
import { SocialCard } from './SocialCard';

// TODO: Make this customizable - forward a list of icon?, title and body and create social cards
export function LabOverview() {
  return (
    <div>
    <SocialCards>
      <SocialCard 
        title="Getting started →"
        body="Learn the Memgraph Lab installation and deployment best practices."
        href="/docs/memgraph-lab/getting-started"
      />
      <SocialCard 
        title="Querying →"
        body="Discover how to execute Cypher queries, explore query results, and optimize performance."
        href="/docs/memgraph-lab/querying"
      />
      <SocialCard 
        title="Features →"
        body="Explore tools such as GraphChat, monitoring, query sharing, data import/export, and more."
        href="/docs/memgraph-lab/features"
      />
      <SocialCard 
        title="Fundamentals →"
        body="Understand the core concepts of Memgraph Lab, including remote storage and configuration."
        href="/docs/memgraph-lab/fundamentals"
      />
      </SocialCards>
      </div>
  );
}

