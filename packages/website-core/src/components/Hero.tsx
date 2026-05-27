import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { OptimizedImage } from "./OptimizedImage.js";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import type { ProfileDTO, SubjectKey } from "@mahama/shared-types";
import { resolveLocalized } from "@mahama/shared-types";

export function Hero({
  profile,
  subject,
  labels,
}: {
  profile?: ProfileDTO | null;
  subject: SubjectKey;
  labels: Record<SubjectKey, { name: string; role: string; tagline: string} >;
}) {
  const fallback = labels[subject];
  const name = resolveLocalized(profile?.fullName) || fallback.name;
  const role = resolveLocalized(profile?.title) || fallback.role;
  const tagline = resolveLocalized(profile?.tagline) || fallback.tagline;
  const image = profile?.heroImageUrl;

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: "min(640px, 100vh)", md: 760 },
        color: (t) => t.palette.common.white,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: (t) => `linear-gradient(135deg, ${t.palette.primary.main} 0%, #000 100%)`,
      }}
    >
      {image && (
        <OptimizedImage
          src={image}
          alt={name}
          sx={{ position: "absolute", inset: 0 }}
          imgSx={{ opacity: 0.42 }}
        />
      )}
      <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.65) 100%)" }} />
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Typography
            sx={{
              color: "secondary.main",
              fontFamily: '"Inter", sans-serif',
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              fontSize: 13,
              mb: 2,
            }}
          >
            🇬🇭 Republic of Ghana
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: 48, md: 84 },
              lineHeight: 1.05,
              maxWidth: 920,
              fontWeight: 700,
            }}
          >
            {name}
          </Typography>
          <Typography sx={{ mt: 3, fontSize: { xs: 18, md: 22 }, opacity: 0.92, maxWidth: 700 }}>
            {role}
          </Typography>
          <Typography sx={{ mt: 4, fontStyle: "italic", fontSize: 18, opacity: 0.88, maxWidth: 640, fontFamily: '"Cormorant Garamond", serif' }}>
            "{tagline}"
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 6 }}>
            <Button component={RouterLink} to="/about" size="large" variant="contained" color="secondary">
              Read the story
            </Button>
            <Button
              component={RouterLink}
              to="/contact"
              size="large"
              variant="outlined"
              sx={{
                color: "common.white",
                borderColor: "rgba(255,255,255,0.6)",
                "&:hover": { borderColor: "common.white", background: "rgba(255,255,255,0.08)" },
              }}
            >
              Get in touch
            </Button>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}
