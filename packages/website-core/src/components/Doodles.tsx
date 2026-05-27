import type { CSSProperties } from "react";
import type { SubjectKey } from "@mahama/shared-types";

interface DoodleProps {
  size?: number;
  color?: string;
  style?: CSSProperties;
  className?: string;
}

/* ============== IBRAHIM — industrial / mining ============== */

export function DrillRig({ size = 80, color = "currentColor", style }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="1.4" style={style} >
      <line x1="50" y1="6" x2="50" y2="92" />
      <line x1="42" y1="14" x2="58" y2="14" />
      <line x1="38" y1="30" x2="62" y2="30" />
      <line x1="34" y1="46" x2="66" y2="46" />
      <line x1="30" y1="62" x2="70" y2="62" />
      <line x1="26" y1="78" x2="74" y2="78" />
      <line x1="20" y1="92" x2="80" y2="92" strokeWidth="2.2" />
      <line x1="42" y1="14" x2="20" y2="92" />
      <line x1="58" y1="14" x2="80" y2="92" />
      <circle cx="50" cy="48" r="4" fill={color} />
    </svg>
  );
}

export function BlueprintGrid({ color = "rgba(201,162,39,0.08)", style }: DoodleProps) {
  return (
    <svg aria-hidden="true" width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none", ...style }}>
      <defs>
        <pattern id="bp" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M48 0H0V48" fill="none" stroke={color} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bp)" />
    </svg>
  );
}

export function Monogram({ subject, size = 60, color = "currentColor" }: DoodleProps & { subject: SubjectKey }) {
  const initials =
    subject === "ibrahim" ? "IM" : subject === "john" ? "JM" : subject === "lordina" ? "LM" : "SM";
  return (
    <svg aria-label={`${initials} monogram`} width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="48" fill="none" stroke={color} strokeWidth="1.4" />
      <text x="50" y="63" textAnchor="middle" fontFamily='"Playfair Display", serif' fontSize="42" fill={color} fontWeight="600">
        {initials}
      </text>
    </svg>
  );
}

/* ============== JOHN — presidential / civic ============== */

export function BlackStar({ size = 40, color = "#000" }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} >
      <path d="M12 2 L14.39 8.41 L21.18 8.79 L15.85 12.96 L17.65 19.5 L12 15.77 L6.35 19.5 L8.15 12.96 L2.82 8.79 L9.61 8.41 Z" />
    </svg>
  );
}

export function GyeNyame({ size = 60, color = "currentColor" }: DoodleProps) {
  // Stylised Gye Nyame (Adinkra — supremacy of God / fearlessness)
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round">
      <path d="M50 10 C30 10 20 30 30 50 C40 65 30 80 50 80 C70 80 60 65 70 50 C80 30 70 10 50 10" />
      <circle cx="50" cy="45" r="6" fill={color} />
      <path d="M50 51 V72" />
    </svg>
  );
}

export function Sankofa({ size = 48, color = "currentColor" }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M30 70 C30 40 70 40 70 60 C70 75 50 75 50 60 L50 50 L40 58" />
      <circle cx="35" cy="76" r="4" fill={color} />
    </svg>
  );
}

export function KenteStripe({ height = 6, style }: { height?: number; style?: CSSProperties }) {
  return (
    <div style={{ display: "flex", height, width: "100%", ...style }}>
      <div style={{ flex: 1, background: "#CE1126" }} />
      <div style={{ flex: 1, background: "#FCD116" }} />
      <div style={{ flex: 1, background: "#006B3F" }} />
    </div>
  );
}

export function PresidentialSeal({ size = 80, color = "currentColor" }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="58" fill="none" stroke={color} strokeWidth="1" />
      <circle cx="60" cy="60" r="50" fill="none" stroke={color} strokeWidth="0.6" />
      <g transform="translate(60 60)">
        <BlackStarRaw color={color} />
      </g>
      <text x="60" y="20" textAnchor="middle" fontSize="6" letterSpacing="3" fill={color} >OFFICE</text>
      <text x="60" y="108" textAnchor="middle" fontSize="6" letterSpacing="3" fill={color} >OF THE PRESIDENT</text>
    </svg>
  );
}

