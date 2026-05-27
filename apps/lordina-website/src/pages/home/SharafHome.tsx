import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@mahama/i18n";
import { Box, Container, Typography, Stack, Grid, Button } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Seo, OptimizedImage } from "@mahama/website-core";
import { HeroSkeleton } from "@mahama/website-core";
import { HalftoneDots, BoxingGloves } from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;

export function SharafHome() {
  const { i18n } = useTranslation();
  const profile = useQuery({ queryKey: ["profile"], queryFn: () => api.getProfile() });
  const events = useQuery({ queryKey: ["events"], queryFn: () => api.listEvents() });
  const ventures = useQuery({ queryKey: ["ventures"], queryFn: () => api.listVentures() });
  const quotes = useQuery({ queryKey: ["quotes"], queryFn: () => api.listQuotes() });

  if (profile.isLoading) return <HeroSkeleton />;
  const p = profile.data;
  const sortedEvents = [...(events.data ?? [])].sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt));
  const billboard = sortedEvents.find((e) => +new Date(e.startsAt) > Date.now()) ?? sortedEvents[0];
  const undercard = sortedEvents.filter((e) => e !== billboard).slice(0, 3);
  const featuredVenture = ventures.data?.find((v) => v.featured) ?? ventures.data?.[0];

  return (
    <Box sx={{ background: "#0B0B0B", color: "#F4F1ED", position: "relative", overflow: "hidden" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Sports Entrepreneur & Boxing Promoter"  />
      <HalftoneDots color="rgba(255,255,255,0.025)" />

      {/* Top kente strap */}
      <Box sx={{ display: "flex", height: 5 }}>
        <Box sx={{ flex: 1, background: "#D62828" }} />
        <Box sx={{ flex: 1, background: "#E0B73A" }} />
        <Box sx={{ flex: 1, background: "#0B4F2C" }} />
      </Box>

      {/* Hero — fight poster */}
      <Box sx={{ position: "relative", minHeight: { xs: 700, md: 880 }, display: "flex", alignItems: "center", overflow: "hidden", borderBottom: "3px solid #E0B73A" }}>
        {p?.heroImageUrl && (
          <OptimizedImage
  src={p.heroImageUrl}
  loading="eager"
  fetchPriority="high"
  alt={p?.fullName}
  sx={{ position: "absolute", inset: 0 }}
  imgSx={{ filter: "grayscale(0.3) contrast(1.15)", opacity: 0.5 }}
/>
        )}
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(11,11,11,0.9) 0%, rgba(11,11,11,0.5) 50%, rgba(11,11,11,0.95) 100%)" }} />
        <HalftoneDots color="rgba(224,183,58,0.06)" />

        {/* Side stencil */}
        <Box sx={{
          position: "absolute",
          left: -6,
          top: "50%",
          transform: "rotate(-90deg) translateY(50%)",
          transformOrigin: "left top",
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: 14,
          letterSpacing: "0.6em",
          color: "rgba(224,183,58,0.5)",
          display: { xs: "none", lg: "block" },
        }}>
          ★ BUKOM · ACCRA · GHANA · WEST AFRICA RISING ★
        </Box>

        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: 16, md: 22 }, letterSpacing: "0.5em", color: "#D62828", mb: 2 }}>
              ★ THE PROMOTER ★ THE OPERATOR ★
            </Typography>
            <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 84, sm: 140, md: 240 }, lineHeight: 0.85, color: "#F4F1ED", letterSpacing: "0.02em" }}>
              SHARAF
            </Typography>
            <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 56, sm: 100, md: 180 }, lineHeight: 0.85, color: "#E0B73A", letterSpacing: "0.02em", mb: 4 }}>
              MAHAMA.
            </Typography>
            <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems={{ md: "flex-end" }}>
              <Box sx={{ flex: 1, maxWidth: 540, borderLeft: "3px solid #E0B73A", pl: 3 }}>
                <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: 22, md: 28 }, letterSpacing: "0.06em", lineHeight: 1.2, color: "#F4F1ED" }}>
                  {p?.title}
                </Typography>
                <Typography sx={{ mt: 2, fontFamily: '"Inter", sans-serif', fontSize: 14, letterSpacing: "0.04em", color: "rgba(244,241,237,0.78)", maxWidth: 460 }}>
                  "{p?.tagline ?? "African fighters on the global stage. Ghana is ready."}"
                </Typography>
              </Box>
              <Stack spacing={2} >
                <Button component={RouterLink} to="/events" endIcon={<ArrowOutwardIcon sx={{ fontSize: "16px !important" }} />} sx={{ background: "#E0B73A", color: "#0B0B0B", fontFamily: '"Bebas Neue", sans-serif', fontSize: 18, letterSpacing: "0.18em", borderRadius: 0, px: 4, py: 1.4, "&:hover": { background: "#fff" } }}>
                  Next Fight Night
                </Button>
                <Button component={RouterLink} to="/book" sx={{ color: "#E0B73A", fontFamily: '"Bebas Neue", sans-serif', fontSize: 14, letterSpacing: "0.22em", borderRadius: 0, justifyContent: "flex-start", "&:hover": { background: "transparent", color: "#fff" } }}>
                  ★ Book Time →
                </Button>
              </Stack>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* Marquee */}
      <Box sx={{ background: "#D62828", color: "#0B0B0B", py: 1, overflow: "hidden", borderBottom: "3px solid #E0B73A" }}>
        <Box sx={{
          display: "flex", whiteSpace: "nowrap", animation: "marquee 28s linear infinite",
          fontFamily: '"Bebas Neue", sans-serif', fontSize: 16, letterSpacing: "0.36em",
          "& span": { px: 4 },
          "@keyframes marquee": { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },}}>
          {Array(2).fill(0).map((_, j) => (
            <Box key={j} sx={{ display: "flex" }}>
              <span>★ LEGACY RISE</span><span>★ BATTLE OF THE BEASTS</span><span>★ THE SHOWDOWN</span>
              <span>★ ANTHONY JOSHUA</span><span>★ AMIR KHAN</span><span>★ ALLOTEY</span>
              <span>★ BUKOM ARENA</span>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Billboard — next event */}
      {billboard && (
        <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 }, position: "relative", zIndex: 1 }}>
          <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: 18, md: 24 }, letterSpacing: "0.5em", color: "#D62828", mb: 3 }}>
            ★ NEXT ON THE CARD ★ MAIN EVENT ★
          </Typography>
          <Box sx={{ background: "#E0B73A", color: "#0B0B0B", p: { xs: 4, md: 6 }, position: "relative", overflow: "hidden" }}>
            <HalftoneDots color="rgba(0,0,0,0.06)" />
            <Grid container spacing={4} alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
              <Grid item xs={12} md={4} >
                <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: 28, md: 36 }, color: "#D62828", letterSpacing: "0.24em" }}>
                  {new Date(billboard.startsAt).toLocaleDateString("en-GB", { weekday: "long" }).toUpperCase()}
                </Typography>
                <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 100, md: 200 }, lineHeight: 0.8 }}>
                  {new Date(billboard.startsAt).getDate()}
                </Typography>
                <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: 32, md: 44 }, letterSpacing: "0.12em" }}>
                  {new Date(billboard.startsAt).toLocaleDateString("en-GB", { month: "long" }).toUpperCase()} '{String(new Date(billboard.startsAt).getFullYear()).slice(-2)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={8} >
                <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 40, md: 76 }, lineHeight: 1, mb: 2 }}>
                  {billboard.title.toUpperCase()}
                </Typography>
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 16, lineHeight: 1.55, mb: 3, maxWidth: 520 }}>
                  {billboard.description}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <Box sx={{ width: 40, height: "2px", background: "#D62828" }} />
                  <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 18, letterSpacing: "0.32em", color: "#D62828", fontWeight: 700 }}>
                    AT {billboard.venue.toUpperCase()} · {billboard.city.toUpperCase()}
                  </Typography>
                </Stack>
                <Button component={RouterLink} to="/events" sx={{ background: "#0B0B0B", color: "#E0B73A", fontFamily: '"Bebas Neue", sans-serif', fontSize: 18, letterSpacing: "0.22em", borderRadius: 0, px: 4, py: 1.4, "&:hover": { background: "#D62828", color: "#0B0B0B" } }}>
                  ★ FULL FIGHT CARD
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      )}

      {/* Promoter intro — alternating panels */}
      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 }, position: "relative", zIndex: 1 }}>
        <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 18, letterSpacing: "0.5em", color: "#D62828", mb: 4 }}>
          ★ MEET THE PROMOTER ★
        </Typography>
        <Grid container spacing={0} >
          <Grid item xs={12} md={5} >
            <Box sx={{ background: "#0B0B0B", border: "2px solid #E0B73A", p: { xs: 4, md: 5 }, height: "100%", position: "relative" }}>
              <BoxingGloves size={64} color="#E0B73A" />
              <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 14, letterSpacing: "0.36em", color: "#D62828", mt: 3, fontWeight: 700 }}>
                ★ THE STORY
              </Typography>
              <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 36, md: 56 }, lineHeight: 1, mt: 2, mb: 3 }}>
                FROM BUKOM<br />TO THE WORLD.
              </Typography>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 16, lineHeight: 1.65, color: "rgba(244,241,237,0.85)", mb: 4 }}>
                {p?.bio?.split("\n\n")[0]}
              </Typography>
              <Button component={RouterLink} to="/about" endIcon={<ArrowOutwardIcon sx={{ fontSize: "16px !important" }} />} sx={{ background: "#E0B73A", color: "#0B0B0B", fontFamily: '"Bebas Neue", sans-serif', fontSize: 16, letterSpacing: "0.22em", borderRadius: 0, px: 3, py: 1.2, "&:hover": { background: "#fff" } }}>
                Tale of the Tape
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={7} >
            {(quotes.data ?? []).slice(0, 3).map((q, i) => {
              const isYellow = i === 0;
              const isRed = i === 1;
              const bg = isYellow ? "#E0B73A" : isRed ? "#D62828" : "#0B0B0B";
              const fg = isYellow || isRed ? "#0B0B0B" : "#E0B73A";
              return (
                <Box key={q.id} sx={{ background: bg, color: fg, p: { xs: 3, md: 4 }, borderBottom: i < 2 ? "2px solid #0B0B0B" : "none", border: i === 2 ? "2px solid #E0B73A" : "none" }}>
                  <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 50, lineHeight: 0.7, opacity: 0.7, mb: 1 }}>"</Typography>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 18, lineHeight: 1.5, fontWeight: 500 }}>
                    {q.text}
                  </Typography>
                  <Typography sx={{ mt: 2, fontFamily: '"Bebas Neue", sans-serif', fontSize: 12, letterSpacing: "0.32em" }}>
                    ★ {q.context}
                  </Typography>
                </Box>
              );
            })}
          </Grid>
        </Grid>
      </Container>

      {/* Undercard list */}
      {undercard.length > 0 && (
        <Container maxWidth="xl" sx={{ pb: { xs: 8, md: 12 } }}>
          <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 18, letterSpacing: "0.5em", color: "#D62828", mb: 4 }}>
            ★ THE UNDERCARD ★
          </Typography>
          <Stack divider={<Box sx={{ borderTop: "1px solid rgba(224,183,58,0.2)" }} />}>
            {undercard.map((e) => (
              <Stack key={e.id} direction={{ xs: "column", md: "row" }} alignItems={{ md: "baseline" }} spacing={3} sx={{ py: 4 }}>
                <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 38, color: "#E0B73A", letterSpacing: "0.04em", minWidth: { md: 120 } }}>
                  {new Date(e.startsAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).toUpperCase()}
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 26, md: 38 }, color: "#F4F1ED", letterSpacing: "0.04em", lineHeight: 1.05 }}>
                    {e.title.toUpperCase()}
                  </Typography>
                  <Typography sx={{ fontSize: 13, opacity: 0.62, mt: 1 }}>
                    {e.description}
                  </Typography>
                </Box>
                <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 14, letterSpacing: "0.32em", color: "#D62828", fontWeight: 700 }}>
                  ★ {e.venue.toUpperCase()}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Container>
      )}

      {/* Featured venture strip */}
      {featuredVenture && (
        <Box sx={{ background: "#E0B73A", color: "#0B0B0B", py: 4, position: "relative", borderTop: "3px solid #D62828", borderBottom: "3px solid #D62828" }}>
          <HalftoneDots color="rgba(0,0,0,0.05)" />
          <Container maxWidth="xl" sx={{ position: "relative" }}>
            <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }} spacing={3} >
              <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 32, md: 56 }, lineHeight: 1, letterSpacing: "0.04em", flex: 1 }}>
                {featuredVenture.name.toUpperCase()}
              </Typography>
              <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 14, letterSpacing: "0.32em", fontWeight: 700, color: "#D62828" }}>
                ★ {featuredVenture.sector.toUpperCase()}
              </Typography>
              <Button component={RouterLink} to="/ventures" endIcon={<ArrowOutwardIcon sx={{ fontSize: "16px !important" }} />} sx={{ background: "#0B0B0B", color: "#E0B73A", fontFamily: '"Bebas Neue", sans-serif', fontSize: 16, letterSpacing: "0.22em", borderRadius: 0, px: 3, py: 1.2, "&:hover": { background: "#D62828", color: "#0B0B0B" } }}>
                The Operation
              </Button>
            </Stack>
          </Container>
        </Box>
      )}
    </Box>
  );
}
