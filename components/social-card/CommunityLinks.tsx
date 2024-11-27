import { SocialCards } from './SocialCards';
import { SocialCard } from './SocialCard';
import Discord from '../icons/Discord';
import GitHub from '../icons/GitHub';
import Calendar from '../icons/Calendar';

export function CommunityLinks() {
  return (
    <div>
    <hr className="border-t-1 border-[#e3e6e8] mt-12" />
    <SocialCards>
      <SocialCard 
        icon={<Discord />}
        title="Discord"
        body="Join the community"
        href="https://discord.gg/memgraph"
      />
      <SocialCard 
        icon={<GitHub />}
        title="GitHub"
        body="Ask a question"
        href="https://github.com/memgraph/memgraph/discussions"
      />
      <SocialCard 
        icon={<Calendar />}
        title="Office hours"
        body="Talk with Memgraph engineers"
        href="https://memgraph.com/office-hours"
      />
      </SocialCards>
      </div>
  );
}
