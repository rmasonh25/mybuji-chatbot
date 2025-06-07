import type React from 'react';

interface CelloIconProps extends React.SVGProps<SVGSVGElement> {}

const CelloIcon: React.FC<CelloIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2C9.79 2 8 3.79 8 6v10c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V6c0-2.21-1.79-4-4-4zm2 14h-4v-2h4v2zm0-4h-4V8h4v4z" />
    <path d="M12 18v3a1 1 0 001 1h0a1 1 0 001-1v-3" />
    <path d="M10 4.5c0-.83.67-1.5 1.5-1.5S13 3.67 13 4.5" />
    <path d="M14 4.5c0-.83.67-1.5 1.5-1.5S17 3.67 17 4.5" />
    <path d="M7 4.5C7 3.67 6.33 3 5.5 3S4 3.67 4 4.5" />
    <path d="M10 4.5C10 3.67 9.33 3 8.5 3S7 3.67 7 4.5" />
     <path d="M11.5 6L11.5 16" stroke="var(--background)" strokeWidth="0.5" />
     <path d="M12.5 6L12.5 16" stroke="var(--background)" strokeWidth="0.5" />
  </svg>
);

export default CelloIcon;
