import { Box, Container, Typography, Stack, Grid } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink } from "react-router-dom";
import type { MeetingTypeDTO } from "@mahama/shared-types";
import { BoxingGloves, CardGridSkeleton, EmptyState, HalftoneDots, QueryError, Seo, BreadcrumbSchema} from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;

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

function BookingTile({ mt, index }: { mt: MeetingTypeDTO; index: number }) {
  const tone = TONES[index % TONES.length]!;
  const isBlack = index % TONES.length === 0;
  return (
    <Box
      component={RouterLink}
      to={`/book/${mt.slug}`}
      sx={{
        background: tone.bg,
        color: tone.fg,
        position: "relative",
        overflow: "visible",
        height: "100%",
        textDecoration: "none",
        display: "block",
        transition: "transform 0.22s, filter 0.22s",
        boxShadow: isBlack ? "inset 0 0 0 2px rgba(224,183,58,0.32)" : "none",
        // ticket-stub silhouette: top-right corner snipped + zig-zag perforation down the left edge
        clipPath: [
          "polygon(",
          "  0 0,",
          "  calc(100% - 28px) 0, 100% 28px,",
          "  100% 100%,",
          "  14px 100%, 6px 92%, 14px 84%, 6px 76%, 14px 68%, 6px 60%,",
          "  14px 52%, 6px 44%, 14px 36%, 6px 28%, 14px 20%, 6px 12%,",
          "  14px 4%, 6px 0",
          ")",
        ].join(""),
        pl: { xs: 1, md: 1.5 },
        "&:hover": {
          transform: "translateY(-6px)",
          filter: isBlack ? "brightness(1.18)" : "brightness(0.96)",
          "& .arrow": { transform: "translateX(6px)" },
        },
      }}
    >
      <HalftoneDots color={isBlack ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"} />

      {/* Top corner mark — sits below the snipped top-right corner */}
      <Box sx={{
        position: "absolute",
        top: 36,
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
        ★ SLOT {String(index + 1).padStart(2, "0")}
      </Box>

      <Box sx={{ p: { xs: 3, md: 4 }, position: "relative", zIndex: 1 }}>
        {/* Big duration */}
        <Stack direction="row" alignItems="baseline" spacing={2} sx={{ mb: 2 }}>
          <Typography sx={{
            fontFamily: '"Bebas Neue", "Anton", sans-serif',
            fontSize: { xs: 80, md: 120 },
            lineHeight: 0.85,
            color: tone.num,
            letterSpacing: "0.02em",
          }}>
            {mt.durationMinutes}
          </Typography>
          <Box sx={{ pb: 2 }}>
            <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 22, letterSpacing: "0.32em", fontWeight: 700, lineHeight: 0.9 }}>
              MIN
            </Typography>
            <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 12, letterSpacing: "0.32em", color: tone.accent, mt: 0.5 }}>
              ★ {mt.location.toUpperCase()}
            </Typography>
          </Box>
        </Stack>

        {/* VS divider */}
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Box sx={{ flex: 1, maxWidth: 50, height: 2, background: tone.accent, opacity: 0.6 }} />
          <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 12, letterSpacing: "0.4em", color: tone.num, fontWeight: 700 }}>
            VS.
          </Typography>
          <Box sx={{ flex: 1, height: 2, background: tone.accent, opacity: 0.6 }} />
        </Stack>

        {/* Title */}
        <Typography sx={{
          fontFamily: '"Bebas Neue", "Anton", sans-serif',
          fontSize: { xs: 30, md: 40 },
          lineHeight: 0.95,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
          mb: 2.5,
        }}>
          {mt.name}
        </Typography>

        {/* Body */}
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 14, lineHeight: 1.55, opacity: 0.9, mb: 3 }}>
          {mt.description}
        </Typography>

        {/* Stat strip */}
        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ pb: 3, mb: 3, borderBottom: `2px solid ${tone.accent}` }}>
          <Box sx={{ background: tone.num, color: tone.bg, px: 1.5, py: 0.5, fontFamily: '"Bebas Neue", sans-serif', fontSize: 13, letterSpacing: "0.22em", fontWeight: 700 }}>
            ★ {mt.noticeHours}H NOTICE
          </Box>
          <Box sx={{ border: `2px solid ${tone.num}`, color: tone.num, px: 1.5, py: 0.5, fontFamily: '"Bebas Neue", sans-serif', fontSize: 13, letterSpacing: "0.22em", fontWeight: 700 }}>
            ★ {mt.horizonDays}D AHEAD
          </Box>
        </Stack>

        {/* CTA */}
        <Stack direction="row" alignItems="center">
          <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 12, letterSpacing: "0.36em", color: tone.accent, fontWeight: 700 }}>
            ★ HOLD A SLOT
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Box className="arrow" sx={{ background: tone.accent, color: tone.num, px: 2, py: 1, fontFamily: '"Bebas Neue", sans-serif', fontSize: 16, letterSpacing: "0.22em", fontWeight: 700, transition: "transform 0.2s", display: "flex", alignItems: "center", gap: 0.5 }}>
            BOOK TIME
            <ArrowOutwardIcon sx={{ fontSize: 18 }} />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export function SharafBookIndex() {
  const types = useQuery({ queryKey: ["meeting-types"], queryFn: () => api.listMeetingTypes() });

  return (
    <Box sx={{ background: "#0B0B0B", color: "#F4F1ED", position: "relative", overflow: "hidden" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Book Time" path="/book"  />
      <BreadcrumbSchema
        baseUrl={window.location.origin}
        items={[{ name: "Home", path: "/" }, { name: "Book", path: "/book" }]}
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
            ★ THE OFFICE IS OPEN ★ STEP UP ★
          </Typography>
          <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 80, md: 200 }, lineHeight: 0.85, color: "#F4F1ED", letterSpacing: "0.02em" }}>
            BOOK
          </Typography>
          <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 60, md: 140 }, lineHeight: 0.85, color: "#E0B73A", letterSpacing: "0.02em" }}>
            TIME.
          </Typography>
          <Typography sx={{ mt: 3, fontFamily: '"Inter", sans-serif', fontSize: 14, letterSpacing: "0.32em", color: "rgba(244,241,237,0.55)", textTransform: "uppercase" }}>
            Press · Sponsorships · Fighter Reps · Ticketing — pick your card
          </Typography>
        </Box>

        {/* Stat strip */}
        {(types.data?.length ?? 0) > 0 && (
          <Box sx={{ background: "#E0B73A", color: "#0B0B0B", py: 3, px: { xs: 3, md: 5 }, mb: 6, position: "relative", overflow: "hidden" }}>
            <HalftoneDots color="rgba(0,0,0,0.06)" />
            <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }} spacing={3} sx={{ position: "relative" }}>
              <Stack direction="row" spacing={3} alignItems="baseline">
                <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 56, md: 80 }, lineHeight: 0.85, color: "#D62828" }}>
                  {String(types.data?.length ?? 0).padStart(2, "0")}
                </Typography>
                <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 14, letterSpacing: "0.32em" }}>
                  ★ TYPES OPEN
                </Typography>
              </Stack>
              <Box sx={{ flex: 1 }} />
              <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 16, letterSpacing: "0.32em", color: "#D62828", fontWeight: 700 }}>
                ★ AUTO-CONFIRMED
              </Typography>
              <Box sx={{ width: 2, height: 30, background: "#0B0B0B" }} />
              <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 16, letterSpacing: "0.32em", color: "#0B0B0B", fontWeight: 700 }}>
                ★ EMAIL REMINDERS
              </Typography>
              <BoxingGloves size={64} color="#D62828" />
            </Stack>
          </Box>
        )}

        {/* Diagonal red strap */}
        <Box sx={{ background: "#D62828", color: "#0B0B0B", py: 1.25, mx: -3, transform: "skewY(-1deg)", mb: 6 }}>
          <Box sx={{ transform: "skewY(1deg)", textAlign: "center", fontFamily: '"Bebas Neue", sans-serif', fontSize: 16, letterSpacing: "0.36em", fontWeight: 700 }}>
            ★ STEP UP ★ STEP UP ★ STEP UP ★ STEP UP ★ STEP UP ★
          </Box>
        </Box>

        {types.isError ? (<QueryError message="Unable to load meeting types." onRetry={() => types.refetch()} />) : types.isLoading ? (
          <CardGridSkeleton count={3} />
        ) : !types.data?.length ? (
          <EmptyState subject={SUBJECT} variant="illustrated" title="The office is closed for now." body="Public booking will reopen shortly. Stay ringside."  />
        ) : (
          <Grid container spacing={3} >
            {types.data.map((mt, i) => (
              <Grid item xs={12} md={6} lg={4} key={mt.id} >
                <BookingTile mt={mt} index={i} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Marquee */}
        {(types.data?.length ?? 0) > 0 && (
          <Box sx={{ background: "#E0B73A", color: "#0B0B0B", py: 1, overflow: "hidden", borderTop: "2px solid #D62828", mt: 8, mx: -3 }}>
            <Box sx={{
              display: "flex", whiteSpace: "nowrap", animation: "marquee 30s linear infinite",
              fontFamily: '"Bebas Neue", sans-serif', fontSize: 14, letterSpacing: "0.32em",
              "& span": { px: 4 },
              "@keyframes marquee": { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
            
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },}}>
              {Array(2).fill(0).map((_, j) => (
                <Box key={j} sx={{ display: "flex" }}>
                  <span>★ HOLD A SLOT</span>
                  <span>★ AUTO-CONFIRMED</span>
                  <span>★ ICS + GCAL</span>
                  <span>★ BUKOM CALLING</span>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
