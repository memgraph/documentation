"use client";

declare global {
  interface Window {
    analytics: any;
  }
}

export default function LinkClick(props: { link: string, os: string, distribution: string }) {


  const handleClick = () => {
    global.window.analytics.track("Direct download opened", {
      source: "docs",
      os: props.os,
      distribution: props.distribution,
    });
  };
  return (
      <a href={props.link} onClick={handleClick} className="border-b-[1px] border-[#8c0082] rounded-none">{props.link}</a>
  );
}
