import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@mahama/i18n";
import { Box, Container, Typography, Stack, Grid, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { FlattenLocalized, EventDTO } from "@mahama/shared-types";
import { CardGridSkeleton } from "@mahama/website-core";
import { EmptyState } from "@mahama/website-core";
import { Seo } from "@mahama/website-core";
import { HalftoneDots, BoxingGloves, RingCorner } from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;
import { normalizeLang } from "@mahama/shared-types";
import { resolveLocalized } from "@mahama/shared-types";

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

function FightPoster({ e, index, isMain }: { e: EventDTO; index: number; isMain?: boolean }) {
  const tone = TONES[index % TONES.length]!;
  const isBlack = index % TONES.length === 0;
  const d = new Date(e.startsAt);
  const past = +d < Date.now();

  return (
    <Box sx={{
      background: tone.bg,
      color: tone.fg,
      position: "relative",
      overflow: "hidden",
      border: isBlack ? "2px solid rgba(224,183,58,0.32)" : "none",
      transition: "transform 0.22s",
      "&:hover": { transform: "translateY(-6px)", boxShadow: "0 24px 48px rgba(0,0,0,0.4)" },
    }}>
      <HalftoneDots color={isBlack ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"} />

      {/* Ring corners */}
      <Box sx={{ position: "absolute", top: 0, left: 0, color: tone.accent, opacity: 0.5 }}>
        <RingCorner size={50} color={tone.accent} />
      </Box>
      <Box sx={{ position: "absolute", top: 0, right: 0, color: tone.accent, opacity: 0.5, transform: "scaleX(-1)" }}>
        <RingCorner size={50} color={tone.accent} />
      </Box>

      <Grid container alignItems="stretch" sx={{ position: "relative", zIndex: 1 }}>
        {/* Date plate */}
        <Grid item xs={12} md={4} sx={{ p: { xs: 4, md: 5 }, borderBottom: { xs: `2px solid ${tone.accent}`, md: "none" }, borderRight: { md: `2px solid ${tone.accent}` }, textAlign: "center" }}>
          <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 16, letterSpacing: "0.4em", color: tone.num, fontWeight: 700, mb: 1 }}>
            {d.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase()}
          </Typography>
          <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 96, md: 160 }, lineHeight: 0.85, letterSpacing: "0.02em" }}>
            {String(d.getDate()).padStart(2, "0")}
          </Typography>
          <Stack direction="row" alignItems="baseline" justifyContent="center" spacing={1.5} sx={{ mt: 1 }}>
            <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: 26, md: 36 }, letterSpacing: "0.18em" }}>
              {d.toLocaleDateString("en-GB", { month: "long" }).toUpperCase()}
            </Typography>
            <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: 20, md: 28 }, color: tone.num, letterSpacing: "0.18em" }}>
              '{String(d.getFullYear()).slice(-2)}
            </Typography>
          </Stack>
          <Typography sx={{ mt: 2, fontFamily: '"Inter", sans-serif', fontSize: 11, letterSpacing: "0.36em", color: tone.accent, textTransform: "uppercase", fontWeight: 700 }}>
            {d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Accra" })} GMT
          </Typography>
        </Grid>

        {/* Body */}
        <Grid item xs={12} md={6} sx={{ p: { xs: 3, md: 5 } }}>
          <Stack direction="row" spacing={1.5} sx={{ mb: 2, flexWrap: "wrap", rowGap: 1 }}>
            {isMain && (
              <Box sx={{ background: tone.num, color: tone.bg, px: 1.5, py: 0.5, fontFamily: '"Bebas Neue", sans-serif', fontSize: 13, letterSpacing: "0.32em", fontWeight: 700 }}>
                ★ MAIN EVENT
              </Box>
            )}
            <Box sx={{ background: tone.accent, color: tone.num, px: 1.5, py: 0.5, fontFamily: '"Bebas Neue", sans-serif', fontSize: 13, letterSpacing: "0.32em", fontWeight: 700 }}>
              ★ {e.category.toUpperCase()}
            </Box>
            {past && (
              <Box sx={{ border: `2px solid ${tone.accent}`, color: tone.accent, px: 1.5, py: 0.5, fontFamily: '"Bebas Neue", sans-serif', fontSize: 12, letterSpacing: "0.32em", fontWeight: 700 }}>
                ★ ON THE WALL
              </Box>
            )}
          </Stack>
          <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 36, md: 64 }, lineHeight: 0.95, letterSpacing: "0.02em", textTransform: "uppercase", mb: 2 }}>
            {resolveLocalized(e.title)}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <Box sx={{ flex: 1, maxWidth: 60, height: 2, background: tone.accent, opacity: 0.6 }} />
            <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 14, letterSpacing: "0.4em", color: tone.num, fontWeight: 700 }}>
              VS.
            </Typography>
            <Box sx={{ flex: 1, height: 2, background: tone.accent, opacity: 0.6 }} />
          </Stack>
          <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: 22, md: 30 }, letterSpacing: "0.04em", color: tone.accent, mb: 2, textTransform: "uppercase" }}>
            {resolveLocalized(e.venue)}
          </Typography>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 14, lineHeight: 1.55, opacity: 0.9, mb: 3 }}>
            {resolveLocalized(e.description)}
          </Typography>
          <Stack direction="row" spacing={2} >
            <Button
              component={RouterLink}
              to="/book"
              sx={{
                background: tone.num, color: tone.fg, fontFamily: '"Bebas Neue", sans-serif', fontSize: 14, letterSpacing: "0.32em",
                borderRadius: 0, px: 3, py: 1, "&:hover": { background: tone.accent, color: tone.num },
              }}
            >
              ★ RINGSIDE
            </Button>
            {e.url && (
              <Button
                component="a"
                href={e.url}
                target="_blank"
                rel="noreferrer"
                sx={{
                  border: `2px solid ${tone.accent}`, color: tone.accent, fontFamily: '"Bebas Neue", sans-serif', fontSize: 14, letterSpacing: "0.32em",
                  borderRadius: 0, px: 3, py: 1, "&:hover": { background: tone.accent, color: tone.num },
                }}
              >
                BROADCAST →
              </Button>
            )}
          </Stack>
        </Grid>

        {/* Right gutter */}
        <Grid item xs={12} md={2} sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", justifyContent: "center", p: 3 }}>
          <BoxingGloves size={104} color={tone.num} />
        </Grid>
      </Grid>

      {/* Card number stripe */}
      <Box sx={{ background: tone.accent, color: tone.num, py: 0.6, textAlign: "center", fontFamily: '"Bebas Neue", sans-serif', fontSize: 12, letterSpacing: "0.4em", fontWeight: 700, position: "relative", zIndex: 1 }}>
        ★ CARD {String(index + 1).padStart(2, "0")} ★ {resolveLocalized(e.city).toUpperCase()} ★ {e.country.toUpperCase()}
      </Box>
    </Box>
  );
}

