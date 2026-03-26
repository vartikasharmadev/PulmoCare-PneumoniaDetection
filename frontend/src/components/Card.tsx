import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className = '', title }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-clinical-200/60 bg-white/90 shadow-xl shadow-clinical-900/[0.04] backdrop-blur-sm overflow-hidden transition-shadow duration-300 hover:shadow-clinical-900/[0.07] ${className}`}
    >
      {title && (
        <div className="px-6 py-4 border-b border-clinical-100 bg-gradient-to-r from-clinical-50/80 to-surgical-50/50">
          <h3 className="font-semibold text-slate-900">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
