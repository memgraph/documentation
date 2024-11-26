import type { ReactNode } from 'react';

interface SocialCardsProps {
  children: ReactNode;
}


export function SocialCards({ children }: SocialCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-12">
      {children}
    </div>
  );
}
