import { useQuery } from "@tanstack/react-query";
import { Box, Container, Typography, Stack, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { FlattenLocalized, NewsPostDTO } from "@mahama/shared-types";
import { useTranslation } from "@mahama/i18n";
import { Seo } from "@mahama/website-core";
import { CardGridSkeleton } from "@mahama/website-core";
import { EmptyState } from "@mahama/website-core";
import { KenteStripe, BlackStar, GyeNyame } from "@mahama/website-core";
import { OptimizedImage } from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;
import { normalizeLang } from "@mahama/shared-types";
import { resolveLocalized } from "@mahama/shared-types";

// Notarised folio silhouette: bottom-corners snipped (folio fold) + a rounded seal disc
// rendered as an attached child element so the card silhouette reads as paper + seal.
const FOLIO_CLIP =
  "polygon(0 0, 100% 0, 100% calc(100% - 36px), calc(100% - 36px) 100%, 36px 100%, 0 calc(100% - 36px))";

function CommuniqueFolio({ p, index }: { p: NewsPostDTO; index: number }) {
  const d = p.publishedAt ? new Date(p.publishedAt) : null;
  const day = d ? String(d.getUTCDate()).padStart(2, "0") : "—";
  const mon = d ? d.toLocaleDateString("en-GB", { month: "long" }).toUpperCase() : "—";
  const yr = d ? String(d.getUTCFullYear()) : "";

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        component={RouterLink}
        to={`/news/${p.slug}`}
        sx={{
          position: "relative",
          display: "block",
          textDecoration: "none",
          color: "inherit",
          background: "#fff",
          clipPath: FOLIO_CLIP,
          height: "100%",
          pt: 0,
          pb: 6,
          boxShadow: "inset 0 0 0 1px rgba(11,79,44,0.18)",
          transition: "transform 0.2s, box-shadow 0.2s, filter 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            filter: "brightness(1.02)",
            boxShadow: "inset 0 0 0 1px #0B4F2C",
            "& .read": { color: "#8E1B25", transform: "translateX(4px)" },
          },
        }}
      >
        {/* Kente header strap */}
        <KenteStripe height={5} />

        <Box sx={{ p: { xs: 3, md: 3.5 } }}>
          {/* Frontispiece line */}
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <BlackStar size={12} color="#D4AF37" />
            <Typography sx={{ fontSize: 10, letterSpacing: "0.4em", color: "#0B4F2C", textTransform: "uppercase", fontWeight: 700 }}>
              Communiqué No. {String(index + 1).padStart(3, "0")}
            </Typography>
            <Box sx={{ flex: 1, height: "1px", background: "rgba(11,79,44,0.32)" }} />
          </Stack>

          {/* Cover image as engraved plate */}
          {p.coverImageUrl && (
            <Box sx={{ mb: 2.5, height: 150, overflow: "hidden", boxShadow: "inset 0 0 0 1px rgba(11,79,44,0.18)" }}>
              <OptimizedImage
  src={p.coverImageUrl}
  alt={resolveLocalized(p.title)}
  sx={{ width: "100%", height: "100%" }}
  imgSx={{ filter: "sepia(15%)" }}
/>
            </Box>
          )}

          {/* Date plate */}
          <Stack direction="row" alignItems="baseline" spacing={1.5} sx={{ mb: 1.5 }}>
            <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: 40, lineHeight: 0.85, color: "#0B4F2C" }}>
              {day}
            </Typography>
            <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontSize: 12, letterSpacing: "0.32em", color: "#8E1B25" }}>
              {mon} {yr}
            </Typography>
          </Stack>

          {/* Title */}
          <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: { xs: 22, md: 26 }, lineHeight: 1.18, color: "#0B4F2C", mb: 1.5, pr: 6 }}>
            {resolveLocalized(p.title)}
          </Typography>

          {/* Tagline rule */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Box sx={{ width: 26, height: 2, background: "#D4AF37" }} />
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 14, color: "#8E1B25", textTransform: "uppercase", letterSpacing: "0.18em" }}>
              From the Office
            </Typography>
          </Stack>

          {/* Excerpt */}
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 17, lineHeight: 1.6, color: "rgba(15,26,20,0.82)", mb: 3 }}>
            {resolveLocalized(p.excerpt)}
          </Typography>

          {/* Read CTA */}
          <Stack direction="row" alignItems="center" sx={{ pt: 2, borderTop: "1px solid rgba(11,79,44,0.18)" }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ flex: 1 }}>
              {p.tags.slice(0, 2).map((t) => (
                <Typography key={t} sx={{ fontSize: 9, letterSpacing: "0.32em", color: "#0B4F2C", textTransform: "uppercase", fontWeight: 700 }}>
                  · {t}
                </Typography>
              ))}
            </Stack>
            <Box className="read" sx={{ color: "#0B4F2C", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 700, borderBottom: "1px solid #D4AF37", pb: 0.5, transition: "color 0.2s, transform 0.2s" }}>
              Read communiqué
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* Notary seal — round disc affixed to bottom-right, sits in the snipped corner */}
      <Box sx={{
        position: "absolute",
        bottom: -6,
        right: -6,
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: "#0B4F2C",
        color: "#D4AF37",
        display: "grid",
        placeItems: "center",
        boxShadow: "0 4px 12px rgba(11,79,44,0.32)",
        fontFamily: '"DM Serif Display", serif',
        fontStyle: "italic",
        fontSize: 22,
        zIndex: 2,
        pointerEvents: "none",
      }}>
        <Box sx={{ position: "absolute", inset: 4, borderRadius: "50%", border: "1px solid rgba(212,175,55,0.5)" }} />
        {String(index + 1).padStart(2, "0")}
      </Box>
    </Box>
  );
}

