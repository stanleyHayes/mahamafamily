import { Box, Container, Typography, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@mahama/i18n";
import { api } from "../../config.js";
import { HalftoneDots, BoxingGloves } from "@mahama/website-core";
import { NewsletterSignup, trackEvent } from "@mahama/website-core";

export function SharafFooter() {
  const { t } = useTranslation();
  const events = useQuery({ queryKey: ["events"], queryFn: () => api.listEvents() });
  const year = new Date().getFullYear();

  // Sort events by date ascending; pick the next upcoming one as the "billboard" main event
  const sorted = [...(events.data ?? [])].sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt));
  const billboard = sorted.find((e) => +new Date(e.startsAt) > Date.now()) ?? sorted[0];
  const upcoming = sorted.filter((e) => e !== billboard).slice(0, 3);

  return (
    <Box component="footer" sx={{ mt: 14, background: "#0B0B0B", color: "#F4F1ED", position: "relative", overflow: "hidden" }}>
      <HalftoneDots color="rgba(255,255,255,0.04)" />

      {/* Diagonal red strap — "MAIN EVENT" */}
      <Box sx={{ background: "#D62828", color: "#0B0B0B", py: 1, transform: "skewY(-1deg)", mt: 4, mx: -2 }}>
        <Box sx={{ transform: "skewY(1deg)", textAlign: "center", fontFamily: '"Bebas Neue", sans-serif', fontSize: 18, letterSpacing: "0.4em", fontWeight: 700 }}>
          {t("footer.mainEvent")}
        </Box>
      </Box>

      {/* Billboard centre — vertical fight-poster lockup */}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: { xs: 8, md: 12 } }}>
        <Stack direction={{ xs: "column", md: "row" }} alignItems="center" spacing={{ xs: 6, md: 0 }}>
          {/* Left: rotated boxing glove */}
          <Box sx={{ display: { xs: "none", md: "block" }, flex: 1, transform: "rotate(-14deg)", opacity: 0.92 }}>
            <BoxingGloves size={220} color="#E0B73A" />
          </Box>

          {/* Centre billboard */}
          <Box sx={{ flex: 2, textAlign: "center", py: { xs: 2, md: 0 } }}>
            {billboard ? (
              <>
                <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: 28, md: 40 }, color: "#E0B73A", letterSpacing: "0.32em", lineHeight: 1, mb: 2 }}>
                  {new Date(billboard.startsAt).toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase()}
                </Typography>
                <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: 80, md: 140 }, lineHeight: 0.85, color: "#F4F1ED" }}>
                  {new Date(billboard.startsAt).getDate()}
                </Typography>
                <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: 32, md: 48 }, color: "#F4F1ED", letterSpacing: "0.18em", mt: 1 }}>
                  {new Date(billboard.startsAt).toLocaleDateString("en-GB", { month: "long" }).toUpperCase()}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, my: 4 }}>
                  <Box sx={{ flex: 1, maxWidth: 80, height: 2, background: "#E0B73A" }} />
                  <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 16, letterSpacing: "0.4em", color: "#D62828", fontWeight: 700 }}>VS.</Typography>
                  <Box sx={{ flex: 1, maxWidth: 80, height: 2, background: "#E0B73A" }} />
                </Box>

                <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: 28, md: 44 }, color: "#F4F1ED", lineHeight: 1.1, letterSpacing: "0.04em", maxWidth: 540, mx: "auto" }}>
                  {billboard.title}
                </Typography>
                <Typography sx={{ mt: 2, fontFamily: '"Inter", sans-serif', fontSize: 12, letterSpacing: "0.32em", color: "#E0B73A", textTransform: "uppercase", fontWeight: 600 }}>
                  {billboard.venue} · {billboard.city}
                </Typography>
              </>
            ) : (
              <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 64, color: "#E0B73A", letterSpacing: "0.04em", whiteSpace: "pre-line" }}>
                {t("footer.nextCardSoon")}
              </Typography>
            )}
          </Box>

          {/* Right: undercard list */}
          <Box sx={{ display: { xs: "block", md: "block" }, flex: 1, width: { xs: "100%", md: "auto" } }}>
            <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 14, letterSpacing: "0.4em", color: "#D62828", mb: 2, fontWeight: 700 }}>
              {t("footer.undercard")}
            </Typography>
            <Stack divider={<Box sx={{ borderTop: "1px solid rgba(224,183,58,0.18)" }} />}>
              {upcoming.length ? upcoming.map((e) => (
                <Stack key={e.id} direction="row" alignItems="baseline" spacing={2} sx={{ py: 1.6 }}>
                  <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 22, color: "#E0B73A", letterSpacing: "0.04em", minWidth: 60 }}>
                    {new Date(e.startsAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).toUpperCase()}
                  </Typography>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "rgba(244,241,237,0.78)" }}>
                    {e.title}
                  </Typography>
                </Stack>
              )) : (
                <Typography sx={{ fontSize: 13, opacity: 0.5, fontFamily: '"Inter", sans-serif' }}>
                  {t("footer.noUndercard")}
                </Typography>
              )}
            </Stack>
          </Box>
        </Stack>
      </Container>

      {/* Side stencil text */}
      <Box sx={{
        position: "absolute",
        right: -10,
        top: "30%",
        transform: "rotate(90deg)",
        transformOrigin: "right top",
        fontFamily: '"Bebas Neue", sans-serif',
        fontSize: 14,
        letterSpacing: "0.6em",
        color: "rgba(224,183,58,0.4)",
        display: { xs: "none", lg: "block" },
        pointerEvents: "none",
      }}>
        BUKOM · ACCRA · GHANA · WEST AFRICA RISING
      </Box>

      {/* Marquee at very bottom */}
      <Box sx={{ background: "#E0B73A", color: "#0B0B0B", py: 1, overflow: "hidden", borderTop: "2px solid #D62828" }}>
        <Box sx={{
          display: "flex", whiteSpace: "nowrap", animation: "marquee 36s linear infinite",
          fontFamily: '"Bebas Neue", sans-serif', fontSize: 14, letterSpacing: "0.32em",
          "& span": { px: 4 },
          "@keyframes marquee": { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
          '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        }}>
          {Array(2).fill(0).map((_, i) => (
            <Box key={i} sx={{ display: "flex" }}>
              <span>★ Bukom</span><span>★ Battle of the Beasts</span><span>★ The Showdown</span>
              <span>★ Anthony Joshua</span><span>★ Amir Khan</span><span>★ Allotey</span>
              <span>★ Legacy Rise</span><span>★ Accra · Ghana</span>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ background: "#0B0B0B", borderTop: "1px solid rgba(224,183,58,0.2)", py: 3 }}>
        <Container maxWidth="xl">
          <Box sx={{ maxWidth: 360 }}>
            <NewsletterSignup
              onSubscribe={async (email) => {
                await api.subscribeNewsletter({ email, source: window.location.hostname });
                trackEvent("newsletter_subscribed");
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Final tiny strip */}
      <Box sx={{ background: "#0B0B0B", color: "rgba(244,241,237,0.4)", py: 1.5, fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", fontFamily: '"Bebas Neue", sans-serif" ' }}>
        <Container maxWidth="xl">
          <Stack direction="row" alignItems="center" flexWrap="wrap" spacing={3} sx={{ rowGap: 1 }}>
            <span>© {year} {t("footer.legacyRiseSports")}</span>
            <Box sx={{ flex: 1 }} />
            <Box component={RouterLink} to="/about" sx={{ color: "inherit", textDecoration: "none", "&:hover": { color: "#E0B73A" } }}>{t("nav.profile")}</Box>
            <Box component={RouterLink} to="/ventures" sx={{ color: "inherit", textDecoration: "none", "&:hover": { color: "#E0B73A" } }}>{t("nav.legacyrise")}</Box>
            <Box component={RouterLink} to="/impact" sx={{ color: "inherit", textDecoration: "none", "&:hover": { color: "#E0B73A" } }}>{t("nav.foundation")}</Box>
            <Box component={RouterLink} to="/book" sx={{ color: "inherit", textDecoration: "none", "&:hover": { color: "#E0B73A" } }}>{t("nav.bookTime")}</Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
