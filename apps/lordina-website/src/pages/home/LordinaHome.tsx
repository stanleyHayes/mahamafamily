import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@mahama/i18n";
import { Box, Container, Typography, Stack, Grid, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { HeroSkeleton, OptimizedImage, Reveal, Seo, StaggerGroup, StaggerItem } from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;
import { LORDINA, INVITATION_CLIP, HANDKERCHIEF_CLIP } from "../lordina/theme.js";
import { Hibiscus, Ribbon, Garland, PaperTexture, Mmusuyidee } from "../lordina/motifs.js";

export function LordinaHome() {
  const { i18n } = useTranslation();
  const profile = useQuery({ queryKey: ["profile"], queryFn: () => api.getProfile() });
  const ventures = useQuery({ queryKey: ["ventures"], queryFn: () => api.listVentures() });
  const events = useQuery({ queryKey: ["events"], queryFn: () => api.listEvents() });
  const quotes = useQuery({ queryKey: ["quotes"], queryFn: () => api.listQuotes() });
  const philanthropy = useQuery({ queryKey: ["philanthropy"], queryFn: () => api.listPhilanthropy() });

  if (profile.isLoading) return <HeroSkeleton />;
  const p = profile.data;
  const featuredQuote = quotes.data?.find((q) => q.featured) ?? quotes.data?.[0];
  const flagshipFoundation = (ventures.data ?? []).filter((v) => v.featured).slice(0, 2);
  const featuredImpact = (philanthropy.data ?? []).filter((i) => i.featured).slice(0, 3);
  const upcoming = (events.data ?? [])
    .filter((e) => +new Date(e.startsAt) >= Date.now())
    .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt))
    .slice(0, 3);

  return (
    <Box sx={{ background: LORDINA.paper, color: LORDINA.ink, position: "relative" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="First Lady of Ghana"  />
      <PaperTexture />

      {/* Hero */}
      <Box sx={{ position: "relative", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            {/* Title */}
            <Grid item xs={12} md={7} >
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                  <Hibiscus size={22} color={LORDINA.rose} />
                  <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 13, letterSpacing: "0.5em", color: LORDINA.sage, textTransform: "uppercase", fontWeight: 600 }}>
                    Her Excellency
                  </Typography>
                  <Box sx={{ flex: 1, height: "1px", background: LORDINA.gold, opacity: 0.7, maxWidth: 100 }} />
                </Stack>
                <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 56, md: 96 }, lineHeight: 0.95, color: LORDINA.roseDeep, mb: 2 }}>
                  Lordina<br />Mahama.
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Ribbon width={140} color={LORDINA.gold} />
                </Box>
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 20, md: 24 }, color: LORDINA.inkSoft, maxWidth: 560, mb: 4 }}>
                  {p?.title}
                </Typography>
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 18, md: 22 }, color: LORDINA.sage, maxWidth: 560, mb: 4 }}>
                  "{p?.tagline ?? "The more we share, the more we have."}"
                </Typography>
                <Stack direction="row" spacing={2} >
                  <Button component={RouterLink} to="/about" sx={{ background: LORDINA.roseDeep, color: LORDINA.paper, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 14, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, borderRadius: 0, px: 3, py: 1.2, "&:hover": { background: LORDINA.rose } }}>
                    Read the biography
                  </Button>
                  <Button component={RouterLink} to="/book" sx={{ color: LORDINA.roseDeep, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 14, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, borderRadius: 0, borderBottom: `1px solid ${LORDINA.gold}`, px: 0, "&:hover": { background: "transparent", color: LORDINA.rose } }}>
                    Visit the Foundation →
                  </Button>
                </Stack>
              </motion.div>
            </Grid>

            {/* Portrait — handkerchief silhouette */}
            <Grid item xs={12} md={5} >
              {p?.heroImageUrl && (
                <Box sx={{ position: "relative" }}>
                  {/* gold leaf paper behind */}
                  <Box sx={{ position: "absolute", top: 12, left: 12, right: -12, bottom: -12, background: LORDINA.blush, clipPath: HANDKERCHIEF_CLIP, zIndex: 0 }} />
                  <OptimizedImage
  src={p.heroImageUrl}
  loading="eager"
  fetchPriority="high"
  alt={p?.fullName}
  sx={{ position: "relative", width: "100%", display: "block", zIndex: 1 }}
  imgSx={{ clipPath: HANDKERCHIEF_CLIP, filter: "sepia(8%) saturate(0.95)" }}
/>
                </Box>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Garland separator */}
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <Garland width={400} color={LORDINA.sage} />
      </Box>

      {/* Foundation doctrine bar */}
      {featuredQuote && (
        <Reveal as="section">
        <Box sx={{ background: LORDINA.roseDeep, color: LORDINA.paper, py: { xs: 8, md: 12 }, position: "relative", overflow: "hidden" }}>
          <Box sx={{ position: "absolute", top: -40, right: -40, opacity: 0.08 }}>
            <Hibiscus size={400} color={LORDINA.gold} />
          </Box>
          <Container maxWidth="md" sx={{ position: "relative", textAlign: "center" }}>
            <Mmusuyidee size={36} color={LORDINA.gold} style={{ marginBottom: 16, display: "inline-block" }} />
            <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 30, md: 48 }, lineHeight: 1.25, mb: 3 }}>
              "{featuredQuote.text}"
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Ribbon width={140} color={LORDINA.gold} />
            </Box>
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 14, letterSpacing: "0.32em", color: LORDINA.gold, textTransform: "uppercase" }}>
              {featuredQuote.context}
            </Typography>
          </Container>
        </Box>
        </Reveal>
      )}

      {/* Foundation pillars */}
      {flagshipFoundation.length > 0 && (
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 13, letterSpacing: "0.4em", color: LORDINA.sage, textTransform: "uppercase", mb: 2 }}>
              The Work
            </Typography>
            <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 40, md: 64 }, lineHeight: 1, color: LORDINA.roseDeep }}>
              Foundation Pillars.
            </Typography>
          </Box>

          <StaggerGroup>
          <Grid container spacing={4} >
            {flagshipFoundation.map((v) => (
              <Grid item xs={12} md={6} key={v.id} >
                <StaggerItem>
                <Box sx={{
                  position: "relative",
                  background: "#fff",
                  clipPath: INVITATION_CLIP,
                  pt: 5,
                  pb: 4,
                  px: { xs: 3, md: 4 },
                  height: "100%",
                  boxShadow: `inset 0 0 0 1px ${LORDINA.rule}`,
                }}>
                  <Box sx={{ position: "absolute", top: 4, left: "50%", transform: "translateX(-50%)" }}>
                    <Hibiscus size={22} color={LORDINA.rose} />
                  </Box>
                  <Typography sx={{ textAlign: "center", fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 12, letterSpacing: "0.32em", color: LORDINA.sage, textTransform: "uppercase", mb: 1.5 }}>
                    {v.sector}
                  </Typography>
                  <Typography sx={{ textAlign: "center", fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: { xs: 26, md: 32 }, lineHeight: 1.18, color: LORDINA.roseDeep, mb: 1 }}>
                    {v.name}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                    <Ribbon width={90} color={LORDINA.gold} />
                  </Box>
                  <Typography sx={{ textAlign: "center", fontFamily: '"Cormorant Garamond", serif', fontSize: 16, lineHeight: 1.65, color: LORDINA.inkSoft, mb: 2.5 }}>
                    {v.summary}
                  </Typography>
                  {v.metrics?.length > 0 && (
                    <Stack direction="row" justifyContent="center" spacing={4} sx={{ pt: 2, borderTop: `1px solid ${LORDINA.rule}` }}>
                      {v.metrics.slice(0, 3).map((m) => (
                        <Box key={m.label} sx={{ textAlign: "center" }}>
                          <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontStyle: "italic", fontSize: 28, color: LORDINA.roseDeep, lineHeight: 1 }}>
                            {m.value}
                          </Typography>
                          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 11, letterSpacing: "0.22em", color: LORDINA.gold, textTransform: "uppercase", mt: 0.5 }}>
                            {m.label}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Box>
                </StaggerItem>
              </Grid>
            ))}
          </Grid>
          </StaggerGroup>
        </Container>
      )}

      {/* Impact strip */}
      {featuredImpact.length > 0 && (
        <Reveal as="section">
        <Box sx={{ background: LORDINA.paperDeep, py: { xs: 8, md: 10 } }}>
          <Container maxWidth="lg">
            <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "baseline" }} spacing={3} sx={{ mb: 6 }}>
              <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 36, md: 48 }, color: LORDINA.roseDeep, lineHeight: 1 }}>
                Impact, by hand.
              </Typography>
              <Box sx={{ flex: 1, height: "1px", background: LORDINA.gold, opacity: 0.7, display: { xs: "none", md: "block" } }} />
              <Button component={RouterLink} to="/impact" sx={{ color: LORDINA.roseDeep, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 14, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, borderRadius: 0, borderBottom: `1px solid ${LORDINA.gold}`, px: 0, "&:hover": { background: "transparent", color: LORDINA.rose } }}>
                Full Foundation register →
              </Button>
            </Stack>

            <StaggerGroup>
            <Grid container spacing={3} >
              {featuredImpact.map((i) => (
                <Grid item xs={12} md={4} key={i.id} >
                  <StaggerItem>
                  <Box sx={{ background: "#fff", py: 3, px: 3, height: "100%", boxShadow: `inset 0 0 0 1px ${LORDINA.rule}`, position: "relative" }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                      <Typography sx={{ background: LORDINA.gold, color: LORDINA.ink, px: 1, py: 0.2, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600 }}>
                        {i.year}
                      </Typography>
                      <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 12, letterSpacing: "0.18em", color: LORDINA.sage, textTransform: "uppercase" }}>
                        {i.category}
                      </Typography>
                    </Stack>
                    <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: 20, lineHeight: 1.2, color: LORDINA.roseDeep, mb: 1 }}>
                      {i.title}
                    </Typography>
                    <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 13, color: LORDINA.gold, mb: 1.5 }}>
                      For {i.beneficiary}
                    </Typography>
                    <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 15, lineHeight: 1.55, color: LORDINA.inkSoft }}>
                      {i.summary}
                    </Typography>
                  </Box>
                  </StaggerItem>
                </Grid>
              ))}
            </Grid>
            </StaggerGroup>
          </Container>
        </Box>
        </Reveal>
      )}

      {/* Upcoming engagements */}
      {upcoming.length > 0 && (
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
          <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "baseline" }} spacing={3} sx={{ mb: 5 }}>
            <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 36, md: 48 }, color: LORDINA.roseDeep, lineHeight: 1 }}>
              Forthcoming.
            </Typography>
            <Box sx={{ flex: 1, height: "1px", background: LORDINA.gold, opacity: 0.7, display: { xs: "none", md: "block" } }} />
            <Button component={RouterLink} to="/events" sx={{ color: LORDINA.roseDeep, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 14, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, borderRadius: 0, borderBottom: `1px solid ${LORDINA.gold}`, px: 0, "&:hover": { background: "transparent", color: LORDINA.rose } }}>
              The full diary →
            </Button>
          </Stack>

          <StaggerGroup>
          <Stack spacing={2} >
            {upcoming.map((e) => {
              const d = new Date(e.startsAt);
              return (
                <StaggerItem key={e.id} >
                <Box sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "auto 1fr", md: "120px 1fr auto" },
                  gap: 3,
                  alignItems: "center",
                  py: 3,
                  borderTop: `1px solid ${LORDINA.rule}`,
                  "&:last-of-type": { borderBottom: `1px solid ${LORDINA.rule}` },
                }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: 44, lineHeight: 0.85, color: LORDINA.roseDeep }}>
                      {String(d.getUTCDate()).padStart(2, "0")}
                    </Typography>
                    <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 12, letterSpacing: "0.32em", color: LORDINA.gold, textTransform: "uppercase" }}>
                      {d.toLocaleDateString("en-GB", { month: "short" })}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: { xs: 20, md: 24 }, lineHeight: 1.2, color: LORDINA.roseDeep, mb: 0.5 }}>
                      {e.title}
                    </Typography>
                    <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 13, letterSpacing: "0.18em", color: LORDINA.sage, textTransform: "uppercase" }}>
                      {e.venue} · {e.city}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 12, letterSpacing: "0.22em", color: LORDINA.inkMuted, textTransform: "uppercase", display: { xs: "none", md: "block" } }}>
                    {e.country}
                  </Typography>
                </Box>
                </StaggerItem>
              );
            })}
          </Stack>
          </StaggerGroup>
        </Container>
      )}

      {/* Closing seal */}
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Garland width={300} color={LORDINA.sage} />
        <Typography sx={{ mt: 2, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 18, color: LORDINA.inkMuted }}>
          The Foundation continues.
        </Typography>
      </Box>
    </Box>
  );
}
