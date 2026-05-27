import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@mahama/i18n";
import { Box, Container, Typography, Stack, Grid } from "@mui/material";
import { ProfileSkeleton, OptimizedImage, EmptyState, Seo, QueryError, KenteStripe, BlackStar, GyeNyame, Sankofa } from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export function JohnAbout() {
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
  // Split bio paragraphs into named chapters
  const paragraphs = (p.bio ?? "").split("\n\n");
  const chapters = [
    { roman: "I", title: "Origins", paragraphs: paragraphs.slice(0, 1) },
    { roman: "II", title: "Public Service", paragraphs: paragraphs.slice(1, 2) },
    { roman: "III", title: "The Presidency", paragraphs: paragraphs.slice(2) },
  ].filter((c) => c.paragraphs.length > 0 && c.paragraphs.some((p) => p));

  return (
    <Box sx={{ background: "#FBF8F1", color: "#0F1A14" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Biography" path="/about"  />
      <KenteStripe height={6} />

      <Container maxWidth="md" sx={{ py: { xs: 8, md: 14 } }}>
        {/* Frontispiece */}
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 10 } }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 4 }}>
            <Box sx={{ flex: 1, maxWidth: 100, height: "1px", background: "#0B4F2C" }} />
            <BlackStar size={20} color="#0B4F2C" />
            <Box sx={{ flex: 1, maxWidth: 100, height: "1px", background: "#0B4F2C" }} />
          </Stack>
          <Typography sx={{ fontSize: 11, letterSpacing: "0.5em", color: "#8E1B25", textTransform: "uppercase", fontFamily: '"Inter", sans-serif', fontWeight: 700, mb: 2 }}>
            A Biographical Sketch
          </Typography>
          <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: { xs: 12, md: 14 }, fontStyle: "italic", color: "#0B4F2C", mb: 1 }}>
            His Excellency
          </Typography>
          <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: { xs: 44, md: 76 }, lineHeight: 0.95, color: "#0B4F2C" }}>
            {p.fullName}
          </Typography>
          <Typography sx={{ mt: 3, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 18, md: 22 }, color: "rgba(15,26,20,0.72)" }}>
            {p.title}
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mt: 4 }}>
            <Box sx={{ width: 4, height: 4, background: "#D4AF37" }} />
            <Typography sx={{ fontSize: 11, letterSpacing: "0.4em", color: "rgba(15,26,20,0.55)", textTransform: "uppercase", fontWeight: 600 }}>
              Born {new Date(p.birthDate).getFullYear()} · {p.birthPlace}
            </Typography>
            <Box sx={{ width: 4, height: 4, background: "#D4AF37" }} />
          </Stack>
        </Box>

        {/* Portrait — bordered with kente accent */}
        {p.portraitUrl && (
          <Box sx={{ position: "relative", mb: 10, mx: "auto", maxWidth: 540 }}>
            <Box sx={{ position: "absolute", top: -6, left: -6, right: 6, bottom: 6, background: "#D4AF37", zIndex: 0 }} />
            <OptimizedImage
  src={p.portraitUrl}
  alt={p.fullName}
  sx={{ position: "relative", width: "100%", display: "block", zIndex: 1 }}
  imgSx={{ filter: "sepia(0.06) contrast(1.04)" }}
/>
            <Typography sx={{ mt: 3, textAlign: "center", fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 14, color: "rgba(15,26,20,0.6)" }}>
              His Excellency at the Office of the President, Jubilee House, Accra.
            </Typography>
          </Box>
        )}

        {/* Chapters with Roman numerals + Adinkra glyph in side gutter */}
        {chapters.map((c, idx) => (
          <Box key={c.roman} sx={{ mt: 8, mb: 8 }}>
            <Grid container spacing={4} alignItems="flex-start">
              <Grid item xs={12} md={2} >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, position: { md: "sticky" }, top: { md: 120 } }}>
                  {idx === 0 ? <Sankofa size={28} color="#0B4F2C" /> : idx === 1 ? <BlackStar size={20} color="#0B4F2C" /> : <GyeNyame size={32} color="#0B4F2C" />}
                  <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontSize: 56, color: "#D4AF37", lineHeight: 1, fontStyle: "italic" }}>
                    {c.roman}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={10} >
                <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: { xs: 28, md: 36 }, color: "#0B4F2C", mb: 3, lineHeight: 1.1 }}>
                  {c.title}
                </Typography>
                {c.paragraphs.map((para, i) => (
                  <Typography key={i} sx={{
                    mb: 3,
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: 20,
                    lineHeight: 1.7,
                    color: "#1a261d",
                    "&:first-of-type::first-letter": idx === 0 ? {
                      fontFamily: '"DM Serif Display", serif',
                      float: "left",
                      fontSize: 72,
                      lineHeight: 0.9,
                      paddingRight: "10px",
                      color: "#0B4F2C",
                    } : undefined,
                  }}>
                    {para}
                  </Typography>
                ))}
              </Grid>
            </Grid>
          </Box>
        ))}

        {/* Notable utterances */}
        {(quotes.data ?? []).length > 0 && (
          <Box sx={{ mt: 10 }}>
            <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: 4 }}>
              <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontSize: 32, color: "#0B4F2C", fontStyle: "italic" }}>
                In His Words
              </Typography>
              <Box sx={{ flex: 1, height: "1px", background: "#0B4F2C", opacity: 0.4 }} />
            </Stack>
            <Stack spacing={3} >
              {(quotes.data ?? []).map((q) => (
                <Box key={q.id} sx={{ p: 4, background: "#fff", borderLeft: "5px solid #0B4F2C", borderRight: "1px solid rgba(11,79,44,0.12)", borderTop: "1px solid rgba(11,79,44,0.12)", borderBottom: "1px solid rgba(11,79,44,0.12)", boxShadow: "0 12px 30px rgba(11,79,44,0.06)" }}>
                  <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 24, lineHeight: 1.5, color: "#0F1A14" }}>
                    "{q.text}"
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
                    <Box sx={{ width: 24, height: "1px", background: "#D4AF37" }} />
                    <Typography sx={{ fontSize: 11, letterSpacing: "0.32em", color: "#8E1B25", textTransform: "uppercase", fontWeight: 700 }}>
                      {q.context}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {/* Standing as statesman — honours roll */}
        {(achievements.data ?? []).length > 0 && (
          <Box sx={{ mt: 12, p: { xs: 4, md: 6 }, background: "#0B4F2C", color: "#FBF8F1", position: "relative", overflow: "hidden" }}>
            <Box sx={{ position: "absolute", top: -30, right: -30, opacity: 0.07 }}>
              <BlackStar size={260} color="#D4AF37" />
            </Box>
            <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 32, md: 44 }, color: "#FBF8F1", mb: 1, position: "relative" }}>
              Standing as Statesman
            </Typography>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 11, letterSpacing: "0.4em", color: "#D4AF37", textTransform: "uppercase", fontWeight: 700, mb: 4, position: "relative" }}>
              Honours · Recognitions · Distinctions
            </Typography>
            <Stack spacing={3} sx={{ position: "relative" }}>
              {(achievements.data ?? []).map((a) => (
                <Stack key={a.id} direction={{ xs: "column", sm: "row" }} alignItems="baseline" spacing={3} sx={{ pb: 3, borderBottom: "1px solid rgba(212,175,55,0.18)" }}>
                  <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontSize: 32, color: "#D4AF37", fontStyle: "italic", minWidth: 80 }}>
                    {a.year}
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: 22, color: "#FBF8F1" }}>
                      {a.title}
                    </Typography>
                    {(a.awarder || a.description) && (
                      <Typography sx={{ fontSize: 14, opacity: 0.78, mt: 0.5, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic" }}>
                        {a.awarder ? `${a.awarder}. ` : ""}{a.description}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Box>
        )}

        {/* Closing seal */}
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mt: 10 }}>
          <Box sx={{ flex: 1, maxWidth: 140, height: "1px", background: "#0B4F2C" }} />
          <GyeNyame size={28} color="#0B4F2C" />
          <Box sx={{ flex: 1, maxWidth: 140, height: "1px", background: "#0B4F2C" }} />
        </Stack>
        <Typography sx={{ textAlign: "center", mt: 2, fontSize: 10, letterSpacing: "0.4em", color: "rgba(15,26,20,0.45)", textTransform: "uppercase", fontWeight: 600 }}>
          Office of the President · Republic of Ghana
        </Typography>
      </Container>
      <KenteStripe height={4} />
    </Box>
  );
}
