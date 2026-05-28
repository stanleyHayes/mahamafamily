import { useQuery } from "@tanstack/react-query";
import { Box, Container, Typography, Stack, Grid } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { BoxingGloves, EmptyState, HalftoneDots, QueryError, RingCorner, Seo, VentureGridSkeleton , BreadcrumbSchema} from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;

interface ToneCfg {
  bg: string;
  fg: string;
  accent: string;
  num: string;
}

const TONES: ToneCfg[] = [
  { bg: "#0B0B0B", fg: "#F4F1ED", accent: "#E0B73A", num: "#D62828" }, // black with gold
  { bg: "#E0B73A", fg: "#0B0B0B", accent: "#D62828", num: "#0B0B0B" }, // yellow with red
  { bg: "#D62828", fg: "#0B0B0B", accent: "#E0B73A", num: "#0B0B0B" }, // red with gold
];

export function SharafPortfolio() {
  const ventures = useQuery({ queryKey: ["ventures"], queryFn: () => api.listVentures() });
  const list = ventures.data ?? [];

  return (
    <Box sx={{ background: "#0B0B0B", color: "#F4F1ED", position: "relative", overflow: "hidden" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="The Operation" path="/ventures"  />
      <BreadcrumbSchema
        baseUrl={window.location.origin}
        items={[{ name: "Home", path: "/" }, { name: "Ventures", path: "/ventures" }]}
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
            ★ THE OPERATION ★ INSIDE THE SHOP ★
          </Typography>
          <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 80, md: 200 }, lineHeight: 0.85, color: "#F4F1ED", letterSpacing: "0.02em" }}>
            THE
          </Typography>
          <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 80, md: 200 }, lineHeight: 0.85, color: "#E0B73A", letterSpacing: "0.02em" }}>
            OPERATION.
          </Typography>
          <Typography sx={{ mt: 3, fontFamily: '"Inter", sans-serif', fontSize: 14, letterSpacing: "0.32em", color: "rgba(244,241,237,0.55)", textTransform: "uppercase" }}>
            Companies · Foundations · Representations · The whole shop
          </Typography>
        </Box>

        {/* Diagonal red strap */}
        <Box sx={{ background: "#D62828", color: "#0B0B0B", py: 1.25, mx: -3, transform: "skewY(-1deg)", mb: 8 }}>
          <Box sx={{ transform: "skewY(1deg)", textAlign: "center", fontFamily: '"Bebas Neue", sans-serif', fontSize: 16, letterSpacing: "0.36em", fontWeight: 700 }}>
            ★ MEET THE TEAM ★ MEET THE TEAM ★ MEET THE TEAM ★
          </Box>
        </Box>

        {ventures.isError ? (<QueryError message="Unable to load ventures." onRetry={() => ventures.refetch()} />) : ventures.isLoading ? (
          <VentureGridSkeleton count={3} />
        ) : !list.length ? (
          <EmptyState subject={SUBJECT} title="The shop is being set up." body="Companies, foundations, and representations will be posted here as the operation grows."  />
        ) : (
          <Stack spacing={4} >
            {list.map((v, i) => {
              const tone = TONES[i % TONES.length]!;
              return (
                <Box
                  key={v.id}
                  sx={{
                    background: tone.bg,
                    color: tone.fg,
                    position: "relative",
                    overflow: "hidden",
                    border: i % TONES.length === 0 ? "2px solid rgba(224,183,58,0.32)" : "none",
                  }}
                >
                  <HalftoneDots color={i % TONES.length === 0 ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)"} />

                  {/* Card number stripe */}
                  <Box sx={{ position: "absolute", top: 16, left: 16, color: tone.num, fontFamily: '"Bebas Neue", sans-serif', fontSize: 12, letterSpacing: "0.4em", fontWeight: 700 }}>
                    ★ ENTRY {String(i + 1).padStart(2, "0")} ★
                  </Box>

                  {/* Ring corners */}
                  <Box sx={{ position: "absolute", top: 0, right: 0, color: tone.accent, opacity: 0.45 }}>
                    <RingCorner size={64} color={tone.accent} />
                  </Box>

                  <Grid container spacing={0} alignItems="stretch" sx={{ position: "relative", zIndex: 1 }}>
                    {/* Identifier panel */}
                    <Grid item xs={12} md={2.5} sx={{
                      background: tone.accent,
                      color: tone.num,
                      p: { xs: 3, md: 4 },
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: { xs: "flex-start", md: "center" },
                      textAlign: { xs: "left", md: "center" },
                    }}>
                      <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 12, letterSpacing: "0.4em", opacity: 0.78 }}>
                        {v.featured ? "★ FLAGSHIP" : "ON THE CARD"}
                      </Typography>
                      <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 56, md: 96 }, lineHeight: 0.85, my: 1 }}>
                        {String(i + 1).padStart(2, "0")}
                      </Typography>
                      <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 13, letterSpacing: "0.32em", textTransform: "uppercase" }}>
                        {v.founded ? `Est. '${String(v.founded).slice(-2)}` : "—"}
                      </Typography>
                    </Grid>

                    {/* Body */}
                    <Grid item xs={12} md={6.5} sx={{ p: { xs: 3, md: 5 } }}>
                      <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 12, letterSpacing: "0.4em", color: tone.accent, fontWeight: 700, mb: 1 }}>
                        ★ {v.sector.toUpperCase()}
                      </Typography>
                      <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 44, md: 84 }, lineHeight: 0.9, letterSpacing: "0.02em", mb: 2 }}>
                        {v.name.toUpperCase()}
                      </Typography>
                      <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 16, letterSpacing: "0.32em", color: tone.accent, textTransform: "uppercase", mb: 3 }}>
                        VS · {v.role}
                      </Typography>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 16, lineHeight: 1.65, opacity: 0.9, maxWidth: 560 }}>
                        {v.summary}
                      </Typography>
                      {v.highlights?.length > 0 && (
                        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mt: 3 }}>
                          {v.highlights.slice(0, 4).map((h, hi) => (
                            <Box
                              key={hi}
                              sx={{
                                px: 1.5,
                                py: 0.6,
                                border: `2px solid ${tone.accent}`,
                                fontFamily: '"Bebas Neue", sans-serif',
                                fontSize: 12,
                                letterSpacing: "0.2em",
                                textTransform: "uppercase",
                                color: tone.accent,
                              }}
                            >
                              ★ {h}
                            </Box>
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
                            mt: 4,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 1,
                            color: tone.accent,
                            textDecoration: "none",
                            fontFamily: '"Bebas Neue", sans-serif',
                            fontSize: 16,
                            letterSpacing: "0.32em",
                            textTransform: "uppercase",
                            fontWeight: 700,
                            borderBottom: `2px solid ${tone.accent}`,
                            pb: 0.5,
                            "&:hover": { color: tone.fg, borderColor: tone.fg },
                          }}
                        >
                          Open the file <ArrowOutwardIcon sx={{ fontSize: 18 }} />
                        </Box>
                      )}
                    </Grid>

                    {/* Metrics column */}
                    <Grid item xs={12} md={3} sx={{ p: { xs: 3, md: 4 }, borderLeft: { md: `2px solid ${tone.accent}` } }}>
                      <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 12, letterSpacing: "0.4em", color: tone.accent, fontWeight: 700, mb: 2 }}>
                        ★ TALE OF THE TAPE
                      </Typography>
                      {v.metrics.length === 0 ? (
                        <Typography sx={{ fontSize: 13, opacity: 0.65, fontFamily: '"Inter", sans-serif', fontStyle: "italic" }}>
                          Numbers TBC.
                        </Typography>
                      ) : (
                        <Stack spacing={2.5} >
                          {v.metrics.map((m) => (
                            <Box key={m.label} >
                              <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 11, letterSpacing: "0.36em", color: tone.accent, mb: 0.25 }}>
                                {m.label.toUpperCase()}
                              </Typography>
                              <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: 36, lineHeight: 0.95, color: tone.fg, letterSpacing: "0.02em" }}>
                                {m.value}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              );
            })}
          </Stack>
        )}

        {/* Closing strip */}
        {list.length > 0 && (
          <>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mt: 10, mb: 4 }}>
              <Box sx={{ flex: 1, height: 2, background: "#D62828", maxWidth: 200 }} />
              <BoxingGloves size={56} color="#E0B73A" />
              <Box sx={{ flex: 1, height: 2, background: "#D62828", maxWidth: 200 }} />
            </Box>
            <Typography sx={{ textAlign: "center", fontFamily: '"Bebas Neue", sans-serif', fontSize: 14, letterSpacing: "0.5em", color: "rgba(244,241,237,0.45)" }}>
              ★ FROM BUKOM TO THE WORLD ★
            </Typography>
          </>
        )}
      </Container>
    </Box>
  );
}
