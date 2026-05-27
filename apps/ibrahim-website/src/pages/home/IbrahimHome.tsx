import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@mahama/i18n";
import { Box, Container, Typography, Stack, Grid, Button } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Seo, OptimizedImage, HeroSkeleton, BlueprintGrid, Reveal, StaggerGroup, StaggerItem, QueryError, PersonSchema, BreadcrumbSchema } from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;

export function IbrahimHome() {
  const { i18n } = useTranslation();
  const profile = useQuery({ queryKey: ["profile"], queryFn: () => api.getProfile() });
  const ventures = useQuery({ queryKey: ["ventures"], queryFn: () => api.listVentures() });
  const philanthropy = useQuery({ queryKey: ["philanthropy"], queryFn: () => api.listPhilanthropy() });
  const quotes = useQuery({ queryKey: ["quotes"], queryFn: () => api.listQuotes() });

  const featuredQuote = quotes.data?.find((q) => q.featured) ?? quotes.data?.[0];
  const featuredVenture = ventures.data?.find((v) => v.featured) ?? ventures.data?.[0];
  const philFeatured = (philanthropy.data ?? []).filter((p) => p.featured).slice(0, 3);

  if (profile.isLoading) return <HeroSkeleton />;
  if (profile.isError) return <QueryError message="Unable to load profile." onRetry={() => profile.refetch()} />;
  const p = profile.data;

  return (
    <Box sx={{ background: "#08090C", color: "#F2EDE2" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Industrialist & Patron of Ghana"  />
      {p && <PersonSchema profile={p} baseUrl={window.location.origin} />}
      <BreadcrumbSchema items={[{ name: "Home", path: "/" }]} baseUrl={window.location.origin} />

      {/* Hero — full-bleed dossier cover */}
      <Box sx={{ position: "relative", minHeight: { xs: 720, md: 920 }, overflow: "hidden", display: "flex", alignItems: "flex-end", borderBottom: "1px solid rgba(201,162,39,0.32)" }}>
        {p?.heroImageUrl && (
          <OptimizedImage
  src={p.heroImageUrl}
  loading="eager"
  fetchPriority="high"
  alt={p?.fullName}
  sx={{ position: "absolute", inset: 0 }}
  imgSx={{ filter: "grayscale(0.3) contrast(1.05)" }}
/>
        )}
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,9,14,0.5) 0%, rgba(8,9,14,0.92) 80%, #08090C 100%)" }} />
        <BlueprintGrid />

        {/* Filing slip — top right */}
        <Box sx={{ position: "absolute", top: { xs: 100, md: 140 }, right: { xs: 24, md: 80 }, color: "#C9A227", fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", textAlign: "right", display: { xs: "none", md: "block" } }}>
          <div>Document № 01</div>
          <div style={{ opacity: 0.6, marginTop: 4 }}>Cover · Annual Report 2026</div>
        </Box>

        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, pb: { xs: 8, md: 14 } }}>
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.2, 0.65, 0.3, 0.95] }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.4em", color: "#C9A227", textTransform: "uppercase" }}>
                I. Cover Sheet
              </Typography>
              <Box sx={{ flex: 1, maxWidth: 80, height: "1px", background: "rgba(201,162,39,0.4)" }} />
              <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "rgba(242,237,226,0.55)", textTransform: "uppercase" }}>
                Builder · Industrialist · Patron
              </Typography>
            </Stack>

            <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 64, sm: 96, md: 168 }, lineHeight: 0.9, fontWeight: 600, letterSpacing: "-0.02em" }}>
              Ibrahim<br />
              <Box component="span" sx={{ color: "#C9A227", fontStyle: "italic", fontWeight: 500 }}>Mahama.</Box>
            </Typography>

            <Stack direction={{ xs: "column", md: "row" }} spacing={5} alignItems={{ md: "flex-end" }} sx={{ mt: 6 }}>
              <Box sx={{ flex: "1 1 480px", maxWidth: 580 }}>
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 22, md: 28 }, lineHeight: 1.4, color: "#F2EDE2", mb: 3 }}>
                  "{p?.tagline ?? "Ad astra per aspera."}"
                </Typography>
                <Typography sx={{ fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 13, letterSpacing: "0.08em", color: "rgba(242,237,226,0.6)", maxWidth: 480 }}>
                  {p?.title}
                </Typography>
              </Box>
              <Stack spacing={2} sx={{ borderLeft: "1px solid rgba(201,162,39,0.4)", pl: 4, py: 1, minWidth: { md: 280 } }}>
                <Button component={RouterLink} to="/about" endIcon={<ArrowOutwardIcon sx={{ fontSize: "16px !important" }} />} sx={{ background: "#C9A227", color: "#08090C", fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, borderRadius: 0, px: 3, py: 1.2, justifyContent: "space-between", "&:hover": { background: "#F2EDE2" } }}>
                  Read the dossier
                </Button>
                <Button component={RouterLink} to="/book" sx={{ color: "#C9A227", fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500, borderRadius: 0, justifyContent: "flex-start", "&:hover": { background: "transparent", color: "#F2EDE2" } }}>
                  Schedule a meeting →
                </Button>
              </Stack>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* Ledger of operations */}
      <Reveal as="section">
      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
        <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "baseline" }} spacing={3} sx={{ mb: 6 }}>
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.4em", color: "#C9A227", textTransform: "uppercase" }}>
            II. Operating Snapshot
          </Typography>
          <Box sx={{ flex: 1, height: "1px", background: "rgba(201,162,39,0.32)", display: { xs: "none", md: "block" } }} />
        </Stack>
        <Grid container sx={{ borderTop: "1px solid rgba(201,162,39,0.32)", borderBottom: "1px solid rgba(201,162,39,0.32)" }}>
          {[
            { v: "3,000+", k: "Employees", h: "Across the group" },
            { v: "2M T", k: "Cement / yr", h: "Dzata Plant" },
            { v: "3", k: "Countries", h: "GH · LR · SL" },
            { v: "1997", k: "Founded", h: "Engineers & Planners" },
          ].map((r, i) => (
            <Grid item xs={6} md={3} key={r.k} sx={{ py: 5, px: 4, borderRight: { md: i < 3 ? "1px solid rgba(201,162,39,0.16)" : "none" }, borderBottom: { xs: i < 2 ? "1px solid rgba(201,162,39,0.16)" : "none", md: "none" } }}>
              <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 44, md: 72 }, lineHeight: 0.9, color: "#F2EDE2" }}>
                {r.v}
              </Typography>
              <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.28em", color: "#C9A227", textTransform: "uppercase", mt: 1.5 }}>
                {r.k}
              </Typography>
              <Typography sx={{ fontSize: 12, opacity: 0.5, fontFamily: '"IBM Plex Sans", sans-serif', mt: 0.5 }}>
                {r.h}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
      </Reveal>

      {/* Prologue + featured quote */}
      <Reveal as="section">
      <Container maxWidth="xl" sx={{ pb: { xs: 8, md: 14 } }}>
        <Grid container spacing={8} >
          <Grid item xs={12} md={6} >
            <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.4em", color: "#C9A227", textTransform: "uppercase", mb: 3 }}>
              III. Note from the Office
            </Typography>
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: { xs: 22, md: 28 }, lineHeight: 1.55, fontStyle: "italic", color: "#F2EDE2", mb: 4, "&::first-letter": { fontFamily: '"Playfair Display", serif', float: "left", fontSize: 84, lineHeight: 0.85, paddingRight: "10px", paddingTop: "6px", color: "#C9A227", fontWeight: 600 } }}>
              {p?.bio?.split("\n\n")[0]}
            </Typography>
            <Button component={RouterLink} to="/about" endIcon={<ArrowOutwardIcon sx={{ fontSize: "14px !important" }} />} sx={{ color: "#C9A227", fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", borderBottom: "1px solid #C9A227", borderRadius: 0, px: 0, "&:hover": { background: "transparent", color: "#F2EDE2", borderColor: "#F2EDE2" } }}>
              Continue the dossier
            </Button>
          </Grid>
          <Grid item xs={12} md={6} >
            {featuredQuote && (
              <Box sx={{ borderTop: "1px solid rgba(201,162,39,0.32)", borderBottom: "1px solid rgba(201,162,39,0.32)", py: 6 }}>
                <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: 200, lineHeight: 0.4, color: "#C9A227", opacity: 0.18, mb: -2 }}>"</Typography>
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 28, md: 38 }, lineHeight: 1.3, color: "#F2EDE2" }}>
                  {featuredQuote.text}
                </Typography>
                <Typography sx={{ mt: 3, fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "#C9A227", textTransform: "uppercase" }}>
                  — {featuredQuote.context}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
      </Reveal>

      {/* Featured venture — full-width band */}
      {featuredVenture && (
        <Reveal as="section">
        <Box sx={{ borderTop: "1px solid rgba(201,162,39,0.32)", borderBottom: "1px solid rgba(201,162,39,0.32)", py: { xs: 8, md: 12 } }}>
          <Container maxWidth="xl">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={5} >
                <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.4em", color: "#C9A227", textTransform: "uppercase", mb: 2 }}>
                  IV. Flagship Operation
                </Typography>
                <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 40, md: 64 }, lineHeight: 0.95, mb: 2 }}>
                  {featuredVenture.name}
                </Typography>
                <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, letterSpacing: "0.28em", color: "rgba(242,237,226,0.55)", textTransform: "uppercase", mb: 3 }}>
                  {featuredVenture.sector} · Founded {featuredVenture.founded ?? "—"}
                </Typography>
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 19, lineHeight: 1.7, color: "rgba(242,237,226,0.92)", mb: 4 }}>
                  {featuredVenture.summary}
                </Typography>
                <Button component={RouterLink} to="/ventures" endIcon={<ArrowOutwardIcon sx={{ fontSize: "14px !important" }} />} sx={{ background: "#C9A227", color: "#08090C", fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, borderRadius: 0, px: 3, py: 1.2, "&:hover": { background: "#F2EDE2" } }}>
                  Open the register
                </Button>
              </Grid>
              <Grid item xs={12} md={7} >
                <Grid container>
                  {featuredVenture.metrics.slice(0, 4).map((m, i) => (
                    <Grid item xs={6} key={m.label} sx={{ py: 4, px: 3, borderTop: "1px solid rgba(201,162,39,0.16)", borderRight: { md: i % 2 === 0 ? "1px solid rgba(201,162,39,0.16)" : "none" } }}>
                      <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 36, md: 56 }, lineHeight: 0.95, color: "#C9A227" }}>
                        {m.value}
                      </Typography>
                      <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.28em", color: "rgba(242,237,226,0.55)", textTransform: "uppercase", mt: 1 }}>
                        {m.label}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Box>
        </Reveal>
      )}

      {/* Philanthropy plates */}
      {philFeatured.length > 0 && (
        <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
          <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "baseline" }} spacing={3} sx={{ mb: 6 }}>
            <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.4em", color: "#C9A227", textTransform: "uppercase" }}>
              V. Service · Recent Giving
            </Typography>
            <Box sx={{ flex: 1, height: "1px", background: "rgba(201,162,39,0.32)", display: { xs: "none", md: "block" } }} />
            <Box component={RouterLink} to="/impact" sx={{ color: "#C9A227", textDecoration: "none", fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", borderBottom: "1px solid #C9A227", pb: 0.5 }}>
              See the record →
            </Box>
          </Stack>
          <StaggerGroup>
          <Grid container spacing={3} >
            {philFeatured.map((p, i) => (
              <Grid item xs={12} md={4} key={p.id} >
                <StaggerItem>
                <Box sx={{ pt: 3, borderTop: "2px solid #C9A227" }}>
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: "rgba(242,237,226,0.4)", letterSpacing: "0.18em" }}>
                      {String(i + 1).padStart(2, "0")}
                    </Typography>
                    <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.28em", color: "#C9A227", textTransform: "uppercase" }}>
                      {p.category} · {p.year}
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: 26, lineHeight: 1.2, mb: 1 }}>
                    {p.title}
                  </Typography>
                  <Typography sx={{ fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 13, color: "rgba(242,237,226,0.55)", mb: 2 }}>
                    {p.beneficiary}
                  </Typography>
                  <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 16, lineHeight: 1.6, color: "rgba(242,237,226,0.85)" }}>
                    {p.summary}
                  </Typography>
                </Box>
                </StaggerItem>
              </Grid>
            ))}
          </Grid>
          </StaggerGroup>
        </Container>
      )}
    </Box>
  );
}
