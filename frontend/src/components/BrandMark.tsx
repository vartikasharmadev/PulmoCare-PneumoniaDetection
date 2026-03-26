import { useId } from 'react';

interface BrandMarkProps {
  className?: string;
  size?: number;
}

/** PulmoCare “P” mark — same look as favicon; gradient id is unique per instance. */
export function BrandMark({ className = '', size = 36 }: BrandMarkProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const gradId = `p-grad-${uid}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="55%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#115e59" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill={`url(#${gradId})`} />
      <text
        x="32"
        y="44"
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
        fontSize="38"
        fontWeight="800"
        fill="#f0fdfa"
      >
        P
      </text>
    </svg>
  );
}
