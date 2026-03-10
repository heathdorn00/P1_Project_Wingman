import { type HTMLAttributes } from 'react';

interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export function Separator({ orientation = 'horizontal', className = '', ...props }: SeparatorProps) {
  return (
    <div
      role="separator"
      className={`shrink-0 ${
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px'
      } bg-zinc-700 ${className}`}
      {...props}
    />
  );
}
