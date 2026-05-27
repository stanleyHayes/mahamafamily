import { Box, Container, Typography, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@mahama/i18n";
import { api } from "../../config.js";
import { LordinaLotus, RoseGoldStripe } from "@mahama/website-core";
import { NewsletterSignup, trackEvent } from "@mahama/website-core";

export function LordinaFooter() {
  const { t } = useTranslation();
  const settings = useQuery({ queryKey: ["settings"], queryFn: () => api.getSettings() });
  const year = new Date().getFullYear();

  const LINKS = [
    { to: "/about", label: t("nav.biography") },
    { to: "/ventures", label: t("nav.foundation") },
    { to: "/impact", label: t("nav.programmes") },
    { to: "/events", label: t("nav.engagements") },
    { to: "/news", label: t("nav.press") },
    { to: "/book", label: t("nav.connect") },
  ];

  return (
    <Box component="footer" sx={{ mt: 16 }}>
      <RoseGoldStripe height={5} />

      {/* Single-page proclamation: signature + lotus crest */}
      <Box sx={{ background: "#7B2335", color: "#F8F2EA", py: { xs: 8, md: 12 }, position: "relative", overflow: "hidden" }}>
        {/* Faint lotus watermark */}
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", opacity: 0.07, pointerEvents: "none" }}>
          <LordinaLotus size={520} color="#E7C9A5" />
        </Box>

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          {/* Salutation */}
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={3} sx={{ mb: 4 }}>
            <Box sx={{ flex: 1, height: "1px", background: "rgba(196,155,108,0.45)" }} />
            <LordinaLotus size={28} color="#C49B6C" />
            <Typography sx={{ fontSize: 10, letterSpacing: "0.5em", color: "#C49B6C", textTransform: "uppercase", fontFamily: '"Inter", sans-serif', fontWeight: 600 }}>
              {t("footer.withCompliments")}
            </Typography>
            <LordinaLotus size={28} color="#C49B6C" />
            <Box sx={{ flex: 1, height: "1px", background: "rgba(196,155,108,0.45)" }} />
          </Stack>

          {/* Signature — handwritten feel */}
          <Typography sx={{
            fontFamily: '"Cormorant Garamond", "Playfair Display", serif',
            fontStyle: "italic",
            fontSize: { xs: 56, sm: 80, md: 110 },
            lineHeight: 0.95,
            color: "#F8F2EA",
            fontWeight: 500,
          }}>
            Lordina<br />Mahama.
          </Typography>

          <Box sx={{ mt: 3, display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
            <Box sx={{ height: 2, width: 240, background: "#C49B6C" }} />
            <Typography sx={{ mt: 2, fontFamily: '"Inter", sans-serif', fontSize: 11, letterSpacing: "0.4em", color: "#C49B6C", textTransform: "uppercase", fontWeight: 700 }}>
              {t("footer.firstLadyOfGhana")}
            </Typography>
            <Typography sx={{ mt: 0.6, fontFamily: '"Inter", sans-serif', fontSize: 10, letterSpacing: "0.32em", color: "rgba(231,201,165,0.78)", textTransform: "uppercase" }}>
              {t("footer.foundationFounder")}
            </Typography>
          </Box>

          {/* Single quote */}
          <Typography sx={{
            mt: 7,
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: "italic",
            fontSize: { xs: 18, md: 22 },
            lineHeight: 1.5,
            opacity: 0.9,
            maxWidth: 620,
            mx: "auto",
          }}>
            "{t("lordina.signatureQuote")}"
          </Typography>
          <Typography sx={{ mt: 1.5, fontSize: 10, letterSpacing: "0.36em", color: "rgba(196,155,108,0.85)", textTransform: "uppercase", fontFamily: '"Inter", sans-serif' }}>
            {t("footer.foundationEst")}
          </Typography>
        </Container>
      </Box>

      {/* Cream base — civic links + colophon (two centered rows) */}
      <Box sx={{ background: "#F8F2EA", color: "#2A1418", py: { xs: 4, md: 5 } }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 3, maxWidth: 360, mx: "auto" }}>
            <NewsletterSignup
              onSubscribe={async (email) => {
                await api.subscribeNewsletter({ email, source: window.location.hostname });
                trackEvent("newsletter_subscribed");
              }}
            />
          </Box>
          <Stack
            direction="row"
            spacing={{ xs: 2, md: 4 }}
            rowGap={1.5}
            flexWrap="wrap"
            useFlexGap
            justifyContent="center"
            sx={{ mb: 2.5 }}
          >
            {LINKS.map((l) => (
              <Box
                key={l.to}
                component={RouterLink}
                to={l.to}
                sx={{
                  color: "#2A1418",
                  textDecoration: "none",
                  fontFamily: '"DM Serif Display", "Playfair Display", serif',
                  fontSize: 15,
                  whiteSpace: "nowrap",
                  "&:hover": { color: "#7B2335" },
                }}
              >
                {l.label}
              </Box>
            ))}
          </Stack>

          <Box sx={{ height: 1, background: "rgba(123,35,53,0.14)", maxWidth: 220, mx: "auto", mb: 2.5 }} />

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1.5}
            rowGap={1}
            flexWrap="wrap"
            useFlexGap
            sx={{ fontFamily: '"Inter", sans-serif', fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(42,20,24,0.6)", textAlign: "center" }}
          >
            <Box component="span" sx={{ whiteSpace: "nowrap" }}>{t("footer.officeOfFirstLady")}</Box>
            <Box sx={{ width: 4, height: 4, borderRadius: "50%", background: "#C49B6C" }} />
            <Box component="span" sx={{ whiteSpace: "nowrap" }}>© {year}</Box>
            {settings.data?.contactEmail && (
              <>
                <Box sx={{ width: 4, height: 4, borderRadius: "50%", background: "#C49B6C" }} />
                <Box
                  component="a"
                  href={`mailto:${settings.data.contactEmail}`}
                  sx={{ color: "inherit", textDecoration: "none", whiteSpace: "nowrap", "&:hover": { color: "#7B2335" } }}
                >
                  {settings.data.contactEmail}
                </Box>
              </>
            )}
          </Stack>
        </Container>
      </Box>

      <RoseGoldStripe height={3} />
    </Box>
  );
}

export default LordinaFooter;
