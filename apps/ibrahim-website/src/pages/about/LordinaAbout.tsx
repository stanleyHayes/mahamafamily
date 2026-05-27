import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@mahama/i18n";
import { Box, Container, Typography, Stack, Grid } from "@mui/material";
import {ProfileSkeleton, OptimizedImage, EmptyState, Seo, QueryError} from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;
import { LORDINA, HANDKERCHIEF_CLIP, INVITATION_CLIP } from "../lordina/theme.js";
import { Hibiscus, Ribbon, Garland, PaperTexture, Mmusuyidee } from "../lordina/motifs.js";

export function LordinaAbout() {
  const { i18n } = useTranslation();
  const profile = useQuery({ queryKey: ["profile"], queryFn: () => api.getProfile() });
  const achievements = useQuery({ queryKey: ["achievements"], queryFn: () => api.listAchievements() });
  const quotes = useQuery({ queryKey: ["quotes"], queryFn: () => api.listQuotes() });

  if (profile.isLoading) return <><Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Biography" path="/about"  /><ProfileSkeleton /></>;
  if (profile.isError) return <QueryError message="Unable to load profile." onRetry={() => profile.refetch()} />;
  if (!profile.data) return (
    <Container maxWidth="md" sx={{ py: 14 }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Biography" path="/about"  />
      <EmptyState subject={SUBJECT} title="Biography to follow." body="The full account is being prepared."  />
    </Container>
  );

  const p = profile.data;
  const paragraphs = (p.bio ?? "").split("\n\n").filter(Boolean);
  const chapters = [
    { title: "Origins", paragraphs: paragraphs.slice(0, 1) },
    { title: "The Foundation", paragraphs: paragraphs.slice(1, 2) },
    { title: "On the Continent", paragraphs: paragraphs.slice(2) },
  ].filter((c) => c.paragraphs.length > 0 && c.paragraphs.some((x) => x));

  return (
    <Box sx={{ background: LORDINA.paper, color: LORDINA.ink, position: "relative" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Biography" path="/about"  />
      <PaperTexture />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, py: { xs: 8, md: 14 } }}>
        {/* Frontispiece */}
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 10 } }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 3 }}>
            <Garland width={120} color={LORDINA.sage} />
            <Hibiscus size={26} color={LORDINA.rose} />
            <Garland width={120} color={LORDINA.sage} />
          </Stack>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 14, letterSpacing: "0.4em", color: LORDINA.sage, textTransform: "uppercase", mb: 2 }}>
            A Biographical Sketch
          </Typography>
          <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 14, md: 16 }, color: LORDINA.gold, letterSpacing: "0.18em", textTransform: "uppercase", mb: 1 }}>
            Her Excellency
          </Typography>
          <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 44, md: 76 }, lineHeight: 0.95, color: LORDINA.roseDeep }}>
            {p.fullName}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Ribbon width={140} color={LORDINA.gold} />
          </Box>
          <Typography sx={{ mt: 2, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 18, md: 22 }, color: LORDINA.inkSoft }}>
            {p.title}
          </Typography>
          {p.birthDate && p.birthPlace && (
            <Typography sx={{ mt: 3, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 13, letterSpacing: "0.32em", color: LORDINA.inkMuted, textTransform: "uppercase" }}>
              Born {new Date(p.birthDate).getFullYear()} · {p.birthPlace}
            </Typography>
          )}
        </Box>

        {/* Portrait — handkerchief silhouette */}
        {p.portraitUrl && (
          <Box sx={{ position: "relative", mb: 10, mx: "auto", maxWidth: 540 }}>
            <Box sx={{ position: "absolute", top: 10, left: 10, right: -10, bottom: -10, background: LORDINA.blush, clipPath: HANDKERCHIEF_CLIP, zIndex: 0 }} />
            <OptimizedImage
  src={p.portraitUrl}
  alt={p.fullName}
  sx={{ position: "relative", width: "100%", display: "block", zIndex: 1 }}
  imgSx={{ clipPath: HANDKERCHIEF_CLIP, filter: "sepia(8%) saturate(0.95)" }}
/>
            <Typography sx={{ mt: 3, textAlign: "center", fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 14, color: LORDINA.inkMuted }}>
              The First Lady at a Foundation engagement.
            </Typography>
          </Box>
        )}

        {/* Chapters */}
        {chapters.map((c, idx) => (
          <Box key={c.title} sx={{ mt: 8, mb: 8 }}>
            <Grid container spacing={4} alignItems="flex-start">
              <Grid item xs={12} md={3} >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, position: { md: "sticky" }, top: { md: 120 } }}>
                  {idx === 0 ? <Hibiscus size={28} color={LORDINA.rose} /> : idx === 1 ? <Mmusuyidee size={28} color={LORDINA.sage} /> : <Hibiscus size={28} color={LORDINA.gold} />}
                  <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontStyle: "italic", fontSize: 44, color: LORDINA.gold, lineHeight: 1 }}>
                    {String(idx + 1).padStart(2, "0")}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={9} >
                <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 28, md: 36 }, color: LORDINA.roseDeep, mb: 1, lineHeight: 1.1 }}>
                  {c.title}
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Ribbon width={80} color={LORDINA.gold} />
                </Box>
                {c.paragraphs.map((para, i) => (
                  <Typography key={i} sx={{
                    mb: 3,
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: 20,
                    lineHeight: 1.7,
                    color: LORDINA.inkSoft,
                    "&:first-of-type::first-letter": idx === 0 ? {
                      fontFamily: '"DM Serif Display", serif',
                      fontStyle: "italic",
                      float: "left",
                      fontSize: 72,
                      lineHeight: 0.9,
                      paddingRight: "10px",
                      color: LORDINA.roseDeep,
                    } : undefined,
                  }}>
                    {para}
                  </Typography>
                ))}
              </Grid>
            </Grid>
          </Box>
        ))}

        {/* In her own words */}
        {(quotes.data ?? []).length > 0 && (
          <Box sx={{ mt: 10 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
              <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontStyle: "italic", fontSize: 32, color: LORDINA.roseDeep }}>
                In Her Own Words
              </Typography>
              <Box sx={{ flex: 1, height: "1px", background: LORDINA.gold, opacity: 0.7 }} />
            </Stack>
            <Stack spacing={3} >
              {(quotes.data ?? []).map((q) => (
                <Box key={q.id} sx={{
                  position: "relative",
                  background: "#fff",
                  p: 4,
                  clipPath: INVITATION_CLIP,
                  pt: 5,
                }}>
                  <Box sx={{ position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)" }}>
                    <Hibiscus size={20} color={LORDINA.rose} />
                  </Box>
                  <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 22, lineHeight: 1.5, color: LORDINA.ink }}>
                    "{q.text}"
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
                    <Box sx={{ width: 24, height: "1px", background: LORDINA.gold }} />
                    <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 12, letterSpacing: "0.32em", color: LORDINA.sage, textTransform: "uppercase", fontWeight: 600 }}>
                      {q.context}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {/* Honours roll */}
        {(achievements.data ?? []).length > 0 && (
          <Box sx={{ mt: 12, p: { xs: 4, md: 6 }, background: LORDINA.roseDeep, color: LORDINA.paper, position: "relative", overflow: "hidden" }}>
            <Box sx={{ position: "absolute", top: -40, right: -40, opacity: 0.08 }}>
              <Hibiscus size={300} color={LORDINA.gold} />
            </Box>
            <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 32, md: 44 }, color: LORDINA.paper, mb: 1, position: "relative" }}>
              Honours &amp; Enstoolments
            </Typography>
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 13, letterSpacing: "0.4em", color: LORDINA.gold, textTransform: "uppercase", fontWeight: 600, mb: 4, position: "relative" }}>
              Doctorates · Recognitions · Stools
            </Typography>
            <Stack spacing={3} sx={{ position: "relative" }}>
              {(achievements.data ?? []).map((a) => (
                <Stack key={a.id} direction={{ xs: "column", sm: "row" }} alignItems="baseline" spacing={3} sx={{ pb: 3, borderBottom: `1px solid ${LORDINA.gold}33` }}>
                  <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontStyle: "italic", fontSize: 32, color: LORDINA.gold, minWidth: 80 }}>
                    {a.year}
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: 22, color: LORDINA.paper }}>
                      {a.title}
                    </Typography>
                    {(a.awarder || a.description) && (
                      <Typography sx={{ fontSize: 15, opacity: 0.86, mt: 0.5, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic" }}>
                        {a.awarder ? `${a.awarder}. ` : ""}{a.description}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Box>
        )}

        {/* Closing */}
        <Box sx={{ mt: 10, textAlign: "center" }}>
          <Garland width={300} color={LORDINA.sage} />
          <Typography sx={{ mt: 1.5, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 13, letterSpacing: "0.4em", color: LORDINA.inkMuted, textTransform: "uppercase" }}>
            Office of the First Lady · Republic of Ghana
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
