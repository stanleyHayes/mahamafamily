import { Box, Container, Typography, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@mahama/i18n";
import { api } from "../../config.js";
import { KenteStripe, BlackStar, GyeNyame } from "@mahama/website-core";
import { NewsletterSignup, trackEvent } from "@mahama/website-core";

export function JohnFooter() {
  const { t } = useTranslation();
  const settings = useQuery({ queryKey: ["settings"], queryFn: () => api.getSettings() });
  const year = new Date().getFullYear();

  const LINKS = [
    { to: "/about", label: t("nav.biography") },
    { to: "/ventures", label: t("nav.theAgenda") },
    { to: "/impact", label: t("nav.publicService") },
    { to: "/events", label: t("nav.engagements") },
    { to: "/news", label: t("nav.press") },
    { to: "/book", label: t("nav.audience") },
  ];

  return (
    <Box component="footer" sx={{ mt: 16 }}>
      <KenteStripe height={6} />

      {/* Single-page proclamation: signature dominates */}
      <Box sx={{ background: "#0B4F2C", color: "#FBF8F1", py: { xs: 8, md: 12 }, position: "relative", overflow: "hidden" }}>
        {/* Faint star watermark */}
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", opacity: 0.05, pointerEvents: "none" }}>
          <BlackStar size={520} color="#D4AF37" />
        </Box>

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          {/* Salutation */}
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={3} sx={{ mb: 4 }}>
            <Box sx={{ flex: 1, height: "1px", background: "rgba(212,175,55,0.4)" }} />
            <GyeNyame size={28} color="#D4AF37" />
            <Typography sx={{ fontSize: 10, letterSpacing: "0.5em", color: "#D4AF37", textTransform: "uppercase", fontFamily: '"Inter", sans-serif', fontWeight: 600 }}>
              {t("footer.fromTheDeskOf")}
            </Typography>
            <GyeNyame size={28} color="#D4AF37" />
            <Box sx={{ flex: 1, height: "1px", background: "rgba(212,175,55,0.4)" }} />
          </Stack>

          {/* Signature — handwritten feel */}
          <Typography sx={{
            fontFamily: '"Cormorant Garamond", "Playfair Display", serif',
            fontStyle: "italic",
            fontSize: { xs: 56, sm: 80, md: 110 },
            lineHeight: 0.95,
            color: "#FBF8F1",
            fontWeight: 500,
          }}>
            John Dramani<br />Mahama.
          </Typography>

          <Box sx={{ mt: 3, display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
            <Box sx={{ height: 2, width: 240, background: "#D4AF37" }} />
            <Typography sx={{ mt: 2, fontFamily: '"Inter", sans-serif', fontSize: 11, letterSpacing: "0.4em", color: "#D4AF37", textTransform: "uppercase", fontWeight: 700 }}>
              {t("footer.presidentOfGhana")}
            </Typography>
          </Box>

          {/* Single quote */}
          <Typography sx={{
            mt: 7,
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: "italic",
            fontSize: { xs: 18, md: 22 },
            lineHeight: 1.5,
            opacity: 0.86,
            maxWidth: 620,
            mx: "auto",
          }}>
            "I have heard you loud and clear. The work begins immediately."
          </Typography>
          <Typography sx={{ mt: 1.5, fontSize: 10, letterSpacing: "0.36em", color: "rgba(212,175,55,0.85)", textTransform: "uppercase", fontFamily: '"Inter", sans-serif' }}>
            {t("footer.acceptance")}
          </Typography>
        </Container>
      </Box>

      {/* Ivory base — minimal civic links + colophon */}
      <Box sx={{ background: "#FBF8F1", color: "#0F1A14", py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 3, maxWidth: 360 }}>
            <NewsletterSignup
              onSubscribe={async (email) => {
                await api.subscribeNewsletter({ email, source: window.location.hostname });
                trackEvent("newsletter_subscribed");
              }}
            />
          </Box>
          <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }} spacing={3} >
            {/* Inline link list — like a state document footer */}
            <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
              {LINKS.map((l) => (
                <Box
                  key={l.to}
                  component={RouterLink}
                  to={l.to}
                  sx={{
                    color: "#0F1A14",
                    textDecoration: "none",
                    fontFamily: '"DM Serif Display", "Playfair Display", serif',
                    fontSize: 15,
                    "&:hover": { color: "#0B4F2C" },
                  }}
                >
                  {l.label}
                </Box>
              ))}
            </Stack>
            <Box sx={{ flex: 1 }} />
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ fontFamily: '"Inter", sans-serif', fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(15,26,20,0.55)" }}>
              <span>{t("footer.jubileeHouse")}</span>
              <Box sx={{ width: 4, height: 4, borderRadius: "50%", background: "#D4AF37" }} />
              <span>© {year}</span>
              {settings.data?.contactEmail && (
                <>
                  <Box sx={{ width: 4, height: 4, borderRadius: "50%", background: "#D4AF37" }} />
                  <Box component="a" href={`mailto:${settings.data.contactEmail}`} sx={{ color: "inherit", textDecoration: "none", "&:hover": { color: "#0B4F2C" } }}>
                    {settings.data.contactEmail}
                  </Box>
                </>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>

      <KenteStripe height={4} />
    </Box>
  );
}
