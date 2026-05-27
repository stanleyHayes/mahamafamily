import { IconButton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useThemeMode } from "./ThemeModeProvider.js";

export function DarkModeToggle({ light = false }: { light?: boolean }) {
  const { mode, toggleMode } = useThemeMode();
  return (
    <IconButton
      onClick={toggleMode}
      aria-label={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
      sx={{
        color: light ? "rgba(255,255,255,0.7)" : "inherit",
        "&:hover": { color: light ? "#fff" : "primary.main" },
      }}
    >
      {mode === "light" ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
    </IconButton>
  );
}
