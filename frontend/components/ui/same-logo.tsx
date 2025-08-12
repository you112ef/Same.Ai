export function SameLogo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className}
      fill="currentColor"
    >
      <rect x="2" y="2" width="6" height="6" rx="1"/>
      <rect x="10" y="2" width="6" height="6" rx="1"/>
      <rect x="18" y="2" width="4" height="6" rx="1"/>
      <rect x="2" y="10" width="6" height="6" rx="1"/>
      <rect x="10" y="10" width="6" height="6" rx="1"/>
      <rect x="18" y="10" width="4" height="6" rx="1"/>
      <rect x="2" y="18" width="6" height="4" rx="1"/>
      <rect x="10" y="18" width="6" height="4" rx="1"/>
      <rect x="18" y="18" width="4" height="4" rx="1"/>
    </svg>
  )
}
