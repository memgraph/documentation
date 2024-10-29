"use client";

import Image from "next/image";
import { useTheme } from "nextra-theme-docs";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    analytics: any;
  }
}

export default function CodeSnippet(props: { code: string; page: string, os: string }) {
  const [copyIconUrl, setCopyIconUrl] = useState("/docs/copy-icon.svg"); 
  const [copiedIconUrl, setCopiedIconUrl] = useState("/docs/copied-icon.svg"); 
  const { theme } = useTheme();
  let idCopy = "copy-text-".concat(props.page).concat(props.os);
  let idCopied = "copied-text-".concat(props.page).concat(props.os);

  useEffect(() => {
    if (theme === "light") {
      setCopyIconUrl("/docs/copy-icon.svg");
      setCopiedIconUrl("/docs/copied-icon.svg")
    } else {
      setCopyIconUrl("/docs/copy-icon-dark.svg");
      setCopiedIconUrl("/docs/copied-icon-dark.svg")
    }
  }, [theme]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(props.code);
    // global.window.analytics.track("Docker Run Copied", {
    //   source: "docs",
    //   page: props.page,
    //   os: props.os
    // });
    document.getElementById(idCopy)?.classList.add("hidden");
    document.getElementById(idCopied)?.classList.remove("hidden");
    setTimeout(() => {
      document.getElementById(idCopied)?.classList.add("hidden");
      document.getElementById(idCopy)?.classList.remove("hidden");
    }, 2000);
  };
  return (
    <div className="mt-[24px] p-[12px] text-[13px] flex flex-row bg-[#f9f9f9] dark:bg-[#3a3536] text-[#231F20] dark:text-[#f9f9f9] rounded-[12px] items-center justify-between">
      <code>{props.code}</code>
      <button
        className="shrink-0"
        onClick={copyToClipboard}
        data-tooltip-target="tooltip-click"
        data-tooltip-trigger="click"
      >
        <Image
          alt="copy"
          src={copyIconUrl}
          id={idCopy}
          className="cursor-pointer"
          width={30}
          height={30}
        />
        <Image
          alt="copied"
          src={copiedIconUrl}
          id={idCopied}
          className="hidden"
          width={30}
          height={30}
        />
      </button>
    </div>
  );
}
