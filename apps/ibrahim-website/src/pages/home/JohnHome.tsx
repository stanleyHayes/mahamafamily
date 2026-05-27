import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@mahama/i18n";
import { Box, Container, Typography, Stack, Grid, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Seo, OptimizedImage, HeroSkeleton, KenteStripe, BlackStar, GyeNyame, Sankofa, QueryError, PersonSchema, BreadcrumbSchema } from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;

export function JohnHome() {
  const { i18n } = useTranslation();
  const profile = useQuery({ queryKey: ["profile"], queryFn: () => api.getProfile() });
  const ventures = useQuery({ queryKey: ["ventures"], queryFn: () => api.listVentures() });
  const events = useQuery({ queryKey: ["events"], queryFn: () => api.listEvents() });
  const quotes = useQuery({ queryKey: ["quotes"], queryFn: () => api.listQuotes() });

  if (profile.isLoading) return <HeroSkeleton />;
  if (profile.isError) return <QueryError message="Unable to load profile." onRetry={() => profile.refetch()} />;
  const p = profile.data;
  const featuredQuote = quotes.data?.find((q) => q.featured) ?? quotes.data?.[0];
  const upcomingEvents = (events.data ?? []).slice(0, 3);
  const flagshipPolicies = (ventures.data ?? []).filter((v) => v.featured).slice(0, 3);

  return (
    <Box sx={{ background: "#FBF8F1", color: "#0F1A14" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="President of the Republic of Ghana"  />
      {p && <PersonSchema profile={p} baseUrl={window.location.origin} />}
      <BreadcrumbSchema items={[{ name: "Home", path: "/" }]} baseUrl={window.location.origin} />

      {/* Hero — state portrait album */}
      <Box sx={{ position: "relative", py: { xs: 8, md: 12 }, background: "linear-gradient(180deg, #FBF8F1 0%, #f4f0e1 100%)" }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            {/* Left: ceremonial title block */}
            <Grid item xs={12} md={7} >
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <BlackStar size={20} color="#0B4F2C" />
                  <Typography sx={{ fontSize: 11, letterSpacing: "0.5em", color: "#8E1B25", textTransform: "uppercase", fontWeight: 700 }}>
                    His Excellency
                  </Typography>
                  <Box sx={{ flex: 1, height: "1px", background: "#0B4F2C", opacity: 0.4, maxWidth: 100 }} />
                </Stack>
                <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: { xs: 56, md: 96 }, lineHeight: 0.95, color: "#0B4F2C", mb: 2 }}>
                  John Dramani<br />Mahama.
                </Typography>
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 20, md: 24 }, color: "#1a261d", maxWidth: 560, mb: 4 }}>
                  {p?.title}
                </Typography>
                <Box sx={{ height: 2, width: 200, background: "#D4AF37", mb: 4 }} />
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 18, md: 22 }, color: "rgba(15,26,20,0.78)", maxWidth: 560, mb: 4 }}>
                  "{p?.tagline ?? "The work begins immediately."}"
                </Typography>
                <Stack direction="row" spacing={2} >
                  <Button component={RouterLink} to="/about" sx={{ background: "#0B4F2C", color: "#FBF8F1", fontFamily: '"Inter", sans-serif', fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, borderRadius: 0, px: 3, py: 1.2, "&:hover": { background: "#063820" } }}>
                    Read the biography
                  </Button>
                  <Button component={RouterLink} to="/book" sx={{ color: "#0B4F2C", fontFamily: '"Inter", sans-serif', fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, borderRadius: 0, borderBottom: "1px solid #D4AF37", px: 0, "&:hover": { background: "transparent", color: "#8E1B25" } }}>
                    Request an audience →
                  </Button>
                </Stack>
              </motion.div>
            </Grid>

            {/* Right: portrait with gilt frame */}
            <Grid item xs={12} md={5} >
              {p?.heroImageUrl && (
                <Box sx={{ position: "relative" }}>
                  <Box sx={{ position: "absolute", top: -8, left: -8, right: 8, bottom: 8, background: "#D4AF37", zIndex: 0 }} />
                  <Box sx={{ position: "absolute", top: 8, left: 8, right: -8, bottom: -8, border: "2px solid #0B4F2C", zIndex: 0 }} />
                  <OptimizedImage
  src={p.heroImageUrl}
  alt={p?.fullName}
  sx={{ position: "relative", width: "100%", display: "block", zIndex: 1 }}
  imgSx={{ filter: "sepia(0.04) contrast(1.04)" }}
/>
                </Box>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>

      <KenteStripe height={5} />

      {/* Doctrine bar */}
      <Box sx={{ background: "#0B4F2C", color: "#FBF8F1", py: { xs: 8, md: 12 }, position: "relative", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", top: -40, right: -40, opacity: 0.07 }}>
          <BlackStar size={400} color="#D4AF37" />
        </Box>
        <Container maxWidth="lg" sx={{ position: "relative" }}>
          <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: 6 }}>
            <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 36, md: 56 }, color: "#FBF8F1", lineHeight: 1.05 }}>
              The Doctrine.
            </Typography>
            <Box sx={{ flex: 1, height: "1px", background: "#D4AF37", opacity: 0.5 }} />
          </Stack>
          <Grid container spacing={4} >
            {[
              { roman: "I", title: "Reset Ghana", body: "Restore stability. Re-anchor the cedi. Re-found the Republic." },
              { roman: "II", title: "24-Hour Economy", body: "A Ghana that does not sleep. Three shifts. Real jobs." },
              { roman: "III", title: "The Accra Reset", body: "African-led debt relief, trade and climate finance." },
            ].map((d) => (
              <Grid item xs={12} md={4} key={d.title} >
                <Box sx={{ p: 4, border: "1px solid rgba(212,175,55,0.32)", borderTop: "3px solid #D4AF37", height: "100%" }}>
                  <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontSize: 56, color: "#D4AF37", fontStyle: "italic", lineHeight: 1, mb: 2 }}>
                    {d.roman}
                  </Typography>
                  <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: 28, mb: 2 }}>
                    {d.title}
                  </Typography>
                  <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 18, lineHeight: 1.5, opacity: 0.86 }}>
                    {d.body}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Stack direction="row" justifyContent="center" sx={{ mt: 6 }}>
            <Button component={RouterLink} to="/ventures" sx={{ background: "#D4AF37", color: "#0B4F2C", fontFamily: '"Inter", sans-serif', fontSize: 12, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 700, borderRadius: 0, px: 4, py: 1.4, "&:hover": { background: "#FBF8F1" } }}>
              Read the programme in full
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Pulled quote — proclamation */}
      {featuredQuote && (
        <Box sx={{ py: { xs: 10, md: 14 }, position: "relative" }}>
          <Container maxWidth="md" sx={{ textAlign: "center" }}>
            <GyeNyame size={32} color="#0B4F2C" />
            <Typography sx={{ mt: 4, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 30, md: 48 }, lineHeight: 1.35, color: "#0B4F2C" }}>
              "{featuredQuote.text}"
            </Typography>
            <Box sx={{ height: 2, width: 80, background: "#D4AF37", mx: "auto", my: 4 }} />
            <Typography sx={{ fontSize: 11, letterSpacing: "0.4em", color: "#8E1B25", textTransform: "uppercase", fontWeight: 700 }}>
              — {featuredQuote.context}
            </Typography>
          </Container>
        </Box>
      )}

      <KenteStripe height={4} />

      {/* Engagements */}
      {upcomingEvents.length > 0 && (
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
          <Stack direction="row" alignItems="baseline" spacing={3} sx={{ mb: 6 }}>
            <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 32, md: 48 }, color: "#0B4F2C" }}>
              On the diary.
            </Typography>
            <Box sx={{ flex: 1, height: "1px", background: "#0B4F2C", opacity: 0.4 }} />
            <Box component={RouterLink} to="/events" sx={{ color: "#0B4F2C", textDecoration: "none", fontFamily: '"Inter", sans-serif', fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, borderBottom: "1px solid #D4AF37", pb: 0.5 }}>
              All engagements →
            </Box>
          </Stack>
          <Stack divider={<Box sx={{ borderTop: "1px solid rgba(11,79,44,0.18)" }} />}>
            {upcomingEvents.map((e) => (
              <Grid container key={e.id} spacing={3} sx={{ py: 3 }}>
                <Grid item xs={12} md={2} >
                  <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontStyle: "italic", fontSize: 36, color: "#D4AF37", lineHeight: 1 }}>
                    {new Date(e.startsAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={7} >
                  <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: 22, color: "#0B4F2C", lineHeight: 1.2 }}>
                    {e.title}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "rgba(15,26,20,0.65)", mt: 0.5, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic" }}>
                    {e.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3} >
                  <Typography sx={{ fontSize: 11, letterSpacing: "0.32em", color: "#8E1B25", textTransform: "uppercase", fontWeight: 700 }}>
                    {e.venue}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "rgba(15,26,20,0.55)", mt: 0.5 }}>
                    {e.city}, {e.country}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Stack>
        </Container>
      )}

      {/* Closing seal */}
      <Container maxWidth="md" sx={{ pb: 10, textAlign: "center" }}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} >
          <Box sx={{ flex: 1, height: "1px", background: "#0B4F2C" }} />
          <Sankofa size={28} color="#0B4F2C" />
          <Box sx={{ flex: 1, height: "1px", background: "#0B4F2C" }} />
        </Stack>
        <Typography sx={{ mt: 3, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 18, color: "rgba(15,26,20,0.6)" }}>
          In the service of the Republic.
        </Typography>
      </Container>
    </Box>
  );
}