function BlackStarRaw({ color = "#000" }: DoodleProps) {
  return (
    <path
      d="M0 -22 L6 -7 L22 -5 L10 5 L14 22 L0 13 L-14 22 L-10 5 L-22 -5 L-6 -7 Z"
      fill={color} />
  );
}

/* ============== SHARAF — boxing / poster ============== */

export function BoxingGloves({ size = 80, color = "currentColor" }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round">
      <path d="M22 32 C16 38 16 56 22 64 C28 72 42 76 50 70 L62 60 L62 30 C62 22 50 18 42 22 L28 28 C24 30 22 30 22 32" fill={color} fillOpacity="0.06" />
      <path d="M62 30 L78 32 C82 32 84 36 82 40 L74 50 L62 50" />
      <path d="M30 38 L46 36" />
    </svg>
  );
}

export function HalftoneDots({ color = "rgba(255,255,255,0.06)", style }: DoodleProps) {
  return (
    <svg aria-hidden="true" width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none", ...style }}>
      <defs>
        <pattern id="ht" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.4" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ht)" />
    </svg>
  );
}

export function RingCorner({ size = 48, color = "currentColor" }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" stroke={color} strokeWidth="2">
      <line x1="0" y1="0" x2="60" y2="0" />
      <line x1="0" y1="0" x2="0" y2="60" />
      <line x1="0" y1="20" x2="40" y2="20" />
      <line x1="0" y1="40" x2="20" y2="40" />
    </svg>
  );
}

/* ============== LORDINA — foundation / maternal grace ============== */

export function LordinaLotus({ size = 60, color = "currentColor" }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 80 C30 80 14 66 16 48 C26 56 38 56 50 50 C62 56 74 56 84 48 C86 66 70 80 50 80 Z" fill={color} fillOpacity="0.08" />
      <path d="M50 50 C40 38 38 24 50 12 C62 24 60 38 50 50 Z" fill={color} fillOpacity="0.12" />
      <path d="M50 50 C36 44 26 32 24 18 C40 22 50 32 50 50 Z" fill={color} fillOpacity="0.06" />
      <path d="M50 50 C64 44 74 32 76 18 C60 22 50 32 50 50 Z" fill={color} fillOpacity="0.06" />
      <circle cx="50" cy="50" r="3.5" fill={color} />
    </svg>
  );
}

export function LordinaCrest({ size = 80, color = "currentColor" }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" stroke={color} strokeWidth="1.2">
      <circle cx="60" cy="60" r="58" />
      <circle cx="60" cy="60" r="50" strokeWidth="0.6" />
      <g transform="translate(60 60)">
        <path d="M0 30 C-18 30 -32 16 -30 -2 C-22 4 -12 4 0 -2 C12 4 22 4 30 -2 C32 16 18 30 0 30 Z" fill={color} fillOpacity="0.18" />
        <circle cx="0" cy="0" r="3" fill={color} />
      </g>
      <text x="60" y="22" textAnchor="middle" fontSize="6" letterSpacing="3" fill={color} fontFamily='"Inter", sans-serif'>OFFICE OF THE</text>
      <text x="60" y="106" textAnchor="middle" fontSize="6" letterSpacing="3" fill={color} fontFamily='"Inter", sans-serif'>FIRST LADY</text>
    </svg>
  );
}

export function RoseGoldStripe({ height = 6, style }: { height?: number; style?: CSSProperties }) {
  return (
    <div style={{ display: "flex", height, width: "100%", ...style }}>
      <div style={{ flex: 2, background: "#7B2335" }} />
      <div style={{ flex: 1, background: "#C49B6C" }} />
      <div style={{ flex: 3, background: "#7B2335" }} />
      <div style={{ flex: 1, background: "#C49B6C" }} />
      <div style={{ flex: 2, background: "#7B2335" }} />
    </div>
  );
}
