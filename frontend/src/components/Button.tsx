import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-clinical-500/40 focus-visible:ring-offset-2';

  const variants = {
    primary:
      'bg-clinical-600 text-white shadow-lg shadow-clinical-600/25 hover:bg-clinical-700 hover:shadow-clinical-700/30',
    secondary:
      'bg-white text-slate-800 border border-clinical-200/80 hover:bg-clinical-50 hover:border-clinical-300',
    outline:
      'border-2 border-clinical-600 text-clinical-700 bg-white/80 hover:bg-clinical-50',
    danger:
      'bg-red-600 text-white shadow-lg shadow-red-500/25 hover:bg-red-700',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
