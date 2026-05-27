import type { CSSProperties } from "react";

interface P { size?: number; color?: string; style?: CSSProperties }

// Hibiscus (Ghana's common bloom — Lordina's visual signature).
export function Hibiscus({ size = 64, color = "currentColor", style }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="1.4" style={style} >
      {/* five petals */}
      {[0, 72, 144, 216, 288].map((rot) => (
        <path key={rot} d="M50 50 C 38 22, 62 22, 50 50 Z" transform={`rotate(${rot} 50 50)`} />
      ))}
      {/* stamen */}
      <line x1="50" y1="50" x2="50" y2="20" />
      <circle cx="50" cy="20" r="2" fill={color} />
      <circle cx="46" cy="22" r="1.5" fill={color} />
      <circle cx="54" cy="22" r="1.5" fill={color} />
      <circle cx="50" cy="50" r="3" fill={color} />
    </svg>
  );
}

// Garland — leafy ribbon. Drawn as a horizontal repeat for ornamental dividers.
export function Garland({ width = 320, color = "currentColor", style }: P & { width?: number }) {
  return (
    <svg width={width} height="20" viewBox="0 0 320 20" fill="none" stroke={color} strokeWidth="1.2" style={style} >
      <line x1="0" y1="10" x2="320" y2="10" strokeWidth="0.6" opacity="0.5" />
      {Array.from({ length: 16 }).map((_, i) => (
        <g key={i} transform={`translate(${i * 20}, 0)`}>
          <ellipse cx="6" cy="6" rx="6" ry="3" transform="rotate(-30 6 6)" />
          <ellipse cx="14" cy="14" rx="6" ry="3" transform="rotate(30 14 14)" />
        </g>
      ))}
    </svg>
  );
}

// Ribbon flourish — an underline accent. Used under titles.
export function Ribbon({ width = 80, color = "currentColor", style }: P & { width?: number }) {
  return (
    <svg width={width} height="14" viewBox="0 0 80 14" fill="none" stroke={color} strokeWidth="1.2" style={style} >
      <path d="M2 7 Q 20 0, 40 7 T 78 7" />
      <circle cx="2" cy="7" r="1.5" fill={color} />
      <circle cx="78" cy="7" r="1.5" fill={color} />
    </svg>
  );
}

// Subtle paper texture (background overlay) — soft cross-hatch in ivory.
export function PaperTexture({ color = "rgba(42,31,26,0.04)", style }: P) {
  return (
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none", ...style }}>
      <defs>
        <pattern id="lordina-paper" width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M0 22 L22 0 M-2 12 L12 -2 M10 24 L24 10" stroke={color} strokeWidth="0.5" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#lordina-paper)" />
    </svg>
  );
}

// Adinkra: Mmusuyidee — "that which removes ill fortune" — symbol of welfare/sanctity.
export function Mmusuyidee({ size = 48, color = "currentColor", style }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" style={style} >
      <line x1="50" y1="10" x2="50" y2="90" />
      <line x1="10" y1="50" x2="90" y2="50" />
      <circle cx="50" cy="20" r="4" />
      <circle cx="50" cy="80" r="4" />
      <circle cx="20" cy="50" r="4" />
      <circle cx="80" cy="50" r="4" />
      <circle cx="50" cy="50" r="6" fill={color} />
    </svg>
  );
}
