import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@mahama/i18n";
import { Box, Container, Typography, Stack, Grid } from "@mui/material";
import type { TimelineEntryDTO } from "@mahama/shared-types";
import { TimelineSkeleton } from "@mahama/website-core";
import { EmptyState } from "@mahama/website-core";
import { Seo } from "@mahama/website-core";
import { BlueprintGrid } from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;
import { resolveLocalized } from "@mahama/shared-types";

const CAT_REF: Record<string, string> = {
  career: "CAR",
  education: "EDU",
  political: "POL",
  philanthropy: "PHL",
  personal: "PSL",
  award: "AWD",
  other: "OTH",
};

const CAT_GLYPH: Record<string, string> = {
  career: "▲",
  education: "◆",
  political: "★",
  philanthropy: "✚",
  personal: "○",
  award: "❖",
  other: "·",
};

function decadeOf(year: string): string {
  const n = Number(year.slice(0, 4));
  if (Number.isNaN(n)) return "—";
  return `${Math.floor(n / 10) * 10}s`;
}

export function IbrahimTimeline() {
  const { i18n } = useTranslation();
  const timeline = useQuery({ queryKey: ["timeline"], queryFn: () => api.listTimeline() });
  const [active, setActive] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<string, TimelineEntryDTO[]>();
    (timeline.data ?? []).forEach((t) => {
      const d = decadeOf(t.year);
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(t);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [timeline.data]);

  const decades = grouped.map(([d]) => d);
  const total = (timeline.data ?? []).length;

  return (
    <Box sx={{ background: "#08090C", color: "#F2EDE2", position: "relative", minHeight: "100vh" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Operations Log" path="/timeline"  />
      <BlueprintGrid />
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, py: { xs: 8, md: 12 } }}>
        {/* Document header */}
        <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "baseline" }} spacing={3} sx={{ mb: 6 }}>
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.4em", color: "#C9A227", textTransform: "uppercase" }}>
            Operations Log
          </Typography>
          <Box sx={{ flex: 1, height: "1px", background: "rgba(201,162,39,0.32)", display: { xs: "none", md: "block" } }} />
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "rgba(242,237,226,0.5)", textTransform: "uppercase" }}>
            Entries · {total}
          </Typography>
        </Stack>

        {/* Title slab */}
        <Box sx={{ mb: 8 }}>
          <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 56, md: 96 }, lineHeight: 0.95, fontWeight: 600 }}>
            Chronicle.
          </Typography>
          <Typography sx={{ mt: 2, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 22, color: "#C9A227", maxWidth: 540 }}>
            A register of operations, ventures and consequence — Damongo to Damang, 1971 onwards.
          </Typography>
        </Box>

        {/* Decade strip */}
        {decades.length > 0 && (
          <Box sx={{ mb: 8, position: "sticky", top: 90, zIndex: 5, background: "rgba(8,9,14,0.95)", py: 2, backdropFilter: "blur(8px)", borderTop: "1px solid rgba(201,162,39,0.18)", borderBottom: "1px solid rgba(201,162,39,0.18)" }}>
            <Stack direction="row" spacing={3} sx={{ overflowX: "auto", "&::-webkit-scrollbar": { display: "none" } }}>
              {decades.map((d) => (
                <Box
                  key={d}
                  component="a"
                  href={`#decade-${d}`}
                  onClick={() => setActive(d)}
                  sx={{
                    flexShrink: 0,
                    textDecoration: "none",
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: 11,
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    color: active === d ? "#C9A227" : "rgba(242,237,226,0.55)",
                    borderBottom: "2px solid",
                    borderColor: active === d ? "#C9A227" : "transparent",
                    py: 1,
                    px: 1,
                    transition: "color 0.2s, border-color 0.2s",
                    "&:hover": { color: "#C9A227" },
                  }}
                >
                  {d}
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {timeline.isLoading ? (
          <TimelineSkeleton count={8} />
        ) : !timeline.data?.length ? (
          <EmptyState subject={SUBJECT} title="The log is being assembled." body="Every milestone — birth, founding, takeover, donation — will appear here as it is logged."  />
        ) : (
          <Stack spacing={10} >
            {grouped.map(([d, entries]) => (
              <Box key={d} id={`decade-${d}`}>
                {/* Decade header */}
                <Grid container spacing={4} sx={{ mb: 4, alignItems: "baseline" }}>
                  <Grid item xs={12} md={3} >
                    <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 80, md: 140 }, lineHeight: 0.85, fontStyle: "italic", color: "#C9A227", opacity: 0.85 }}>
                      {d}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={9} >
                    <Box sx={{ height: "1px", background: "rgba(201,162,39,0.4)", mb: 2 }} />
                    <Stack direction="row" spacing={3} alignItems="baseline">
                      <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "rgba(242,237,226,0.55)", textTransform: "uppercase" }}>
                        {entries.length} {entries.length === 1 ? "entry" : "entries"}
                      </Typography>
                      <Box sx={{ flex: 1, height: "1px", background: "rgba(201,162,39,0.16)" }} />
                    </Stack>
                  </Grid>
                </Grid>

                {/* Register table */}
                <Stack divider={<Box sx={{ borderTop: "1px solid rgba(201,162,39,0.12)" }} />}>
                  {entries.map((t, i) => (
                    <Box
                      key={t.id}
                      sx={{
                        py: 3,
                        px: 2,
                        transition: "background 0.16s",
                        "&:hover": { background: "rgba(201,162,39,0.06)", "& .arrow": { opacity: 1, transform: "translateX(4px)" } },
                      }}
                    >
                      <Grid container spacing={3} alignItems="baseline">
                        <Grid item xs={4} md={1} >
                          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: "rgba(242,237,226,0.4)", letterSpacing: "0.2em" }}>
                            ENT-{String(i + 1).padStart(3, "0")}
                          </Typography>
                        </Grid>
                        <Grid item xs={8} md={1} >
                          <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: 26, color: "#C9A227", fontWeight: 600, letterSpacing: "0.04em" }}>
                            {t.year}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={7} >
                          <Stack direction="row" spacing={1.5} alignItems="baseline">
                            <Typography sx={{ color: "#C9A227", fontSize: 16 }}>
                              {CAT_GLYPH[t.category] ?? "·"}
                            </Typography>
                            <Box sx={{ flex: 1 }}>
                              <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 20, md: 24 }, lineHeight: 1.2, color: "#F2EDE2" }}>
                                {resolveLocalized(t.title)}
                              </Typography>
                              <Typography sx={{ mt: 0.75, fontFamily: '"Cormorant Garamond", serif', fontSize: 16, lineHeight: 1.55, color: "rgba(242,237,226,0.78)", fontStyle: "italic" }}>
                                {resolveLocalized(t.description)}
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>
                        <Grid item xs={6} md={2} >
                          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "rgba(242,237,226,0.55)", textTransform: "uppercase" }}>
                            {CAT_REF[t.category] ?? "OTH"} · {t.category.replace("-", " ")}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} md={1} >
                          <Box className="arrow" sx={{ textAlign: "right", fontFamily: '"IBM Plex Mono", monospace', fontSize: 14, color: "#C9A227", opacity: 0, transition: "opacity 0.16s, transform 0.16s" }}>
                            →
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        )}

        {/* Closing rule */}
        {(timeline.data ?? []).length > 0 && (
          <Box sx={{ mt: 12, pt: 4, borderTop: "1px solid rgba(201,162,39,0.32)", display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 2 }}>
            <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "rgba(242,237,226,0.45)", textTransform: "uppercase" }}>
              End of Log · {total} entries
            </Typography>
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 18, color: "#C9A227" }}>
              Ad astra per aspera.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