export function JohnNews() {
  const { i18n } = useTranslation();
    const news = useQuery({ queryKey: ["news", i18n.language], queryFn: () => api.listNews({ pageSize: 24, lang: normalizeLang(i18n.language) }) });

  return (
    <Box sx={{ background: "#FBF8F1", color: "#0F1A14" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Communiqué Archive" path="/news"  />
      <KenteStripe height={6} />

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 4 }}>
            <Box sx={{ flex: 1, maxWidth: 140, height: "1px", background: "#0B4F2C" }} />
            <BlackStar size={20} color="#0B4F2C" />
            <Box sx={{ flex: 1, maxWidth: 140, height: "1px", background: "#0B4F2C" }} />
          </Stack>
          <Typography sx={{ fontSize: 11, letterSpacing: "0.5em", color: "#8E1B25", textTransform: "uppercase", fontWeight: 700, mb: 2 }}>
            Office of the President · Communiqué Archive
          </Typography>
          <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 48, md: 80 }, lineHeight: 0.95, color: "#0B4F2C", mb: 2 }}>
            From the<br />Office.
          </Typography>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 18, md: 22 }, color: "rgba(15,26,20,0.72)", maxWidth: 720, mx: "auto" }}>
            Communiqués, statements, and addresses from the Office of the President — archived for the public record.
          </Typography>
        </Box>

        {news.isLoading ? (
          <CardGridSkeleton count={6} />
        ) : !news.data?.items.length ? (
          <EmptyState subject={SUBJECT}
            variant="illustrated"
            title="No communiqués at this time."
            body="Statements from the Office of the President will be archived here as they are issued."
            ctaLabel="Return home"
            ctaTo="/"
           />
        ) : (
          <Grid container spacing={4} >
            {news.data.items.map((p, i) => (
              <Grid item xs={12} sm={6} key={p.id} >
                <CommuniqueFolio p={p} index={i} />
              </Grid>
            ))}
          </Grid>
        )}

        {(news.data?.items.length ?? 0) > 0 && (
          <Box sx={{ mt: 12, textAlign: "center" }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} >
              <Box sx={{ flex: 1, maxWidth: 160, height: "1px", background: "#0B4F2C" }} />
              <GyeNyame size={28} color="#0B4F2C" />
              <Box sx={{ flex: 1, maxWidth: 160, height: "1px", background: "#0B4F2C" }} />
            </Stack>
            <Typography sx={{ mt: 2, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 18, color: "rgba(15,26,20,0.6)" }}>
              The Republic, in its own words.
            </Typography>
          </Box>
        )}
      </Container>
      <KenteStripe height={4} />
    </Box>
  );
}
