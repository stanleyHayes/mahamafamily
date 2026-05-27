import type { SubjectPaletteKey } from "./palette.js";

// Per-subject typographic tokens. Heading fonts are loaded site-wide in each
// app's index.html — keep this set in sync if you add a subject.
export const subjectTokens: Record<SubjectPaletteKey, {
  headingFont: string;
  headingWeight: number;
  headingLetterSpacing: string;
  eyebrowLetterSpacing: string;
}> = {
  ibrahim: {
    headingFont: '"IBM Plex Serif", "Playfair Display", Georgia, serif',
    headingWeight: 600,
    headingLetterSpacing: "-0.01em",
    eyebrowLetterSpacing: "0.18em",
  },
  john: {
    headingFont: '"Playfair Display", Georgia, serif',
    headingWeight: 700,
    headingLetterSpacing: "-0.02em",
    eyebrowLetterSpacing: "0.18em",
  },
  sharaf: {
    headingFont: '"Playfair Display", Georgia, serif',
    headingWeight: 700,
    headingLetterSpacing: "-0.01em",
    eyebrowLetterSpacing: "0.22em",
  },
  lordina: {
    headingFont: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
    headingWeight: 500,
    headingLetterSpacing: "-0.01em",
    eyebrowLetterSpacing: "0.32em",
  },
};
