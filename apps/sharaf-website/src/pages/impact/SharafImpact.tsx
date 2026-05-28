import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Container, Typography, Stack, Grid, Button } from "@mui/material";
import type { PhilanthropyDTO } from "@mahama/shared-types";
import { BoxingGloves, CardGridSkeleton, EmptyState, HalftoneDots, QueryError, Seo, StaggerGroup, StaggerItem , BreadcrumbSchema} from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;

const CATEGORIES = [
  { key: "all", label: "ALL CARDS" },
  { key: "sports", label: "SPORTS" },
  { key: "youth", label: "YOUTH" },
  { key: "education", label: "EDUCATION" },
  { key: "health", label: "HEALTH" },
  { key: "disaster-relief", label: "RELIEF" },
  { key: "other", label: "OTHER" },
];

interface ToneCfg {
  bg: string;
  fg: string;
  accent: string;
  num: string;
}

const TONES: ToneCfg[] = [
  { bg: "#0B0B0B", fg: "#F4F1ED", accent: "#E0B73A", num: "#D62828" },
  { bg: "#E0B73A", fg: "#0B0B0B", accent: "#D62828", num: "#0B0B0B" },
  { bg: "#D62828", fg: "#0B0B0B", accent: "#E0B73A", num: "#0B0B0B" },
];

