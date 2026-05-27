import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@mahama/i18n";
import { Box, Container, Grid, Typography, Stack, Divider } from "@mui/material";
import { ProfileSkeleton, OptimizedImage, EmptyState, Seo, BlueprintGrid, QueryError } from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;

export function IbrahimAbout() {
  const { i18n } = useTranslation();
  const profile = useQuery({ queryKey: ["profile"], queryFn: () => api.getProfile() });
  const achievements = useQuery({ queryKey: ["achievements"], queryFn: () => api.listAchievements() });
  const quotes = useQuery({ queryKey: ["quotes"], queryFn: () => api.listQuotes() });
  const timeline = useQuery({ queryKey: ["timeline"], queryFn: () => api.listTimeline() });

  if (profile.isLoading) return <><Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Biography" path="/about"  /><ProfileSkeleton /></>;
  if (profile.isError) return <QueryError message="Unable to load profile." onRetry={() => profile.refetch()} />;
  if (!profile.data) return (
    <Container maxWidth="md" sx={{ py: 14 }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Biography" path="/about"  />
      <EmptyState subject={SUBJECT} title="Biography to follow." body="The full account is being prepared."  />
    </Container>
  );

  const p = profile.data;
  const paragraphs = (p.bio ?? "").split("\n\n");
  const featuredQuote = quotes.data?.find((q) => q.featured) ?? quotes.data?.[0];
  const careerYears = (timeline.data ?? []).filter((t) => t.category === "career" || t.category === "award").slice(0, 8);

  return (
    <Box sx={{ background: "#08090C", color: "#F2EDE2", position: "relative", minHeight: "100vh" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Dossier" path="/about"  />
      <BlueprintGrid />
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, py: { xs: 8, md: 12 } }}>
        {/* Document header — like a corporate filing */}
        <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "baseline" }} spacing={3} sx={{ mb: 8 }}>
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, letterSpacing: "0.4em", color: "#C9A227", textTransform: "uppercase" }}>
            Document · Biographical Dossier
          </Typography>
          <Box sx={{ flex: 1, height: "1px", background: "rgba(201,162,39,0.32)", display: { xs: "none", md: "block" } }} />
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, letterSpacing: "0.32em", color: "rgba(242,237,226,0.5)", textTransform: "uppercase" }}>
            Filed · {new Date(p.updatedAt).toLocaleDateString("en-GB", { year: "numeric", month: "short" })}
          </Typography>
        </Stack>

        {/* Title slab */}
        <Box sx={{ mb: 8 }}>
          <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 48, md: 96 }, lineHeight: 0.95, fontWeight: 600, color: "#F2EDE2" }}>
            {p.fullName}
          </Typography>
          <Typography sx={{ mt: 2, fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 16, letterSpacing: "0.04em", color: "#C9A227", maxWidth: 680 }}>
            {p.title}
          </Typography>
        </Box>

        <Grid container spacing={6} >
          {/* Identity Sheet — data card */}
          <Grid item xs={12} md={4} >
            <Box sx={{ border: "1px solid rgba(201,162,39,0.32)", p: 3 }}>
              <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, letterSpacing: "0.4em", color: "#C9A227", textTransform: "uppercase", pb: 2, borderBottom: "1px solid rgba(201,162,39,0.16)" }}>
                Identity Sheet
              </Typography>
              <Stack divider={<Divider sx={{ borderColor: "rgba(201,162,39,0.12)" }} />} sx={{ "& > div": { py: 1.5 } }}>
                <DataRow k="Full Name" v={p.fullName} />
                <DataRow k="Born" v={`${p.birthDate}${p.birthPlace ? ` · ${p.birthPlace}` : ""}`} />
                {p.hometown && <DataRow k="Hometown" v={p.hometown} />}
                {p.ethnicity && <DataRow k="Heritage" v={p.ethnicity} />}
                {p.religion && <DataRow k="Faith" v={p.religion} />}
                {p.spouse && <DataRow k="Spouse" v={p.spouse} />}
                {p.children && <DataRow k="Children" v={p.children} />}
              </Stack>
            </Box>

            {p.portraitUrl && (
              <Box sx={{ mt: 3, position: "relative" }}>
                <OptimizedImage
  src={p.portraitUrl}
  alt={p.fullName}
  sx={{ width: "100%", display: "block" }}
  imgSx={{ filter: "grayscale(0.2) contrast(1.05)" }}
/>
                <Typography sx={{ position: "absolute", bottom: 8, left: 8, fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, color: "#F2EDE2", background: "rgba(0,0,0,0.6)", px: 1, py: 0.5, letterSpacing: "0.24em", textTransform: "uppercase" }}>
                  Plate · 01
                </Typography>
              </Box>
            )}

            {/* Career arc ledger */}
            {careerYears.length > 0 && (
              <Box sx={{ mt: 4, border: "1px solid rgba(201,162,39,0.32)", p: 3 }}>
                <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, letterSpacing: "0.4em", color: "#C9A227", textTransform: "uppercase", pb: 2, borderBottom: "1px solid rgba(201,162,39,0.16)" }}>
                  Career Arc
                </Typography>
                <Stack spacing={1.4} sx={{ mt: 2 }}>
                  {careerYears.map((c, i) => (
                    <Stack key={c.id} direction="row" alignItems="baseline" spacing={2} >
                      <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: "rgba(242,237,226,0.5)", minWidth: 22 }}>
                        {String(i + 1).padStart(2, "0")}
                      </Typography>
                      <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, color: "#C9A227", minWidth: 40, letterSpacing: "0.08em" }}>
                        {c.year}
                      </Typography>
                      <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: 14, lineHeight: 1.3, flex: 1 }}>
                        {c.title}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            )}
          </Grid>

          {/* Long-form essay — multi-column print layout */}
          <Grid item xs={12} md={8} >
            <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, letterSpacing: "0.4em", color: "#C9A227", textTransform: "uppercase", mb: 3 }}>
              Section I · The Account
            </Typography>
            <Box sx={{
              columnCount: { md: 2 },
              columnGap: 6,
              "& p": { mb: 3, fontSize: 17.5, lineHeight: 1.75, fontFamily: '"Cormorant Garamond", serif', textAlign: "justify", hyphens: "auto" },
              "& p:first-of-type::first-letter": { fontFamily: '"Playfair Display", serif', float: "left", fontSize: 78, lineHeight: 0.85, paddingRight: "10px", paddingTop: "6px", color: "#C9A227", fontWeight: 600 },
            }}>
              {paragraphs.map((para, i) => (
                <Typography component="p" key={i} >{para}</Typography>
              ))}
            </Box>

            {featuredQuote && (
              <Box sx={{ my: 8, py: 5, borderTop: "1px solid rgba(201,162,39,0.32)", borderBottom: "1px solid rgba(201,162,39,0.32)" }}>
                <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: 200, color: "#C9A227", opacity: 0.18, lineHeight: 0.4, mb: -2 }}>"</Typography>
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 28, md: 38 }, lineHeight: 1.3, color: "#F2EDE2" }}>
                  {featuredQuote.text}
                </Typography>
                <Typography sx={{ mt: 2, fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "#C9A227", textTransform: "uppercase" }}>
                  — {featuredQuote.context}
                </Typography>
              </Box>
            )}

            {/* Honours — numbered ledger */}
            {(achievements.data ?? []).length > 0 && (
              <Box sx={{ mt: 8 }}>
                <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, letterSpacing: "0.4em", color: "#C9A227", textTransform: "uppercase", mb: 3 }}>
                  Section II · Honours & Recognition
                </Typography>
                <Stack divider={<Divider sx={{ borderColor: "rgba(201,162,39,0.12)" }} />}>
                  {(achievements.data ?? []).map((a, i) => (
                    <Stack key={a.id} direction="row" alignItems="baseline" spacing={3} sx={{ py: 2.5 }}>
                      <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: "rgba(242,237,226,0.4)", minWidth: 28 }}>
                        {String(i + 1).padStart(2, "0")}
                      </Typography>
                      <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: 14, color: "#C9A227", letterSpacing: "0.04em", minWidth: 60 }}>
                        {a.year}
                      </Typography>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: 19, lineHeight: 1.3 }}>{a.title}</Typography>
                        {(a.awarder || a.description) && (
                          <Typography sx={{ fontSize: 13, opacity: 0.6, mt: 0.5, fontFamily: '"IBM Plex Sans", sans-serif' }}>
                            {a.awarder ? `${a.awarder} · ` : ""}{a.description}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Closing colophon */}
        <Box sx={{ mt: 12, pt: 4, borderTop: "1px solid rgba(201,162,39,0.32)", display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 2 }}>
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "rgba(242,237,226,0.45)", textTransform: "uppercase" }}>
            End of Document
          </Typography>
          <Typography sx={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic", fontSize: 22, color: "#C9A227" }}>
            I.M.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

function DataRow({ k, v }: { k: string; v: string }) {
  return (
    <Stack direction="row" spacing={2} alignItems="baseline">
      <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, letterSpacing: "0.28em", color: "rgba(242,237,226,0.45)", textTransform: "uppercase", minWidth: 88 }}>
        {k}
      </Typography>
      <Typography sx={{ flex: 1, fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 13.5, color: "#F2EDE2" }}>
        {v}
      </Typography>
    </Stack>
  );
}
