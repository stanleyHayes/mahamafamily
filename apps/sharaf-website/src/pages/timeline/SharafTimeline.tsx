import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@mahama/i18n";
import { Box, Container, Typography, Stack, Grid } from "@mui/material";
import { BoxingGloves, EmptyState, HalftoneDots, QueryError, Seo, StaggerGroup, StaggerItem, TimelineSkeleton , BreadcrumbSchema} from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;

function dateParts(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { day: "—", mon: "", year: iso.slice(0, 4) };
  return {
    day: String(d.getDate()).padStart(2, "0"),
    mon: d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase(),
    year: String(d.getFullYear()),
    weekday: d.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase(),
  };
}

export function SharafTimeline() {
  const { i18n } = useTranslation();
  const timeline = useQuery({ queryKey: ["timeline"], queryFn: () => api.listTimeline() });

  return (
    <Box sx={{ background: "#0B0B0B", color: "#F4F1ED", position: "relative", overflow: "hidden" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Career · Fight Card Calendar" path="/timeline"  />
      <BreadcrumbSchema
        baseUrl={window.location.origin}
        items={[{ name: "Home", path: "/" }, { name: "Timeline", path: "/timeline" }]}
      />
      <HalftoneDots color="rgba(255,255,255,0.025)" />

      {/* Top kente strap */}
      <Box sx={{ display: "flex", height: 5 }}>
        <Box sx={{ flex: 1, background: "#D62828" }} />
        <Box sx={{ flex: 1, background: "#E0B73A" }} />
        <Box sx={{ flex: 1, background: "#0B4F2C" }} />
      </Box>

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, py: { xs: 6, md: 10 } }}>
        {/* Title slab */}
        <Box sx={{ mb: 8 }}>
          <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: 18, md: 24 }, letterSpacing: "0.5em", color: "#D62828", mb: 2 }}>
            ★ THE CARD HISTORY ★ THE FULL RECORD ★
          </Typography>
          <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 80, md: 200 }, lineHeight: 0.85, color: "#F4F1ED", letterSpacing: "0.02em" }}>
            CAREER
          </Typography>
          <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 60, md: 140 }, lineHeight: 0.85, color: "#E0B73A", letterSpacing: "0.02em" }}>
            CALENDAR.
          </Typography>
          <Typography sx={{ mt: 3, fontFamily: '"Inter", sans-serif', fontSize: 14, letterSpacing: "0.32em", color: "rgba(244,241,237,0.55)", textTransform: "uppercase" }}>
            Every card · every venue · every milestone
          </Typography>
        </Box>

        {/* Diagonal separator strap */}
        <Box sx={{ background: "#D62828", color: "#0B0B0B", py: 1.25, mx: -3, transform: "skewY(-1deg)", mb: 8 }}>
          <Box sx={{ transform: "skewY(1deg)", textAlign: "center", fontFamily: '"Bebas Neue", sans-serif', fontSize: 16, letterSpacing: "0.36em", fontWeight: 700 }}>
            ★ ROUND ONE ★ ROUND ONE ★ ROUND ONE ★
          </Box>
        </Box>

        {timeline.isError ? (<QueryError message="Unable to load timeline." onRetry={() => timeline.refetch()} />) : timeline.isLoading ? (
          <TimelineSkeleton count={6} />
        ) : !timeline.data?.length ? (
          <EmptyState subject={SUBJECT} title="The card is being written." body="Career milestones — football, FIFA agency, fight nights — drop here as they get scheduled."  />
        ) : (
          <StaggerGroup>
          <Stack spacing={4} >
            {(timeline.data ?? []).map((t, i) => {
              const { day, mon, year, weekday } = dateParts(t.date);
              const tone = i % 3; // 0 = black/yellow, 1 = yellow/black, 2 = red/black
              const isYellow = tone === 1;
              const isRed = tone === 2;
              const cardBg = isYellow ? "#E0B73A" : isRed ? "#D62828" : "#0B0B0B";
              const cardFg = isYellow || isRed ? "#0B0B0B" : "#F4F1ED";
              const accentBg = isYellow ? "#0B0B0B" : isRed ? "#0B0B0B" : "#E0B73A";
              const accentFg = isYellow ? "#E0B73A" : isRed ? "#D62828" : "#0B0B0B";
              const numberColor = isYellow ? "#D62828" : isRed ? "#E0B73A" : "#D62828";

              return (
                <StaggerItem key={t.id} >
                <Box
                  sx={{
                    background: cardBg,
                    color: cardFg,
                    position: "relative",
                    overflow: "hidden",
                    border: tone === 0 ? "2px solid rgba(224,183,58,0.3)" : "none",
                  }}
                >
                  <HalftoneDots color={tone === 0 ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)"} />
                  <Grid container alignItems="stretch" sx={{ position: "relative", zIndex: 1 }}>
                    {/* Card number on far left */}
                    <Grid item xs={12} md={1.5} sx={{ background: accentBg, color: accentFg, p: { xs: 2, md: 3 }, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                      <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 11, letterSpacing: "0.32em", opacity: 0.78 }}>
                        CARD
                      </Typography>
                      <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 56, md: 80 }, lineHeight: 0.85 }}>
                        {String(i + 1).padStart(2, "0")}
                      </Typography>
                    </Grid>

                    {/* Date plate */}
                    <Grid item xs={6} md={2.5} sx={{ p: { xs: 3, md: 4 }, borderRight: { md: "2px solid rgba(0,0,0,0.18)" }, borderBottom: { xs: "2px solid rgba(0,0,0,0.18)", md: "none" } }}>
                      {weekday && (
                        <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 14, letterSpacing: "0.32em", color: numberColor, mb: 0.5 }}>
                          {weekday}
                        </Typography>
                      )}
                      <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 80, md: 120 }, lineHeight: 0.8, letterSpacing: "0.02em" }}>
                        {day}
                      </Typography>
                      <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 0.5 }}>
                        <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: 24, md: 32 }, letterSpacing: "0.18em" }}>
                          {mon}
                        </Typography>
                        <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: 18, md: 22 }, letterSpacing: "0.18em", color: numberColor }}>
                          '{year.slice(2)}
                        </Typography>
                      </Stack>
                    </Grid>

                    {/* Event body */}
                    <Grid item xs={12} md={6} sx={{ p: { xs: 3, md: 4 } }}>
                      <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 12, letterSpacing: "0.36em", color: numberColor, fontWeight: 700, mb: 1 }}>
                        ★ {t.category.replace("-", " ").toUpperCase()}
                      </Typography>
                      <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 32, md: 48 }, lineHeight: 1, letterSpacing: "0.02em", mb: 2 }}>
                        {t.title.toUpperCase()}
                      </Typography>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 15, lineHeight: 1.55, opacity: 0.85, maxWidth: 560 }}>
                        {t.description}
                      </Typography>
                    </Grid>

                    {/* Right glove gutter */}
                    <Grid item xs={6} md={2} sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2, opacity: 0.6 }}>
                      <BoxingGloves size={92} color={numberColor} />
                    </Grid>
                  </Grid>
                </Box>
                </StaggerItem>
              );
            })}
          </Stack>
          </StaggerGroup>
        )}

        {/* Marquee at the bottom */}
        {(timeline.data ?? []).length > 0 && (
          <Box sx={{ background: "#E0B73A", color: "#0B0B0B", py: 1.25, overflow: "hidden", borderTop: "2px solid #D62828", mt: 10, mx: -3 }}>
            <Box sx={{
              display: "flex", whiteSpace: "nowrap", animation: "marquee 36s linear infinite",
              fontFamily: '"Bebas Neue", sans-serif', fontSize: 14, letterSpacing: "0.32em",
              "& span": { px: 4 },
              "@keyframes marquee": { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
            
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },}}>
              {Array(2).fill(0).map((_, j) => (
                <Box key={j} sx={{ display: "flex" }}>
                  <span>★ {(timeline.data ?? []).length} cards on the wall</span>
                  <span>★ Bukom rising</span>
                  <span>★ Africa next</span>
                  <span>★ Legacy Rise</span>
                  <span>★ The story continues</span>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
