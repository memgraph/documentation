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
        body="Explore features such as GraphChat, monitoring, sharing features, and more."
        href="/docs/memgraph-lab/features"
      />
      <SocialCard 
        title="Configuration →"
        body="Learn how to configure Memgraph Lab in Docker environment using environment variables."
        href="/docs/memgraph-lab/configuration"
      />
      </SocialCards>
      </div>
  );
}

