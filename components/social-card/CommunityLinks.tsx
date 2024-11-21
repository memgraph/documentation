import { SocialCards } from './SocialCards';
import { SocialCard } from './SocialCard';
import Discord from '../icons/Discord';
import GitHub from '../icons/GitHub';
import Calendar from '../icons/Calendar';

export function CommunityLinks() {
  return (
    <div>
    <SocialCards>
      <SocialCard 
        icon={<Discord />}
        title="Discord"
        body="Join the community"
        href="https://discord.gg/memgraph"
      />
      <SocialCard 
        icon={<GitHub />}
        title="Github"
        body="Ask a question"
        href="https://github.com/memgraph/memgraph/discussions"
      />
      <SocialCard 
        icon={<Calendar />}
        title="Support"
        body="Talk with Memgraph engineers"
        href="https://memgraph.com/office-hours"
      />
      </SocialCards>
      </div>
  );
}
