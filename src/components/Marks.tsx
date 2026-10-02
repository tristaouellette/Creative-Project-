/** Original NOPAL mark: two prickly-pear pads and a single bloom. */
export function LogoMark({className = ''}: {className?: string}) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <ellipse cx="13" cy="19.5" rx="8.2" ry="10.5" fill="currentColor" />
      <ellipse
        cx="22.6"
        cy="10.4"
        rx="5"
        ry="6.6"
        transform="rotate(32 22.6 10.4)"
        fill="currentColor"
      />
      <circle cx="26.6" cy="3.8" r="2.6" fill="var(--color-bloom)" />
      {/* areoles, cut out of the big pad */}
      <g fill="var(--color-night)">
        <circle cx="10.2" cy="15" r="0.95" />
        <circle cx="15.6" cy="18.4" r="0.95" />
        <circle cx="10.8" cy="23.2" r="0.95" />
        <circle cx="15" cy="26.4" r="0.95" />
      </g>
    </svg>
  );
}

/** A sun sitting on the horizon, drawn as a single hairline glyph. */
export function SunGlyph({className = ''}: {className?: string}) {
  return (
    <svg viewBox="0 0 46 22" className={className} fill="none" aria-hidden="true">
      <rect x="0.5" y="0.5" width="45" height="21" rx="10.5" stroke="currentColor" />
      <path d="M13 15.5a10 10 0 0 1 20 0" stroke="currentColor" />
      <path d="M17.6 15.5a5.4 5.4 0 0 1 10.8 0" stroke="currentColor" />
      <path d="M6 15.5h34" stroke="currentColor" />
    </svg>
  );
}
