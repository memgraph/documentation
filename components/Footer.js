import React from "react";
import Image from "next/image";
import Link from "next/link";

const ExternalLink = ({ href, children }) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="external-link"
  >
    <span className="external-link-text">{children}</span>
    <Image
      src="/docs/external-link.svg"
      alt="External Link"
      width={16}
      height={17}
    />
  </Link>
);

const Footer = () => (
  <footer className="flex flex-col pt-[56px] lg:pt-[107px] px-[40px] lg:px-[156px] h-full lg:h-[511px] bg-[#F9F9F9] dark:bg-[#231F20] items-center">
    <div className="flex flex-col lg:flex-row gap-[40px] lg:gap-[80px] mb-[45px]">
      <div className="flex flex-col mr-[140px] w-[162px] h-[56px]">
        <Image className="bg-[url('/docs/memgraph-logo-footer.svg')] dark:bg-[url('/docs/memgraph-logo-footer-dark.svg')]"
          src="/docs/memgraph-logo-background.png"
          alt="Memgraph Logo"
          width="162"
          height="56"
        />
      </div>
      <div className="flex flex-col gap-[12px]">
        <div className="mb-[3px] text-[#231F20] text-[18px] leading-[31px] font-medium dark:text-[#E6E6E6]">
          Documentation
        </div>
        <div className="text-[#231F20] text-[16px] leading-[31px] font-normal dark:text-[#E6E6E6]">
          <Link href="/getting-started">Get started</Link>
        </div>
        <div className="text-[#231F20] text-[16px] leading-[31px] font-normal dark:text-[#E6E6E6]">
          <Link href="/data-migration">Migrate data</Link>
        </div>
        <div className="text-[#231F20] text-[16px] leading-[31px] font-normal dark:text-[#E6E6E6]">
          <Link href="/querying">Query data</Link>
        </div>
        <div className="text-[#231F20] text-[16px] leading-[31px] font-normal dark:text-[#E6E6E6]">
          <Link href="/custom-query-modules">Create an app</Link>
        </div>
        <div className="text-[#231F20] text-[16px] leading-[31px] font-normal dark:text-[#E6E6E6]">
          <Link href="/data-visualization">Visualize data</Link>
        </div>
        <div className="text-[#231F20] text-[16px] leading-[31px] font-normal dark:text-[#E6E6E6]">
          <Link href="/advanced-algorithms">Use advanced algorithms</Link>
        </div>
      </div>
      <div className="flex flex-col gap-[12px]">
        <div className="mb-[3px] text-[#231F20] text-[18px] leading-[31px] font-medium dark:text-[#E6E6E6]">
          Community
        </div>
        <div className="text-[#231F20] text-[16px] leading-[31px] font-normal dark:text-[#E6E6E6]">
          <ExternalLink href="https://discord.gg/memgraph">
            Discord
          </ExternalLink>
        </div>
        <div className="text-[#231F20] text-[16px] leading-[31px] font-normal dark:text-[#E6E6E6]">
          <ExternalLink href="https://stackoverflow.com/questions/tagged/memgraphdb">
            Stack Overflow
          </ExternalLink>
        </div>
        <div className="text-[#231F20] text-[16px] leading-[31px] font-normal dark:text-[#E6E6E6]">
          <ExternalLink href="https://twitter.com/memgraphdb">
            Twitter
          </ExternalLink>
        </div>
      </div>
      <div className="flex flex-col gap-[12px]">
        <div className="mb-[3px] text-[#231F20] text-[18px] leading-[31px] font-medium dark:text-[#E6E6E6]">
          More
        </div>
        <div className="text-[#231F20] text-[16px] leading-[31px] font-normal dark:text-[#E6E6E6]">
          <ExternalLink href="https://cloud.memgraph.com/login">
            Memgraph Cloud
          </ExternalLink>
        </div>
        <div className="text-[#231F20] text-[16px] leading-[31px] font-normal dark:text-[#E6E6E6]">
          <ExternalLink href="https://playground.memgraph.com">
            Memgraph Playground
          </ExternalLink>
        </div>
        <div className="text-[#231F20] text-[16px] leading-[31px] font-normal dark:text-[#E6E6E6]">
          <ExternalLink href="https://github.com/memgraph/memgraph">
            GitHub
          </ExternalLink>
        </div>
        <div className="text-[#231F20] text-[16px] leading-[31px] font-normal dark:text-[#E6E6E6]">
          <ExternalLink href="https://www.youtube.com/channel/UCZ3HOJvHGxtQ_JHxOselBYg">
            YouTube
          </ExternalLink>
        </div>
      </div>
    </div>
    <div className="flex flex-row text-[11px] text-[#646265] font-normal dark:text-[#E6E6E6]">
      Copyright © {new Date().getFullYear()} Memgraph
    </div>
  </footer>
);

export default Footer;
