import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@mahama/i18n";
import { Box, Container, Typography, Stack, Grid } from "@mui/material";
import type { TimelineEntryDTO } from "@mahama/shared-types";
import { TimelineSkeleton } from "@mahama/website-core";
import { EmptyState } from "@mahama/website-core";
import { Seo } from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;
import { LORDINA, INVITATION_CLIP } from "../lordina/theme.js";
import { Hibiscus, Ribbon, Garland, PaperTexture, Mmusuyidee } from "../lordina/motifs.js";
import { resolveLocalized } from "@mahama/shared-types";

const FEATURED_YEARS = ["2012", "2013", "2014", "2015", "2025", "2026"];

function decadeOf(year: string): string {
  const n = Number(year.slice(0, 4));
  if (Number.isNaN(n)) return "—";
  return `${Math.floor(n / 10) * 10}s`;
}

export function LordinaTimeline() {
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
    <Box sx={{ background: LORDINA.paper, color: LORDINA.ink, position: "relative", minHeight: "100vh" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="A Life of Service" path="/timeline"  />
      <PaperTexture />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: { xs: 8, md: 12 } }}>
        {/* Frontispiece */}
        <Box sx={{ textAlign: "center", mb: 10 }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 3 }}>
            <Garland width={120} color={LORDINA.sage} />
            <Hibiscus size={28} color={LORDINA.rose} />
            <Garland width={120} color={LORDINA.sage} />
          </Stack>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 14, letterSpacing: "0.4em", color: LORDINA.sage, textTransform: "uppercase", mb: 2 }}>
            A Life of Service
          </Typography>
          <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 48, md: 80 }, lineHeight: 0.95, color: LORDINA.roseDeep, mb: 2 }}>
            The Chronicle.
          </Typography>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 18, md: 22 }, color: LORDINA.inkSoft }}>
            Jema-Ampoma, 1963 — Jubilee House, today.
          </Typography>
        </Box>

        {timeline.isLoading ? (
          <TimelineSkeleton count={8} />
        ) : !timeline.data?.length ? (
          <EmptyState subject={SUBJECT} title="The chronicle is being written." body="Milestones from a life of service to women, children and the Foundation will be catalogued here."  />
        ) : (
          <Stack spacing={10} >
            {grouped.map(([decade, entries]) => (
              <Box key={decade} >
                {/* Decade banner — rose-on-paper */}
                <Box sx={{ position: "relative", mb: 6, py: 4, px: { xs: 3, md: 6 }, background: LORDINA.roseDeep, color: LORDINA.paper, overflow: "hidden" }}>
                  <Box sx={{ position: "absolute", top: -30, right: -30, opacity: 0.1 }}>
                    <Hibiscus size={200} color={LORDINA.gold} />
                  </Box>
                  <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "baseline" }} spacing={3} sx={{ position: "relative" }}>
                    <Mmusuyidee size={42} color={LORDINA.gold} />
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 13, letterSpacing: "0.4em", color: LORDINA.gold, textTransform: "uppercase", fontWeight: 600, mb: 1 }}>
                        Chapter
                      </Typography>
                      <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 36, md: 56 }, lineHeight: 1 }}>
                        The {decade}.
                      </Typography>
                    </Box>
                    <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 13, letterSpacing: "0.32em", color: LORDINA.gold, textTransform: "uppercase", fontWeight: 600 }}>
                      {entries.length} {entries.length === 1 ? "milestone" : "milestones"}
                    </Typography>
                  </Stack>
                </Box>

                <Stack spacing={5} >
                  {entries.map((t) => {
                    const featured = FEATURED_YEARS.some((y) => t.year.startsWith(y));
                    return (
                      <Grid container spacing={4} key={t.id} alignItems="flex-start">
                        <Grid item xs={12} md={3} >
                          <Box sx={{
                            position: { md: "sticky" },
                            top: { md: 100 },
                            textAlign: { md: "right" },
                            pr: { md: 2 },
                            borderRight: { md: `1px solid ${LORDINA.gold}` },
                          }}>
                            <Typography sx={{
                              fontFamily: '"DM Serif Display", "Playfair Display", serif',
                              fontStyle: "italic",
                              fontSize: { xs: 64, md: 96 },
                              lineHeight: 0.9,
                              color: LORDINA.roseDeep,
                              fontWeight: 400,
                            }}>
                              {t.year.slice(0, 4)}
                            </Typography>
                            <Typography sx={{ mt: 1, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 12, letterSpacing: "0.32em", color: LORDINA.sage, textTransform: "uppercase", fontWeight: 600 }}>
                              {t.category.replace("-", " ")}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={9} >
                          {featured ? (
                            <Box sx={{
                              p: { xs: 3, md: 5 },
                              pt: { xs: 5, md: 6 },
                              background: "#fff",
                              clipPath: INVITATION_CLIP,
                              position: "relative",
                              boxShadow: `inset 0 0 0 1px ${LORDINA.rule}`,
                            }}>
                              <Box sx={{ position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)" }}>
                                <Hibiscus size={22} color={LORDINA.rose} />
                              </Box>
                              <Box sx={{ position: "absolute", top: 36, left: 24, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 11, letterSpacing: "0.4em", color: LORDINA.gold, textTransform: "uppercase", fontWeight: 600 }}>
                                ❦ A Marker
                              </Box>
                              <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: { xs: 26, md: 36 }, lineHeight: 1.15, color: LORDINA.roseDeep, mb: 2, mt: 4 }}>
                                {resolveLocalized(t.title)}
                              </Typography>
                              <Box sx={{ mb: 2 }}>
                                <Ribbon width={80} color={LORDINA.gold} />
                              </Box>
                              <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 19, lineHeight: 1.65, color: LORDINA.inkSoft }}>
                                {resolveLocalized(t.description)}
                              </Typography>
                            </Box>
                          ) : (
                            <>
                              <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: { xs: 24, md: 30 }, lineHeight: 1.2, color: LORDINA.roseDeep, mb: 1.5 }}>
                                {resolveLocalized(t.title)}
                              </Typography>
                              <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 18, lineHeight: 1.7, color: LORDINA.inkSoft }}>
                                {resolveLocalized(t.description)}
                              </Typography>
                            </>
                          )}
                        </Grid>
                      </Grid>
                    );
                  })}
                </Stack>
              </Box>
            ))}
          </Stack>
        )}

        {(timeline.data ?? []).length > 0 && (
          <Box sx={{ mt: 14, textAlign: "center" }}>
            <Garland width={300} color={LORDINA.sage} />
            <Typography sx={{ mt: 1.5, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 18, color: LORDINA.inkMuted }}>
              In the service of women and children.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
