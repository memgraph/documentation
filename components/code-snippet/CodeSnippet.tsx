"use client"

import Image from "next/image";

declare global {
    interface Window {
        analytics: any
    }
}

export default function CodeSnippet(props: { code: string, page: string }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(props.code);
    global.window.analytics.track("Docker Run Copied", {
      source: "docs",
      page: props.page
    })
    document.getElementById("copy-text")?.classList.add("hidden");
    document.getElementById("copied-text")?.classList.remove("hidden");
    setTimeout(() => {
      document.getElementById("copied-text")?.classList.add("hidden");
      document.getElementById("copy-text")?.classList.remove("hidden");
    }, 2000);
  };
  return (
    <div className="p-[16px] leading-[20px] text-[13px] flex flex-row bg-[#f9f9f9] text-[#231F20] rounded-[12px] justify-between">
      <div className="">
        <code>{props.code}</code>
      </div>
      <button
        className=""
        onClick={copyToClipboard}
        data-tooltip-target="tooltip-click"
        data-tooltip-trigger="click"
      >
        <Image
          alt="copy"
          src="/docs/copy.svg"
          id="copy-text"
          className="cursor-pointer shrink-0"
          width={20}
          height={20}
        />
        <Image
          alt="copied"
          src="/docs/copied.svg"
          id="copied-text"
          className="hidden shrink-0"
          width={20}
          height={20}
        />
      </button>
    </div>
  );
}