function FightCard({ p, index }: { p: PhilanthropyDTO; index: number }) {
  const tone = TONES[index % TONES.length]!;
  const isBlack = index % TONES.length === 0;
  return (
    <Box sx={{
      background: tone.bg,
      color: tone.fg,
      position: "relative",
      overflow: "hidden",
      border: isBlack ? "2px solid rgba(224,183,58,0.32)" : "none",
      height: "100%",
      transition: "transform 0.22s",
      "&:hover": {
        transform: "translateY(-6px)",
        boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
      },
    }}>
      <HalftoneDots color={isBlack ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"} />

      {/* Top corner mark */}
      <Box sx={{
        position: "absolute",
        top: 12,
        right: 12,
        background: tone.accent,
        color: tone.num,
        px: 1.25,
        py: 0.4,
        fontFamily: '"Bebas Neue", sans-serif',
        fontSize: 11,
        letterSpacing: "0.32em",
        fontWeight: 700,
        zIndex: 2,
      }}>
        ★ CARD {String(index + 1).padStart(2, "0")}
      </Box>

      {/* Big year */}
      <Box sx={{ p: { xs: 3, md: 4 }, position: "relative", zIndex: 1 }}>
        <Typography sx={{
          fontFamily: '"Bebas Neue", "Anton", sans-serif',
          fontSize: { xs: 64, md: 88 },
          lineHeight: 0.85,
          color: tone.num,
          letterSpacing: "0.02em",
          mb: 1,
        }}>
          {p.year}
        </Typography>

        {/* Category strip */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Box sx={{ width: 24, height: 2, background: tone.accent }} />
          <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 13, letterSpacing: "0.36em", color: tone.accent, fontWeight: 700, textTransform: "uppercase" }}>
            ★ {p.category.replace("-", " ")}
          </Typography>
        </Stack>

        {/* Title */}
        <Typography sx={{
          fontFamily: '"Bebas Neue", "Anton", sans-serif',
          fontSize: { xs: 28, md: 36 },
          lineHeight: 1,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
          mb: 2,
        }}>
          {p.title}
        </Typography>

        {/* VS divider */}
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Box sx={{ flex: 1, height: 2, background: tone.accent, opacity: 0.5 }} />
          <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 14, letterSpacing: "0.4em", color: tone.num, fontWeight: 700 }}>
            VS.
          </Typography>
          <Box sx={{ flex: 1, height: 2, background: tone.accent, opacity: 0.5 }} />
        </Stack>

        {/* Beneficiary */}
        <Typography sx={{
          fontFamily: '"Bebas Neue", "Anton", sans-serif',
          fontSize: { xs: 22, md: 28 },
          lineHeight: 1,
          letterSpacing: "0.04em",
          color: tone.accent,
          mb: 2.5,
          textTransform: "uppercase",
        }}>
          {p.beneficiary}
        </Typography>

        {/* Body */}
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 14, lineHeight: 1.55, opacity: 0.9, mb: 3 }}>
          {p.summary}
        </Typography>

        {/* Footer chips */}
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ pt: 2, borderTop: `2px solid ${tone.accent}` }}>
          {p.amount && (
            <Box sx={{ background: tone.num, color: tone.bg, px: 1.5, py: 0.5, fontFamily: '"Bebas Neue", sans-serif', fontSize: 13, letterSpacing: "0.22em", fontWeight: 700 }}>
              ★ {p.amount}
            </Box>
          )}
          {p.featured && (
            <Box sx={{ border: `2px solid ${tone.num}`, color: tone.num, px: 1.5, py: 0.5, fontFamily: '"Bebas Neue", sans-serif', fontSize: 13, letterSpacing: "0.32em", fontWeight: 700 }}>
              ★ MAIN EVENT
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
}

export function SharafImpact() {
  const phil = useQuery({ queryKey: ["philanthropy"], queryFn: () => api.listPhilanthropy() });
  const [filter, setFilter] = useState("all");
  const all = phil.data ?? [];
  const items = useMemo(() => all.filter((p) => filter === "all" || p.category === filter), [all, filter]);

  return (
    <Box sx={{ background: "#0B0B0B", color: "#F4F1ED", position: "relative", overflow: "hidden" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="The Foundation Roll" path="/impact"  />
      <BreadcrumbSchema
        baseUrl={window.location.origin}
        items={[{ name: "Home", path: "/" }, { name: "Impact", path: "/impact" }]}
      />
      <HalftoneDots color="rgba(255,255,255,0.025)" />

      {/* Top kente strap */}
      <Box sx={{ display: "flex", height: 5 }}>
        <Box sx={{ flex: 1, background: "#D62828" }} />
        <Box sx={{ flex: 1, background: "#E0B73A" }} />
        <Box sx={{ flex: 1, background: "#0B4F2C" }} />
      </Box>

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, py: { xs: 6, md: 10 } }}>
        {/* Title */}
        <Box sx={{ mb: 6 }}>
          <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: 18, md: 24 }, letterSpacing: "0.5em", color: "#D62828", mb: 2 }}>
            ★ THE FOUNDATION ROLL ★
          </Typography>
          <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 80, md: 200 }, lineHeight: 0.85, color: "#F4F1ED", letterSpacing: "0.02em" }}>
            EVERY
          </Typography>
          <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 60, md: 140 }, lineHeight: 0.85, color: "#E0B73A", letterSpacing: "0.02em" }}>
            CARD COUNTS.
          </Typography>
          <Typography sx={{ mt: 3, fontFamily: '"Inter", sans-serif', fontSize: 14, letterSpacing: "0.32em", color: "rgba(244,241,237,0.55)", textTransform: "uppercase" }}>
            Foundations · Sponsorships · Backed Fighters · Communities Lifted
          </Typography>
        </Box>

        {/* Stat strip */}
        {all.length > 0 && (
          <Box sx={{ background: "#E0B73A", color: "#0B0B0B", py: 3, px: { xs: 3, md: 5 }, mb: 6, position: "relative", overflow: "hidden" }}>
            <HalftoneDots color="rgba(0,0,0,0.06)" />
            <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }} spacing={3} sx={{ position: "relative" }}>
              <Stack direction="row" spacing={3} >
                <Box>
                  <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 56, md: 80 }, lineHeight: 0.85, color: "#D62828" }}>
                    {String(all.length).padStart(2, "0")}
                  </Typography>
                  <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 12, letterSpacing: "0.32em" }}>
                    ★ CARDS ON THE WALL
                  </Typography>
                </Box>
                <Box sx={{ width: 2, background: "#0B0B0B" }} />
                <Box>
                  <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 56, md: 80 }, lineHeight: 0.85, color: "#0B0B0B" }}>
                    {new Set(all.map((a) => a.category)).size}
                  </Typography>
                  <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 12, letterSpacing: "0.32em" }}>
                    ★ DIVISIONS
                  </Typography>
                </Box>
              </Stack>
              <Box sx={{ flex: 1 }} />
              <BoxingGloves size={84} color="#D62828" />
            </Stack>
          </Box>
        )}

        {/* Diagonal red strap */}
        <Box sx={{ background: "#D62828", color: "#0B0B0B", py: 1.25, mx: -3, transform: "skewY(-1deg)", mb: 6 }}>
          <Box sx={{ transform: "skewY(1deg)", textAlign: "center", fontFamily: '"Bebas Neue", sans-serif', fontSize: 16, letterSpacing: "0.36em", fontWeight: 700 }}>
            ★ FROM THE CORNER ★ FROM THE CORNER ★ FROM THE CORNER ★
          </Box>
        </Box>

        {/* Filter strip */}
        {all.length > 0 && (
          <Stack direction="row" spacing={1.5} sx={{ mb: 5, overflowX: "auto", "&::-webkit-scrollbar": { display: "none" } }}>
            {CATEGORIES.map((c) => (
              <Button
                key={c.key}
                onClick={() => setFilter(c.key)}
                disableRipple
                sx={{
                  flexShrink: 0,
                  fontFamily: '"Bebas Neue", sans-serif',
                  fontSize: 14,
                  letterSpacing: "0.36em",
                  color: filter === c.key ? "#0B0B0B" : "#E0B73A",
                  background: filter === c.key ? "#E0B73A" : "transparent",
                  border: "2px solid #E0B73A",
                  borderRadius: 0,
                  px: 2.5,
                  py: 0.8,
                  "&:hover": { background: filter === c.key ? "#fff" : "rgba(224,183,58,0.1)" },
                }}
              >
                {c.label}
              </Button>
            ))}
          </Stack>
        )}

        {phil.isError ? (<QueryError message="Unable to load philanthropy." onRetry={() => phil.refetch()} />) : phil.isLoading ? (
          <CardGridSkeleton count={6} />
        ) : !all.length ? (
          <EmptyState subject={SUBJECT} variant="illustrated" title="The roll is being filled." body="Foundation cards land here as Sharaf and the team back fighters and communities."  />
        ) : items.length === 0 ? (
          <EmptyState subject={SUBJECT} eyebrow="Filter" title="Nothing in this division yet." body="Try another card category, or see the full roll."  />
        ) : (
          <StaggerGroup>
          <Grid container spacing={3} >
            {items.map((p, i) => (
              <Grid item xs={12} md={6} lg={4} key={p.id} >
                <StaggerItem>
                  <FightCard p={p} index={i} />
                </StaggerItem>
              </Grid>
            ))}
          </Grid>
          </StaggerGroup>
        )}

        {/* Marquee */}
        {all.length > 0 && (
          <Box sx={{ background: "#E0B73A", color: "#0B0B0B", py: 1, overflow: "hidden", borderTop: "2px solid #D62828", mt: 8, mx: -3 }}>
            <Box sx={{
              display: "flex", whiteSpace: "nowrap", animation: "marquee 30s linear infinite",
              fontFamily: '"Bebas Neue", sans-serif', fontSize: 14, letterSpacing: "0.32em",
              "& span": { px: 4 },
              "@keyframes marquee": { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
            
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },}}>
              {Array(2).fill(0).map((_, j) => (
                <Box key={j} sx={{ display: "flex" }}>
                  <span>★ EVERY CARD COUNTS</span>
                  <span>★ BACKED BY THE CORNER</span>
                  <span>★ BUKOM RISES</span>
                  <span>★ THE FOUNDATION ROLL</span>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
