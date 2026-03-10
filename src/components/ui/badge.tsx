import { type HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'destructive';
}

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors';
  const variants: Record<string, string> = {
    default: 'bg-zinc-100 text-zinc-900',
    outline: 'border border-zinc-700 text-zinc-300',
    secondary: 'bg-zinc-800 text-zinc-300',
    destructive: 'bg-red-900 text-red-300',
  };

  return (
    <div className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
