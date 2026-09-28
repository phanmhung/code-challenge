function Icon({ children, className, viewBox = '0 0 24 24' }) {
  return (
    <svg
      className={className}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function HorizontalSwapIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M4 7h15m0 0-3-3m3 3-3 3M20 17H5m0 0 3-3m-3 3 3 3" />
    </Icon>
  );
}

export function VerticalSwapIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M8 4v16m0 0-3-3m3 3 3-3M16 20V4m0 0-3 3m3-3 3 3" />
    </Icon>
  );
}

export function ChevronDownIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="m5 9 7 7 7-7" />
    </Icon>
  );
}
