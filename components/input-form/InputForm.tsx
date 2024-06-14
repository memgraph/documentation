"use client";

declare global {
  interface Window {
    analytics: any;
  }
}

export default function InputForm(props: { title: string, subtitle: string, placeholder: string }) {
  return (
    <div className="flex flex-col gap-[24px] mt-[48px] border-[1px] rounded-[8px] p-[48px] dark:bg-[#3A3536] dark:border-[#3A3536] bg-[#F9F9F9] border-[#E6E6E6]">
      <h4 className="font-[600] text-[24px] leading-[32px] dark:text-[#F9F9F9] text-[#231F20]">{props.title}</h4>
      <p className="text-[16px] leading-[24px] dark:text-[#E6E6E6] text-[#646265]">{props.subtitle}</p>
      <form
        action="https://memgraph24563.activehosted.com/proc.php"
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        target="_blank"
        className="flex gap-[12px]"
      >
        <input type="hidden" name="u" value="41" />
        <input type="hidden" name="f" value="41" />
        <input type="hidden" name="s" />
        <input type="hidden" name="c" value="0" />
        <input type="hidden" name="m" value="0" />
        <input type="hidden" name="act" value="sub" />
        <input type="hidden" name="v" value="2" />
        <input type="hidden" name="or" value="bdf61bcde6db5ccc28026de19b72cc7a" />
        <input
          type="email"
          name="email"
          id="mce-EMAIL"
          defaultValue=""
          className="px-[24px] border-[1px] border-[#E6E6E6] focus:outline-none focus:ring-0 focus:ring-offset-0 rounded-[6px] w-[60%] text-black dark:bg-[#E6E6E6] bg-white"
          placeholder={props.placeholder} />
        <button className="h-[48px] rounded-[5px] px-[12px] text-[#F9F9F9] duration-100 dark:!bg-[#FB6E00] dark:hover:!bg-[#231F20] !bg-[#231F20] hover:!bg-[#646265]" type="submit">Submit</button>
      </form>
    </div>
  );
}