import { createTheme, type Theme } from "@mui/material/styles";
import { palettes, type SubjectPaletteKey } from "./palette.js";
import { subjectTokens } from "./tokens.js";

export function buildTheme(subject: SubjectPaletteKey, mode: "light" | "dark" = "light"): Theme {
  const p = palettes[subject];
  const t = subjectTokens[subject];
  return createTheme({
    palette: {
      mode,
      primary: { main: p.primary, contrastText: "#fff" },
      secondary: { main: p.secondary, contrastText: "#1a1a1a" },
      error: { main: p.accent },
      background:
        mode === "light"
          ? { default: p.surface, paper: "#ffffff" }
          : { default: "#0a0a0a", paper: "#13141a" },
      text:
        mode === "light"
          ? { primary: p.text, secondary: "#4a4f57" }
          : { primary: "#f4f4f4", secondary: "#b8babf" },
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: t.headingFont,
      h1: { fontFamily: t.headingFont, fontWeight: t.headingWeight, letterSpacing: "-0.02em" },
      h2: { fontFamily: t.headingFont, fontWeight: t.headingWeight, letterSpacing: t.headingLetterSpacing },
      h3: { fontFamily: t.headingFont, fontWeight: t.headingWeight },
      h4: { fontFamily: t.headingFont, fontWeight: t.headingWeight },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      body1: { fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif', fontSize: "1.05rem", lineHeight: 1.7 },
      body2: { fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif' },
      button: { fontFamily: '"Inter", sans-serif', textTransform: "none", fontWeight: 600, letterSpacing: "0.02em" },
      overline: { fontFamily: '"Inter", sans-serif', letterSpacing: "0.16em" },
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 999, paddingInline: 24, paddingBlock: 10 },
          containedPrimary: { boxShadow: "0 6px 22px rgba(0,0,0,0.18)" },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0, color: "transparent" },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: { borderRadius: 18 },
        },
      },
    },
  });
}

export const themePresets = {
  ibrahim: { light: buildTheme("ibrahim", "light"), dark: buildTheme("ibrahim", "dark") },
  john: { light: buildTheme("john", "light"), dark: buildTheme("john", "dark") },
  sharaf: { light: buildTheme("sharaf", "light"), dark: buildTheme("sharaf", "dark") },
  lordina: { light: buildTheme("lordina", "light"), dark: buildTheme("lordina", "dark") },
};
