// Lordina design tokens — distinct from the republic-green/burgundy palette of John's
// presidential template. Warm rose, sage, ivory, gold leaf — paper-and-textile feel.
export const LORDINA = {
  // surfaces
  paper: "#F7F0E1",
  paperDeep: "#EFE5CF",
  ink: "#2A1F1A",
  // accents
  rose: "#A23B47",
  roseDeep: "#7B2335", // matches seed themeColor
  blush: "#E8C9B8",
  sage: "#7B8B5C",
  gold: "#C49B6C", // matches seed accentColor
  // helpers
  rule: "rgba(42,31,26,0.16)",
  ruleStrong: "rgba(42,31,26,0.32)",
  inkSoft: "rgba(42,31,26,0.78)",
  inkMuted: "rgba(42,31,26,0.55)",
} as const;

// Silhouette fragments — reused across cards.

// Scalloped TOP edge (sawtooth approximation that reads as lace/handkerchief).
// Use as the top portion of a polygon clip-path; close with the bottom edge yourself.
export const SCALLOP_TOP = [
  "0 14px",
  "6.25% 0", "12.5% 14px",
  "18.75% 0", "25% 14px",
  "31.25% 0", "37.5% 14px",
  "43.75% 0", "50% 14px",
  "56.25% 0", "62.5% 14px",
  "68.75% 0", "75% 14px",
  "81.25% 0", "87.5% 14px",
  "93.75% 0", "100% 14px",
].join(",");

// Arched (low-rise) TOP edge — invitation card silhouette.
export const ARCH_TOP = [
  "0 26px",
  "8% 14px", "18% 6px",
  "32% 1px", "50% 0",
  "68% 1px", "82% 6px",
  "92% 14px", "100% 26px",
].join(",");

// Scalloped BOTTOM edge — petal/handkerchief feel.
export const SCALLOP_BOTTOM = [
  "100% calc(100% - 14px)",
  "93.75% 100%", "87.5% calc(100% - 14px)",
  "81.25% 100%", "75% calc(100% - 14px)",
  "68.75% 100%", "62.5% calc(100% - 14px)",
  "56.25% 100%", "50% calc(100% - 14px)",
  "43.75% 100%", "37.5% calc(100% - 14px)",
  "31.25% 100%", "25% calc(100% - 14px)",
  "18.75% 100%", "12.5% calc(100% - 14px)",
  "6.25% 100%", "0 calc(100% - 14px)",
].join(",");

// Full silhouettes used directly in clipPath:
export const HANDKERCHIEF_CLIP = `polygon(${SCALLOP_TOP}, 100% 14px, ${SCALLOP_BOTTOM}, 0 14px)`;
export const INVITATION_CLIP = `polygon(${ARCH_TOP}, 100% 26px, 100% 100%, 0 100%)`;
// Petal (arch top + scalloped bottom): for the booking patronage cards.
export const PETAL_CLIP = `polygon(${ARCH_TOP}, 100% 26px, ${SCALLOP_BOTTOM}, 0 26px)`;
