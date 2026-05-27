import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@mahama/i18n";
import { Box, Container, Typography, Stack, Grid } from "@mui/material";
import type { TimelineEntryDTO } from "@mahama/shared-types";
import { TimelineSkeleton } from "@mahama/website-core";
import { EmptyState } from "@mahama/website-core";
import { Seo } from "@mahama/website-core";
import { KenteStripe, BlackStar, GyeNyame } from "@mahama/website-core";
import { StaggerGroup, StaggerItem } from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;
import { resolveLocalized } from "@mahama/shared-types";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

function decadeOf(year: string): string {
  const n = Number(year.slice(0, 4));
  if (Number.isNaN(n)) return "—";
  return `${Math.floor(n / 10) * 10}s`;
}

const FEATURED_YEARS = ["2012", "2014", "2025", "2026"];

export function JohnTimeline() {
  const { i18n } = useTranslation();
  const timeline = useQuery({ queryKey: ["timeline"], queryFn: () => api.listTimeline() });

  const grouped = useMemo(() => {
    const map = new Map<string, TimelineEntryDTO[]>();
    (timeline.data ?? []).forEach((t) => {
      const d = decadeOf(t.year);
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(t);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [timeline.data]);

  return (
    <Box sx={{ background: "#FBF8F1", color: "#0F1A14" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Years in Service" path="/timeline"  />
      <KenteStripe height={6} />

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        {/* Frontispiece */}
        <Box sx={{ textAlign: "center", mb: 10 }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 4 }}>
            <Box sx={{ flex: 1, maxWidth: 140, height: "1px", background: "#0B4F2C" }} />
            <BlackStar size={20} color="#0B4F2C" />
            <Box sx={{ flex: 1, maxWidth: 140, height: "1px", background: "#0B4F2C" }} />
          </Stack>
          <Typography sx={{ fontSize: 11, letterSpacing: "0.5em", color: "#8E1B25", textTransform: "uppercase", fontWeight: 700, mb: 2 }}>
            A Life in Public Service
          </Typography>
          <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: { xs: 48, md: 80 }, lineHeight: 0.95, color: "#0B4F2C", mb: 2, fontStyle: "italic" }}>
            Years in Service.
          </Typography>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 18, md: 22 }, color: "rgba(15,26,20,0.72)" }}>
            Damongo, 1958 — Jubilee House, today.
          </Typography>
        </Box>

        {timeline.isLoading ? (
          <TimelineSkeleton count={8} />
        ) : !timeline.data?.length ? (
          <EmptyState subject={SUBJECT} title="The chronicle is being written." body="Milestones from a life in public service will be catalogued here."  />
        ) : (
          <Stack spacing={10} >
            {grouped.map(([decade, entries], decadeIdx) => (
              <Box key={decade} >
                {/* Decade banner */}
                <Box sx={{ position: "relative", mb: 6, py: 4, px: { xs: 3, md: 6 }, background: "#0B4F2C", color: "#FBF8F1", overflow: "hidden" }}>
                  <Box sx={{ position: "absolute", top: -10, right: -10, opacity: 0.08 }}>
                    <BlackStar size={140} color="#D4AF37" />
                  </Box>
                  <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "baseline" }} spacing={3} sx={{ position: "relative" }}>
                    <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontSize: 56, color: "#D4AF37", fontStyle: "italic", lineHeight: 1, minWidth: 80 }}>
                      {ROMAN[decadeIdx] ?? decadeIdx + 1}
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: 11, letterSpacing: "0.4em", color: "#D4AF37", textTransform: "uppercase", fontWeight: 700, mb: 1 }}>
                        Chapter {ROMAN[decadeIdx] ?? decadeIdx + 1}
                      </Typography>
                      <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: { xs: 36, md: 56 }, lineHeight: 1, fontStyle: "italic" }}>
                        The {decade}.
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: 11, letterSpacing: "0.32em", color: "rgba(212,175,55,0.78)", textTransform: "uppercase", fontWeight: 700 }}>
                      {entries.length} {entries.length === 1 ? "milestone" : "milestones"}
                    </Typography>
                  </Stack>
                  <KenteStripe height={4} style={{ marginTop: 24 }} />
                </Box>

                {/* Entries — featured ones get a gilt frame */}
                <StaggerGroup>
                <Stack spacing={5} >
                  {entries.map((t) => {
                    const featured = FEATURED_YEARS.some((y) => t.year.startsWith(y));
                    return (
                      <StaggerItem key={t.id} >
                      <Grid container spacing={4} alignItems="flex-start">
                        <Grid item xs={12} md={3} >
                          <Box sx={{
                            position: { md: "sticky" },
                            top: { md: 100 },
                            textAlign: { md: "right" },
                            pr: { md: 2 },
                            borderRight: { md: "2px solid #D4AF37" },
                          }}>
                            <Typography sx={{
                              fontFamily: '"DM Serif Display", "Playfair Display", serif',
                              fontSize: { xs: 64, md: 96 },
                              lineHeight: 0.9,
                              color: "#0B4F2C",
                              fontStyle: "italic",
                              fontWeight: 400,
                            }}>
                              {t.year.slice(0, 4)}
                            </Typography>
                            <Typography sx={{ mt: 1, fontSize: 10, letterSpacing: "0.36em", color: "#8E1B25", textTransform: "uppercase", fontWeight: 700 }}>
                              {t.category.replace("-", " ")}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={9} >
                          {featured ? (
                            <Box sx={{
                              p: { xs: 3, md: 5 },
                              background: "#fff",
                              border: "2px solid #D4AF37",
                              boxShadow: "0 24px 48px rgba(11,79,44,0.08)",
                              position: "relative",
                            }}>
                              <Box sx={{ position: "absolute", top: -14, left: 24, background: "#FBF8F1", px: 2, fontSize: 10, letterSpacing: "0.36em", color: "#8E1B25", textTransform: "uppercase", fontWeight: 700 }}>
                                ★ Office of State Significance
                              </Box>
                              <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: { xs: 26, md: 36 }, lineHeight: 1.15, color: "#0B4F2C", mb: 2 }}>
                                {resolveLocalized(t.title)}
                              </Typography>
                              <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 20, lineHeight: 1.65, color: "#1a261d" }}>
                                {resolveLocalized(t.description)}
                              </Typography>
                            </Box>
                          ) : (
                            <>
                              <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: { xs: 24, md: 30 }, lineHeight: 1.2, color: "#0B4F2C", mb: 1.5 }}>
                                {resolveLocalized(t.title)}
                              </Typography>
                              <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 19, lineHeight: 1.7, color: "rgba(15,26,20,0.85)" }}>
                                {resolveLocalized(t.description)}
                              </Typography>
                            </>
                          )}
                        </Grid>
                      </Grid>
                      </StaggerItem>
                    );
                  })}
                </Stack>
                </StaggerGroup>
              </Box>
            ))}
          </Stack>
        )}

        {/* Closing seal */}
        {(timeline.data ?? []).length > 0 && (
          <Box sx={{ mt: 14, textAlign: "center" }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} >
              <Box sx={{ flex: 1, maxWidth: 160, height: "1px", background: "#0B4F2C" }} />
              <GyeNyame size={28} color="#0B4F2C" />
              <Box sx={{ flex: 1, maxWidth: 160, height: "1px", background: "#0B4F2C" }} />
            </Stack>
            <Typography sx={{ mt: 2, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 18, color: "rgba(15,26,20,0.6)" }}>
              In the service of the Republic.
            </Typography>
          </Box>
        )}
      </Container>
      <KenteStripe height={4} />
    </Box>
  );
}
