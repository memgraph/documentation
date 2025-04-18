import type { ReactNode } from 'react';

interface SocialCardProps {
  icon?: ReactNode;
  title: string;
  href: string;
  body?: string;
}

export function SocialCard({ icon, title, href, body }: SocialCardProps) {
  return (
    <a
      href={href}
      target='_blank'
      className="social-card group flex flex-col justify-start overflow-hidden rounded-lg border border-gray-200 text-current no-underline dark:shadow-none hover:shadow-gray-100 dark:hover:shadow-none shadow-gray-100 active:shadow-sm active:shadow-gray-200 transition-all duration-200 hover:border-gray-300 bg-transparent shadow-sm dark:border-neutral-800 hover:bg-slate-50 hover:shadow-md dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
    >
      <div className="p-4 flex flex-col gap-2 dark:bg-[#3a3436]">
        <div className="flex font-semibold items-start gap-2 text-gray-700 dark:text-gray-100 items-center">
          {icon}
          <span>{title}</span>
        </div>
        <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">{body}</p>
      </div>
    </a>
  );
}
