import { useState } from "react";
import { Button, Menu, MenuItem, ListItemText, ListItemIcon, Box } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import CheckIcon from "@mui/icons-material/Check";
import { LANGUAGES, useTranslation } from "@mahama/i18n";

export function LanguagePicker({ light = false }: { light?: boolean }) {
  const { i18n } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const current = i18n.language?.slice(0, 2) ?? "en";
  const currentLabel = LANGUAGES.find((l) => l.code === current)?.code.toUpperCase() ?? "EN";

  return (
    <>
      <Button
        size="small"
        onClick={(e) => setAnchor(e.currentTarget)}
        aria-haspopup="true"
        aria-expanded={!!anchor}
        aria-controls={anchor ? "language-menu" : undefined}
        startIcon={<LanguageIcon sx={{ fontSize: "16px !important" }} />}
        sx={{
          minWidth: 0,
          color: light ? "rgba(255,255,255,0.7)" : "inherit",
          fontFamily: '"Inter", sans-serif',
          fontSize: 11,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          px: 1,
          py: 0.5,
          borderRadius: 0,
          "&:hover": { background: "transparent", color: light ? "#fff" : "primary.main" },
        }}
      >
        {currentLabel}
      </Button>
      <Menu
        id="language-menu"
        open={!!anchor}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 0,
              minWidth: 180,
              border: "1px solid",
              borderColor: light ? "rgba(255,255,255,0.16)" : "divider",
            },
          },
        }}
      >
        {LANGUAGES.map((l) => (
          <MenuItem
            key={l.code}
            selected={current === l.code}
            onClick={() => { i18n.changeLanguage(l.code); setAnchor(null); }}
            sx={{ py: 1 }}
          >
            <ListItemIcon sx={{ minWidth: 28 }}>
              {current === l.code ? <CheckIcon fontSize="small" /> : <Box sx={{ width: 16 }} />}
            </ListItemIcon>
            <ListItemText
              primary={l.nativeLabel}
              secondary={l.label !== l.nativeLabel ? l.label : null}
              primaryTypographyProps={{ fontSize: 14 }}
              secondaryTypographyProps={{ fontSize: 11 }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
