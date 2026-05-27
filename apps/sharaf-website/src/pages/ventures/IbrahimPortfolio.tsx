import { useQuery } from "@tanstack/react-query";
import { Box, Container, Typography, Stack, Grid } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { VentureGridSkeleton } from "@mahama/website-core";
import { EmptyState } from "@mahama/website-core";
import { Seo } from "@mahama/website-core";
import { BlueprintGrid } from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;

const SECTOR_CODE: Record<string, string> = {
  "Mining services & civil engineering": "MIN-001",
  "Cement manufacturing": "CEM-001",
  "Agriculture & food": "AGR-001",
  "Heavy equipment & logistics": "HVY-001",
  "Gold mining": "MIN-002",
};

function codeFor(sector: string, idx: number): string {
  if (SECTOR_CODE[sector]) return SECTOR_CODE[sector]!;
  return `OPS-${String(idx + 1).padStart(3, "0")}`;
}

export function IbrahimPortfolio() {
  const ventures = useQuery({ queryKey: ["ventures"], queryFn: () => api.listVentures() });
  const list = ventures.data ?? [];

  // Aggregate stats across portfolio
  const totalEmployees = list.reduce((sum, v) => {
    const m = v.metrics.find((x) => x.label.toLowerCase().includes("employee"));
    if (!m) return sum;
    const n = Number(m.value.replace(/[^\d]/g, ""));
    return sum + (Number.isNaN(n) ? 0 : n);
  }, 0);

  return (
    <Box sx={{ background: "#08090C", color: "#F2EDE2", position: "relative", minHeight: "100vh" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Industrial Holdings" path="/ventures"  />
      <BlueprintGrid />
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, py: { xs: 8, md: 12 } }}>
        {/* Filing header */}
        <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "baseline" }} spacing={3} sx={{ mb: 6 }}>
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.4em", color: "#C9A227", textTransform: "uppercase" }}>
            Document · Group Holdings Register
          </Typography>
          <Box sx={{ flex: 1, height: "1px", background: "rgba(201,162,39,0.32)", display: { xs: "none", md: "block" } }} />
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "rgba(242,237,226,0.55)", textTransform: "uppercase" }}>
            Filing · {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "short" })}
          </Typography>
        </Stack>

        {/* Title */}
        <Box sx={{ mb: 8 }}>
          <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 56, md: 96 }, lineHeight: 0.95, fontWeight: 600 }}>
            Industrial<br />Holdings.
          </Typography>
          <Typography sx={{ mt: 2, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 22, color: "#C9A227", maxWidth: 640 }}>
            The operating entities under the office of Ibrahim Mahama — mining, cement, agriculture, equipment, and gold.
          </Typography>
        </Box>

        {/* Group structure overview band */}
        {list.length > 0 && (
          <Grid container sx={{ borderTop: "1px solid rgba(201,162,39,0.32)", borderBottom: "1px solid rgba(201,162,39,0.32)", mb: 10 }}>
            <Grid item xs={6} md={3} sx={{ py: 4, px: 3, borderRight: { md: "1px solid rgba(201,162,39,0.16)" } }}>
              <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 44, md: 64 }, lineHeight: 0.95, color: "#F2EDE2" }}>
                {String(list.length).padStart(2, "0")}
              </Typography>
              <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.28em", color: "#C9A227", textTransform: "uppercase", mt: 1 }}>
                Operating Entities
              </Typography>
            </Grid>
            <Grid item xs={6} md={3} sx={{ py: 4, px: 3, borderRight: { md: "1px solid rgba(201,162,39,0.16)" } }}>
              <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 44, md: 64 }, lineHeight: 0.95, color: "#F2EDE2" }}>
                {totalEmployees ? `${(totalEmployees / 1000).toFixed(1)}K+` : "—"}
              </Typography>
              <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.28em", color: "#C9A227", textTransform: "uppercase", mt: 1 }}>
                Group Workforce
              </Typography>
            </Grid>
            <Grid item xs={6} md={3} sx={{ py: 4, px: 3, borderRight: { md: "1px solid rgba(201,162,39,0.16)" } }}>
              <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 44, md: 64 }, lineHeight: 0.95, color: "#F2EDE2" }}>
                3
              </Typography>
              <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.28em", color: "#C9A227", textTransform: "uppercase", mt: 1 }}>
                Countries · GH · LR · SL
              </Typography>
            </Grid>
            <Grid item xs={6} md={3} sx={{ py: 4, px: 3 }}>
              <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 44, md: 64 }, lineHeight: 0.95, color: "#F2EDE2" }}>
                1997
              </Typography>
              <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.28em", color: "#C9A227", textTransform: "uppercase", mt: 1 }}>
                Anchor · E&P Founded
              </Typography>
            </Grid>
          </Grid>
        )}

        {ventures.isLoading ? (
          <VentureGridSkeleton count={4} />
        ) : !list.length ? (
          <EmptyState subject={SUBJECT} title="The register is empty for now." body="Operating entities will be filed here as they are formalised under the group."  />
        ) : (
          <Stack spacing={0} divider={<Box sx={{ borderTop: "1px solid rgba(201,162,39,0.18)" }} />}>
            {list.map((v, i) => (
              <Box
                key={v.id}
                sx={{
                  py: 6,
                  px: { xs: 0, md: 1 },
                  transition: "background 0.18s",
                  "&:hover": { background: "rgba(201,162,39,0.04)" },
                }}
              >
                <Grid container spacing={4} >
                  {/* Identifier column */}
                  <Grid item xs={12} md={2} >
                    <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.28em", color: "#C9A227", textTransform: "uppercase", mb: 1 }}>
                      Entity {String(i + 1).padStart(2, "0")}
                    </Typography>
                    <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 13, color: "rgba(242,237,226,0.55)", letterSpacing: "0.16em", mb: 2 }}>
                      {codeFor(v.sector, i)}
                    </Typography>
                    <Typography sx={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic", fontSize: 28, color: "#C9A227" }}>
                      {v.founded ?? "—"}
                    </Typography>
                    <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.28em", color: "rgba(242,237,226,0.4)", textTransform: "uppercase", mt: 0.5 }}>
                      Founded
                    </Typography>
                  </Grid>

                  {/* Body — name + role + summary + highlights */}
                  <Grid item xs={12} md={7} >
                    <Stack direction="row" alignItems="baseline" spacing={2} sx={{ mb: 1 }}>
                      <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 32, md: 44 }, lineHeight: 1.05, fontWeight: 600 }}>
                        {v.name}
                      </Typography>
                      {v.featured && (
                        <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, letterSpacing: "0.32em", color: "#08090C", background: "#C9A227", px: 1, py: 0.5, textTransform: "uppercase" }}>
                          Flagship
                        </Typography>
                      )}
                    </Stack>
                    <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, letterSpacing: "0.28em", color: "rgba(242,237,226,0.55)", textTransform: "uppercase", mb: 2 }}>
                      {v.sector} · {v.role}
                    </Typography>
                    <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 19, lineHeight: 1.65, color: "rgba(242,237,226,0.92)", mb: 3, maxWidth: 640 }}>
                      {v.summary}
                    </Typography>
                    {v.highlights?.length > 0 && (
                      <Stack spacing={0.75} >
                        {v.highlights.map((h, hi) => (
                          <Stack key={hi} direction="row" alignItems="baseline" spacing={1.5} >
                            <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: "#C9A227", minWidth: 16 }}>
                              {String(hi + 1).padStart(2, "0")}
                            </Typography>
                            <Typography sx={{ fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 14, color: "rgba(242,237,226,0.78)" }}>
                              {h}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    )}
                    {v.websiteUrl && (
                      <Box
                        component="a"
                        href={v.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        sx={{
                          mt: 3,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 1,
                          color: "#C9A227",
                          textDecoration: "none",
                          fontFamily: '"IBM Plex Sans", sans-serif',
                          fontSize: 12,
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                          borderBottom: "1px solid #C9A227",
                          pb: 0.5,
                          "&:hover": { color: "#F2EDE2", borderColor: "#F2EDE2" },
                        }}
                      >
                        Open file <ArrowOutwardIcon sx={{ fontSize: 14 }} />
                      </Box>
                    )}
                  </Grid>

                  {/* Metrics column — numeric ledger */}
                  <Grid item xs={12} md={3} >
                    <Box sx={{ border: "1px solid rgba(201,162,39,0.32)", p: 2.5, height: "100%" }}>
                      <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, letterSpacing: "0.4em", color: "#C9A227", textTransform: "uppercase", pb: 1.5, borderBottom: "1px solid rgba(201,162,39,0.16)", mb: 1.5 }}>
                        Operating Metrics
                      </Typography>
                      {v.metrics.length === 0 ? (
                        <Typography sx={{ fontSize: 12, opacity: 0.5, fontStyle: "italic", fontFamily: '"Cormorant Garamond", serif' }}>
                          On record · figures forthcoming
                        </Typography>
                      ) : (
                        <Stack spacing={1.5} >
                          {v.metrics.map((m) => (
                            <Stack key={m.label} direction="row" justifyContent="space-between" alignItems="baseline">
                              <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.18em", color: "rgba(242,237,226,0.55)", textTransform: "uppercase" }}>
                                {m.label}
                              </Typography>
                              <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: 18, color: "#C9A227", fontWeight: 600 }}>
                                {m.value}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Stack>
        )}

        {/* Closing colophon */}
        {list.length > 0 && (
          <Box sx={{ mt: 12, pt: 4, borderTop: "1px solid rgba(201,162,39,0.32)", display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 2 }}>
            <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "rgba(242,237,226,0.45)", textTransform: "uppercase" }}>
              End of Register · {list.length} entities
            </Typography>
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 20, color: "#C9A227" }}>
              We go where others fear to tread.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