export function SharafEvents() {
  const { i18n } = useTranslation();
    const events = useQuery({ queryKey: ["events", i18n.language], queryFn: () => api.listEvents(normalizeLang(i18n.language)) });
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  const sorted = useMemo(() => [...(events.data ?? [])].sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt)), [events.data]);
  const items = useMemo(() => {
    const now = Date.now();
    if (filter === "upcoming") return sorted.filter((e) => +new Date(e.startsAt) >= now);
    if (filter === "past") return sorted.filter((e) => +new Date(e.startsAt) < now);
    return sorted;
  }, [sorted, filter]);

  const main = items.find((e) => +new Date(e.startsAt) >= Date.now()) ?? items[0];

  return (
    <Box sx={{ background: "#0B0B0B", color: "#F4F1ED", position: "relative", overflow: "hidden" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Fight Card Schedule" path="/events"  />
      <HalftoneDots color="rgba(255,255,255,0.025)" />

      {/* Top kente strap */}
      <Box sx={{ display: "flex", height: 5 }}>
        <Box sx={{ flex: 1, background: "#D62828" }} />
        <Box sx={{ flex: 1, background: "#E0B73A" }} />
        <Box sx={{ flex: 1, background: "#0B4F2C" }} />
      </Box>

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, py: { xs: 6, md: 10 } }}>
        {/* Title slab */}
        <Box sx={{ mb: 6 }}>
          <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: 18, md: 24 }, letterSpacing: "0.5em", color: "#D62828", mb: 2 }}>
            ★ THE FIGHT CARD ★ EVERY NIGHT ★
          </Typography>
          <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 80, md: 200 }, lineHeight: 0.85, color: "#F4F1ED", letterSpacing: "0.02em" }}>
            FIGHT
          </Typography>
          <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 60, md: 140 }, lineHeight: 0.85, color: "#E0B73A", letterSpacing: "0.02em" }}>
            CARD.
          </Typography>
          <Typography sx={{ mt: 3, fontFamily: '"Inter", sans-serif', fontSize: 14, letterSpacing: "0.32em", color: "rgba(244,241,237,0.55)", textTransform: "uppercase" }}>
            Every fight night · Every venue · Every undercard
          </Typography>
        </Box>

        {/* Diagonal red strap */}
        <Box sx={{ background: "#D62828", color: "#0B0B0B", py: 1.25, mx: -3, transform: "skewY(-1deg)", mb: 6 }}>
          <Box sx={{ transform: "skewY(1deg)", textAlign: "center", fontFamily: '"Bebas Neue", sans-serif', fontSize: 16, letterSpacing: "0.36em", fontWeight: 700 }}>
            ★ TICKETS · DAZN · BUKOM ★ TICKETS · DAZN · BUKOM ★
          </Box>
        </Box>

        {/* Filter strip */}
        {sorted.length > 0 && (
          <Stack direction="row" spacing={1.5} sx={{ mb: 5, overflowX: "auto", "&::-webkit-scrollbar": { display: "none" } }}>
            {[
              { k: "all", label: "ALL CARDS", n: sorted.length },
              { k: "upcoming", label: "ON THE CARD", n: sorted.filter((e) => +new Date(e.startsAt) >= Date.now()).length },
              { k: "past", label: "ON THE WALL", n: sorted.filter((e) => +new Date(e.startsAt) < Date.now()).length },
            ].map((f) => (
              <Button
                key={f.k}
                onClick={() => setFilter(f.k as typeof filter)}
                disableRipple
                sx={{
                  flexShrink: 0,
                  fontFamily: '"Bebas Neue", sans-serif',
                  fontSize: 14,
                  letterSpacing: "0.36em",
                  color: filter === f.k ? "#0B0B0B" : "#E0B73A",
                  background: filter === f.k ? "#E0B73A" : "transparent",
                  border: "2px solid #E0B73A",
                  borderRadius: 0,
                  px: 2.5,
                  py: 0.8,
                  "&:hover": { background: filter === f.k ? "#fff" : "rgba(224,183,58,0.1)" },
                }}
              >
                {f.label} <Box component="span" sx={{ ml: 1, opacity: 0.7, fontSize: 11 }}>· {f.n}</Box>
              </Button>
            ))}
          </Stack>
        )}

        {events.isLoading ? (
          <CardGridSkeleton count={4} />
        ) : !sorted.length ? (
          <EmptyState subject={SUBJECT} variant="illustrated" title="Cards announced soon." body="The next Legacy Rise fight night and undercards drop here the moment they're locked." ctaLabel="Book ringside time" ctaTo="/book"  />
        ) : items.length === 0 ? (
          <EmptyState subject={SUBJECT} eyebrow="Filter" title="Nothing in this view." body="Try a different card view."  />
        ) : (
          <Stack spacing={4} >
            {items.map((e, i) => <FightPoster key={e.id} e={e} index={i} isMain={e === main} />)}
          </Stack>
        )}

        {/* Marquee */}
        {sorted.length > 0 && (
          <Box sx={{ background: "#E0B73A", color: "#0B0B0B", py: 1, overflow: "hidden", borderTop: "2px solid #D62828", mt: 8, mx: -3 }}>
            <Box sx={{
              display: "flex", whiteSpace: "nowrap", animation: "marquee 30s linear infinite",
              fontFamily: '"Bebas Neue", sans-serif', fontSize: 14, letterSpacing: "0.32em",
              "& span": { px: 4 },
              "@keyframes marquee": { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
            
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },}}>
              {Array(2).fill(0).map((_, j) => (
                <Box key={j} sx={{ display: "flex" }}>
                  <span>★ EVERY NIGHT IS A SHOW</span>
                  <span>★ BOOK RINGSIDE</span>
                  <span>★ BUKOM · ACCRA</span>
                  <span>★ LEGACY RISE</span>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
