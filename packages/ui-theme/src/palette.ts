// Ghana-inspired colour palettes per subject.
// Ghana flag colours: red #CE1126, gold #FCD116, green #006B3F, black #000000.

export const ghanaFlag = {
  red: "#CE1126",
  gold: "#FCD116",
  green: "#006B3F",
  black: "#000000",
};

// `surface` becomes `background.default` (the <body> bg). It must match the
// dominant background of each subject's pages, otherwise body shows through any
// gap. Ibrahim & Sharaf use dark page bg → dark surface; John & Lordina ivory.
export const palettes = {
  ibrahim: {
    primary: "#0E1116",
    secondary: "#C9A227",
    accent: "#7A1F1F",
    surface: "#08090C",
    text: "#F2EDE2",
  },
  john: {
    primary: "#0B4F2C",
    secondary: "#D4AF37",
    accent: "#8E1B25",
    surface: "#FBF8F1",
    text: "#0F1A14",
  },
  sharaf: {
    primary: "#1A1A1A",
    secondary: "#E0B73A",
    accent: "#D62828",
    surface: "#0B0B0B",
    text: "#F4F1ED",
  },
  lordina: {
    // First Lady — editorial civic-feminine: deep wine + rose-gold + cream
    primary: "#7B2335",
    secondary: "#C49B6C",
    accent: "#0B4F2C",
    surface: "#F8F2EA",
    text: "#231419",
  },
} as const;

export type SubjectPaletteKey = keyof typeof palettes;
