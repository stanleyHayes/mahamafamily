import { useQuery } from "@tanstack/react-query";
import { Box, Container, Typography, Stack, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { FlattenLocalized, NewsPostDTO } from "@mahama/shared-types";
import { useTranslation } from "@mahama/i18n";
import { Seo } from "@mahama/website-core";
import { CardGridSkeleton } from "@mahama/website-core";
import { EmptyState } from "@mahama/website-core";
import { OptimizedImage } from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;
import { LORDINA, HANDKERCHIEF_CLIP } from "../lordina/theme.js";
import { Hibiscus, Ribbon, PaperTexture, Garland } from "../lordina/motifs.js";
import { normalizeLang } from "@mahama/shared-types";
import { resolveLocalized } from "@mahama/shared-types";

function HandkerchiefCard({ p, index }: { p: NewsPostDTO; index: number }) {
  const d = p.publishedAt ? new Date(p.publishedAt) : null;
  const day = d ? String(d.getUTCDate()).padStart(2, "0") : "—";
  const mon = d ? d.toLocaleDateString("en-GB", { month: "long" }) : "";
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
          color: LORDINA.ink,
          background: "#fff",
          clipPath: HANDKERCHIEF_CLIP,
          py: 5,
          px: { xs: 3, md: 4 },
          height: "100%",
          minHeight: 480,
          transition: "transform 0.25s, filter 0.25s",
          "&:hover": {
            transform: "translateY(-4px)",
            filter: "brightness(1.02)",
            "& .read": { color: LORDINA.rose, transform: "translateX(4px)" },
          },
        }}
      >
        {/* Letterhead row */}
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Hibiscus size={20} color={LORDINA.rose} />
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 13, letterSpacing: "0.18em", color: LORDINA.sage, textTransform: "uppercase", fontWeight: 600 }}>
            Address No. {String(index + 1).padStart(3, "0")}
          </Typography>
          <Box sx={{ flex: 1, height: "1px", background: LORDINA.gold }} />
        </Stack>

        {/* Cover image */}
        {p.coverImageUrl && (
          <Box sx={{ mb: 2.5, height: 160, overflow: "hidden", boxShadow: `inset 0 0 0 1px ${LORDINA.rule}` }}>
            <OptimizedImage
  src={p.coverImageUrl}
  alt={resolveLocalized(p.title)}
  sx={{ width: "100%", height: "100%" }}
  imgSx={{ filter: "sepia(8%) saturate(0.95)" }}
/>
          </Box>
        )}

        {/* Date plate */}
        <Stack direction="row" alignItems="baseline" spacing={1.5} sx={{ mb: 1.5 }}>
          <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: 36, lineHeight: 0.85, color: LORDINA.roseDeep }}>
            {day}
          </Typography>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 14, color: LORDINA.inkMuted, letterSpacing: "0.06em" }}>
            {mon} {yr}
          </Typography>
        </Stack>

        {/* Title */}
        <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: { xs: 22, md: 26 }, lineHeight: 1.18, color: LORDINA.roseDeep, mb: 1.25 }}>
          {resolveLocalized(p.title)}
        </Typography>

        {/* Ribbon flourish */}
        <Ribbon width={80} color={LORDINA.gold} style={{ marginBottom: 14 }} />

        {/* Excerpt */}
        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 17, lineHeight: 1.6, color: LORDINA.inkSoft, mb: 3 }}>
          {resolveLocalized(p.excerpt)}
        </Typography>

        {/* Footer */}
        <Stack direction="row" alignItems="center" sx={{ pt: 2, borderTop: `1px solid ${LORDINA.rule}` }}>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ flex: 1 }}>
            {p.tags.slice(0, 2).map((t) => (
              <Typography key={t} sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 13, color: LORDINA.sage, textTransform: "lowercase" }}>
                ❦ {t}
              </Typography>
            ))}
          </Stack>
          <Box className="read" sx={{ color: LORDINA.roseDeep, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 14, letterSpacing: "0.18em", textTransform: "uppercase", borderBottom: `1px solid ${LORDINA.gold}`, pb: 0.4, transition: "color 0.2s, transform 0.2s" }}>
            Read the address
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export function LordinaNews() {
  const { i18n } = useTranslation();
    const news = useQuery({ queryKey: ["news", i18n.language], queryFn: () => api.listNews({ pageSize: 24, lang: normalizeLang(i18n.language) }) });

  return (
    <Box sx={{ background: LORDINA.paper, color: LORDINA.ink, position: "relative", minHeight: "100vh" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Addresses & Communications" path="/news"  />
      <PaperTexture />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: { xs: 8, md: 12 } }}>
        {/* Frontispiece */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 3 }}>
            <Garland width={120} color={LORDINA.sage} />
            <Hibiscus size={32} color={LORDINA.rose} />
            <Garland width={120} color={LORDINA.sage} />
          </Stack>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 14, letterSpacing: "0.4em", color: LORDINA.sage, textTransform: "uppercase", mb: 2 }}>
            Office of the First Lady
          </Typography>
          <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 56, md: 96 }, lineHeight: 0.95, color: LORDINA.roseDeep, mb: 2 }}>
            Addresses<br />&amp; Letters.
          </Typography>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 18, md: 22 }, color: LORDINA.inkSoft, maxWidth: 720, mx: "auto" }}>
            Speeches, communiqués, and open letters from Her Excellency Lordina Mahama —
            on maternal health, the welfare of women and children, and the work of the Foundation.
          </Typography>
        </Box>

        {news.isLoading ? (
          <CardGridSkeleton count={6} />
        ) : !news.data?.items.length ? (
          <EmptyState subject={SUBJECT}
            variant="illustrated"
            title="The desk is clear today."
            body="Addresses, communiqués, and Foundation announcements will be archived here as they are issued."
            ctaLabel="Return home"
            ctaTo="/"
           />
        ) : (
          <Grid container spacing={4} >
            {news.data.items.map((p, i) => (
              <Grid item xs={12} sm={6} lg={4} key={p.id} >
                <HandkerchiefCard p={p} index={i} />
              </Grid>
            ))}
          </Grid>
        )}

        {(news.data?.items.length ?? 0) > 0 && (
          <Box sx={{ mt: 12, textAlign: "center" }}>
            <Garland width={240} color={LORDINA.sage} />
            <Typography sx={{ mt: 1.5, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 18, color: LORDINA.inkMuted }}>
              The more we share, the more we have.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
