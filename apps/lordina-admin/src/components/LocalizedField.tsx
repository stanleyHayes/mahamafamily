import { useState } from "react";
import { Box, Tabs, Tab, TextField, Typography } from "@mui/material";
import type { LocalizedString, SupportedLang } from "@mahama/shared-types";
import { localize } from "@mahama/shared-types";
import { RichTextEditor } from "./RichTextEditor.js";

const LANGS: { code: SupportedLang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "tw", label: "TW" },
  { code: "ha", label: "HA" },
  { code: "ee", label: "EE" },
  { code: "fr", label: "FR" },
];

interface LocalizedFieldProps {
  label: string;
  value: LocalizedString | string | undefined | null;
  onChange: (value: LocalizedString) => void;
  multiline?: boolean;
  minRows?: number;
  richText?: boolean;
  placeholder?: string;
  required?: boolean;
}

export function LocalizedField({
  label,
  value,
  onChange,
  multiline,
  minRows,
  richText,
  placeholder,
  required,
}: LocalizedFieldProps) {
  const [tab, setTab] = useState<SupportedLang>("en");
  const localized = localize(value);

  const setLang = (lang: SupportedLang, text: string) => {
    onChange({ ...localized, [lang]: text });
  };

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
        {label}
      </Typography>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ minHeight: 36, mb: 1, "& .MuiTabs-flexContainer": { gap: 0.5 } }}
      >
        {LANGS.map((l) => (
          <Tab
            key={l.code}
            value={l.code}
            label={l.label}
            sx={{
              minHeight: 28,
              py: 0.25,
              px: 1.5,
              fontSize: 12,
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 1,
              bgcolor: tab === l.code ? "action.selected" : "transparent",
            }}
          />
        ))}
      </Tabs>
      {richText ? (
        <RichTextEditor
          value={localized[tab] ?? ""}
          onChange={(html) => setLang(tab, html)}
          placeholder={placeholder ?? `${label} (${tab.toUpperCase()})`}
        />
      ) : (
        <TextField
          fullWidth
          multiline={multiline}
          minRows={minRows}
          required={required && tab === "en"}
          value={localized[tab] ?? ""}
          onChange={(e) => setLang(tab, e.target.value)}
          placeholder={placeholder ?? `${label} (${tab.toUpperCase()})`}
        />
      )}
    </Box>
  );
}
