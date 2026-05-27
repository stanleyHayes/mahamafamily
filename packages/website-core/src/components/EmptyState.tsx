import { Box, Typography, Button, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { SubjectKey } from "@mahama/shared-types";

interface EmptyStateProps {
  subject: SubjectKey;
  eyebrow?: string;
  title: string;
  body?: string;
  ctaLabel?: string;
  ctaTo?: string;
  variant?: "minimal" | "illustrated";
}

const SUBJECT_VOICE: Record<SubjectKey, { eyebrow: string; tone: "industrial" | "civic" | "ring"} > = {
  ibrahim: { eyebrow: "Note from the Office", tone: "industrial" },
  john: { eyebrow: "From the Desk", tone: "civic" },
  sharaf: { eyebrow: "Standing By", tone: "ring" },
  lordina: { eyebrow: "From the Foundation", tone: "civic" },
};

export function EmptyState({ subject, eyebrow, title, body, ctaLabel, ctaTo, variant = "minimal" }: EmptyStateProps) {
  const voice = SUBJECT_VOICE[subject] ?? SUBJECT_VOICE.ibrahim!;
  const isRing = voice.tone === "ring";
  const isCivic = voice.tone === "civic";

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 3, md: 6 },
        textAlign: "center",
        border: "1px solid",
        borderColor: "divider",
        position: "relative",
        overflow: "hidden",
        background: isRing ? "rgba(11,11,11,0.04)" : isCivic ? "rgba(11,79,44,0.03)" : "rgba(201,162,39,0.04)",
      }}
    >
      {/* Decorative side markings — different per tone */}
      {variant === "illustrated" && (
        <>
          <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: (t) => t.palette.secondary.main, opacity: 0.6 }} />
          <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: (t) => t.palette.secondary.main, opacity: 0.3 }} />
        </>
      )}

      <Typography
        sx={{
          fontSize: 11,
          letterSpacing: "0.36em",
          textTransform: "uppercase",
          color: "secondary.main",
          mb: 2,
          fontFamily: isRing ? '"Bebas Neue", sans-serif' : isCivic ? '"Inter", sans-serif' : '"IBM Plex Mono", monospace',
          fontWeight: isCivic ? 700 : 400,
        }}
      >
        {eyebrow ?? voice.eyebrow}
      </Typography>

      <Typography
        sx={{
          fontFamily: isRing ? '"Bebas Neue", sans-serif' : '"Playfair Display", serif',
          fontSize: { xs: 32, md: 48 },
          lineHeight: 1.1,
          maxWidth: 720,
          mx: "auto",
          fontWeight: 500,
        }}
      >
        {title}
      </Typography>

      {body && (
        <Typography
          sx={{
            mt: 2.5,
            fontSize: 17,
            lineHeight: 1.65,
            color: "text.secondary",
            maxWidth: 580,
            mx: "auto",
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: isRing ? "normal" : "italic",
          }}
        >
          {body}
        </Typography>
      )}

      {ctaLabel && ctaTo && (
        <Stack direction="row" justifyContent="center" sx={{ mt: 5 }}>
          <Button
            component={RouterLink}
            to={ctaTo}
            variant="outlined"
            sx={{
              borderRadius: 0,
              px: 4,
              py: 1.4,
              borderColor: "secondary.main",
              color: "secondary.main",
              fontFamily: isRing ? '"Bebas Neue", sans-serif' : '"Inter", sans-serif',
              fontSize: isRing ? 16 : 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 600,
              "&:hover": { background: "secondary.main", color: "background.paper" },
            }}
          >
            {ctaLabel}
          </Button>
        </Stack>
      )}
    </Box>
  );
}
