import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@mahama/i18n";
import { Box, Container, Typography, Stack, Grid } from "@mui/material";
import { ProfileSkeleton, OptimizedImage } from "@mahama/website-core";
import { EmptyState } from "@mahama/website-core";
import { Seo } from "@mahama/website-core";
import { HalftoneDots, BoxingGloves, RingCorner } from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;

interface TaleStat { label: string; value: string; }

export function SharafAbout() {
  const { i18n } = useTranslation();
  const profile = useQuery({ queryKey: ["profile"], queryFn: () => api.getProfile() });
  const ventures = useQuery({ queryKey: ["ventures"], queryFn: () => api.listVentures() });
  const events = useQuery({ queryKey: ["events"], queryFn: () => api.listEvents() });
  const quotes = useQuery({ queryKey: ["quotes"], queryFn: () => api.listQuotes() });
  const achievements = useQuery({ queryKey: ["achievements"], queryFn: () => api.listAchievements() });

  if (profile.isLoading) return <><Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Profile" path="/about"  /><ProfileSkeleton /></>;
  if (!profile.data) return (
    <Container maxWidth="md" sx={{ py: 14 }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Profile" path="/about"  />
      <EmptyState subject={SUBJECT} title="Profile to follow." body="The full account is being prepared."  />
    </Container>
  );

  const p = profile.data;
  const paragraphs = (p.bio ?? "").split("\n\n");
  const age = p.birthDate ? Math.floor((Date.now() - new Date(p.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 0;
  const eventsCount = events.data?.length ?? 0;
  const venturesCount = ventures.data?.length ?? 0;

  const stats: TaleStat[] = [
    { label: "Age", value: age ? String(age) : "—" },
    { label: "Hometown", value: p.hometown ?? p.birthPlace?.split(",")[0] ?? "Accra" },
    { label: "Stance", value: "Promoter" },
    { label: "Reach", value: "Pan-African" },
    { label: "Promoted", value: String(eventsCount) },
    { label: "Ventures", value: String(venturesCount) },
  ];

  return (
    <Box sx={{ background: "#0B0B0B", color: "#F4F1ED", position: "relative", overflow: "hidden" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Tale of the Tape" path="/about"  />
      <HalftoneDots color="rgba(255,255,255,0.025)" />

      {/* Top: kente strap + headline */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ display: "flex", height: 5 }}>
          <Box sx={{ flex: 1, background: "#D62828" }} />
          <Box sx={{ flex: 1, background: "#E0B73A" }} />
          <Box sx={{ flex: 1, background: "#0B4F2C" }} />
        </Box>

        <Container maxWidth="xl" sx={{ pt: { xs: 6, md: 10 }, pb: 6 }}>
          <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "flex-end" }} spacing={3} sx={{ mb: 6 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: 20, md: 26 }, letterSpacing: "0.5em", color: "#D62828", mb: 1 }}>
                ★ TALE OF THE TAPE ★
              </Typography>
              <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 80, md: 180 }, lineHeight: 0.85, letterSpacing: "0.02em", color: "#F4F1ED" }}>
                {p.fullName.split(" ")[0]?.toUpperCase()}
              </Typography>
              <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 50, md: 120 }, lineHeight: 0.85, color: "#E0B73A" }}>
                {p.fullName.split(" ").slice(1).join(" ").toUpperCase()}
              </Typography>
            </Box>
            <Stack spacing={1} sx={{ minWidth: { md: 240 } }}>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 11, letterSpacing: "0.36em", color: "#E0B73A", textTransform: "uppercase", fontWeight: 700 }}>
                Profile · Card 01
              </Typography>
              <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 28, color: "#F4F1ED", lineHeight: 1.05 }}>
                {p.title}
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Centerpiece: portrait framed by ring corners + tale-of-tape stat card */}
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, pb: 8 }}>
        <Grid container spacing={4} alignItems="stretch">
          {/* Portrait with corner ropes */}
          <Grid item xs={12} md={5} >
            <Box sx={{ position: "relative" }}>
              <Box sx={{ position: "absolute", top: -8, left: -8, color: "#D62828" }}>
                <RingCorner size={60} color="#D62828" />
              </Box>
              <Box sx={{ position: "absolute", top: -8, right: -8, color: "#D62828", transform: "scaleX(-1)" }}>
                <RingCorner size={60} color="#D62828" />
              </Box>
              <Box sx={{ position: "absolute", bottom: -8, left: -8, color: "#E0B73A", transform: "scaleY(-1)" }}>
                <RingCorner size={60} color="#E0B73A" />
              </Box>
              <Box sx={{ position: "absolute", bottom: -8, right: -8, color: "#E0B73A", transform: "scale(-1)" }}>
                <RingCorner size={60} color="#E0B73A" />
              </Box>
              {p.portraitUrl ? (
                <OptimizedImage
  src={p.portraitUrl}
  alt={p.fullName}
  sx={{ width: "100%", display: "block" }}
  imgSx={{ filter: "grayscale(0.15) contrast(1.1)" }}
/>
              ) : (
                <Box sx={{ width: "100%", aspectRatio: "3/4", background: "#1a1a1a", display: "grid", placeItems: "center" }}>
                  <BoxingGloves size={140} color="#E0B73A" />
                </Box>
              )}
            </Box>
          </Grid>

          {/* Stat card */}
          <Grid item xs={12} md={7}>
            <Box sx={{ background: "#E0B73A", color: "#0B0B0B", p: { xs: 3, md: 5 }, height: "100%" }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                <Box sx={{ width: 28, height: 28, background: "#D62828", display: "grid", placeItems: "center", color: "#fff", fontFamily: '"Bebas Neue", sans-serif', fontSize: 18 }}>★</Box>
                <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 22, letterSpacing: "0.36em", fontWeight: 600 }}>
                  THE STAT CARD
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                {stats.map((s, i) => (
                  <Grid item xs={6} key={s.label}>
                    <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 12, letterSpacing: "0.36em", color: "#D62828", fontWeight: 700, mb: 0.5 }}>
                      {s.label.toUpperCase()}
                    </Typography>
                    <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 36, md: 52 }, lineHeight: 1, color: "#0B0B0B" }}>
                      {s.value}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* The Story — alternating blocks */}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: 10 }}>
        <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 18, letterSpacing: "0.5em", color: "#D62828", mb: 2 }}>
          ROUND ONE · THE STORY
        </Typography>
        <Box sx={{ height: 4, background: "linear-gradient(90deg, #D62828 0%, #E0B73A 50%, #0B4F2C 100%)", mb: 6 }} />
        {paragraphs.map((para, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 4,
              mb: 5,
              flexDirection: { xs: "column", md: i % 2 === 0 ? "row" : "row-reverse" },
            }}
          >
            <Typography sx={{
              fontFamily: '"Bebas Neue", "Anton", sans-serif',
              fontSize: { xs: 100, md: 180 },
              lineHeight: 0.7,
              color: i % 2 === 0 ? "#E0B73A" : "#D62828",
              minWidth: { md: 160 },
              textAlign: { md: i % 2 === 0 ? "left" : "right" },
              opacity: 0.9,
            }}>
              {String(i + 1).padStart(2, "0")}
            </Typography>
            <Typography sx={{
              flex: 1,
              fontFamily: '"Inter", sans-serif',
              fontSize: 18,
              lineHeight: 1.7,
              color: "rgba(244,241,237,0.92)",
              borderLeft: i % 2 === 0 ? "3px solid #E0B73A" : "none",
              borderRight: i % 2 !== 0 ? "3px solid #D62828" : "none",
              pl: i % 2 === 0 ? 3 : 0,
              pr: i % 2 !== 0 ? 3 : 0,
            }}>
              {para}
            </Typography>
          </Box>
        ))}
      </Container>

      {/* In His Corner — quotes */}
      {(quotes.data ?? []).length > 0 && (
        <Box sx={{ background: "#E0B73A", py: { xs: 8, md: 12 }, position: "relative", zIndex: 1 }}>
          <HalftoneDots color="rgba(0,0,0,0.06)" />
          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
            <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: 36, md: 60 }, color: "#0B0B0B", lineHeight: 1, mb: 1, letterSpacing: "0.04em" }}>
              IN HIS CORNER.
            </Typography>
            <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 14, letterSpacing: "0.36em", color: "#D62828", fontWeight: 700, mb: 6 }}>
              ON THE RECORD ★ ON THE RECORD ★ ON THE RECORD
            </Typography>
            <Grid container spacing={3} >
              {(quotes.data ?? []).map((q, i) => (
                <Grid item xs={12} md={6} key={q.id} >
                  <Box sx={{
                    p: 4,
                    background: i % 2 === 0 ? "#0B0B0B" : "transparent",
                    color: i % 2 === 0 ? "#E0B73A" : "#0B0B0B",
                    border: i % 2 === 0 ? "none" : "3px solid #0B0B0B",
                    height: "100%",
                  }}>
                    <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 50, lineHeight: 0.7, mb: 1, opacity: 0.8 }}>
                      "
                    </Typography>
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 18, lineHeight: 1.5, fontWeight: 500 }}>
                      {q.text}
                    </Typography>
                    <Typography sx={{ mt: 3, fontFamily: '"Bebas Neue", sans-serif', fontSize: 13, letterSpacing: "0.32em" }}>
                      ★ {q.context}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* Backed by — venture/sponsor strip */}
      {(ventures.data ?? []).length > 0 && (
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: 10 }}>
          <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 18, letterSpacing: "0.5em", color: "#D62828", mb: 4 }}>
            ★ BACKED BY ★ THE OPERATION ★
          </Typography>
          <Stack divider={<Box sx={{ borderTop: "1px solid rgba(224,183,58,0.2)" }} />}>
            {(ventures.data ?? []).slice(0, 5).map((v, i) => (
              <Stack key={v.id} direction={{ xs: "column", md: "row" }} alignItems={{ md: "baseline" }} spacing={3} sx={{ py: 4 }}>
                <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 38, color: i % 2 === 0 ? "#E0B73A" : "#D62828", letterSpacing: "0.04em", minWidth: { md: 80 } }}>
                  {String(i + 1).padStart(2, "0")}
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 28, md: 40 }, color: "#F4F1ED", letterSpacing: "0.04em", lineHeight: 1 }}>
                    {v.name.toUpperCase()}
                  </Typography>
                  <Typography sx={{ fontSize: 13, opacity: 0.62, mt: 1, fontFamily: '"Inter", sans-serif' }}>
                    {v.summary}
                  </Typography>
                </Box>
                <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 14, letterSpacing: "0.32em", color: "#E0B73A", textTransform: "uppercase" }}>
                  {v.sector}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Container>
      )}

      {/* Honour roll — strip of awards */}
      {(achievements.data ?? []).length > 0 && (
        <Box sx={{ background: "#D62828", color: "#0B0B0B", py: 6, position: "relative", zIndex: 1, borderTop: "3px solid #E0B73A", borderBottom: "3px solid #E0B73A" }}>
          <Container maxWidth="xl">
            <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 14, letterSpacing: "0.5em", color: "#0B0B0B", mb: 3, fontWeight: 700 }}>
              ★ MILESTONES ON THE WALL ★
            </Typography>
            <Stack direction="row" spacing={4} sx={{ overflowX: "auto", pb: 2 }}>
              {(achievements.data ?? []).map((a) => (
                <Box key={a.id} sx={{ minWidth: 240, p: 2, border: "2px solid #0B0B0B" }}>
                  <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 32, color: "#E0B73A", lineHeight: 1, background: "#0B0B0B", display: "inline-block", px: 1.5, py: 0.5 }}>
                    {a.year}
                  </Typography>
                  <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 22, mt: 1.5, lineHeight: 1.05, letterSpacing: "0.02em" }}>
                    {a.title}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Container>
        </Box>
      )}

      <Box sx={{ py: 4, position: "relative", zIndex: 1, textAlign: "center" }}>
        <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 14, letterSpacing: "0.5em", color: "rgba(244,241,237,0.45)" }}>
          ★ BUKOM · ACCRA · GHANA · WEST AFRICA RISING ★
        </Typography>
      </Box>
    </Box>
  );
}
