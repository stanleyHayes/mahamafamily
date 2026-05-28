import { useQuery } from "@tanstack/react-query";
import { Box, Container, Typography, Stack, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { FlattenLocalized, NewsPostDTO } from "@mahama/shared-types";
import { useTranslation } from "@mahama/i18n";
import { BlueprintGrid, CardGridSkeleton, EmptyState, OptimizedImage, QueryError, Seo, BreadcrumbSchema} from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;
import { normalizeLang } from "@mahama/shared-types";
import { resolveLocalized } from "@mahama/shared-types";

// Dossier silhouette: side filing-tab on the left, top-right corner snipped.
// The shape is built from one polygon clip-path so the gold tab is part of the card itself.
const DOSSIER_CLIP =
  "polygon(0 22px, 86px 22px, 96px 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%)";

function DossierEntry({ p, index }: { p: NewsPostDTO; index: number }) {
  const d = p.publishedAt ? new Date(p.publishedAt) : null;
  const day = d ? String(d.getUTCDate()).padStart(2, "0") : "—";
  const mon = d ? d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase() : "—";
  const yr = d ? String(d.getUTCFullYear()) : "";

  return (
    <Box
      component={RouterLink}
      to={`/news/${p.slug}`}
      sx={{
        position: "relative",
        display: "block",
        textDecoration: "none",
        color: "inherit",
        background: "rgba(8,9,14,0.65)",
        backdropFilter: "blur(2px)",
        clipPath: DOSSIER_CLIP,
        pt: "46px",
        pb: 4,
        px: { xs: 3, md: 4 },
        height: "100%",
        boxShadow: "inset 0 0 0 1px rgba(201,162,39,0.32)",
        transition: "filter 0.2s, transform 0.2s",
        "&:hover": {
          filter: "brightness(1.08)",
          transform: "translateY(-3px)",
          boxShadow: "inset 0 0 0 1px #C9A227",
          "& .openfile": { transform: "translateX(6px)" },
        },
      }}
    >
      {/* Filing tab integrated into the silhouette — gold strip in the trapezoidal protrusion */}
      <Box sx={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "22px",
        width: "96px",
        background: "#C9A227",
        clipPath: "polygon(0 0, 86px 0, 96px 100%, 0 100%)",
        display: "grid",
        placeItems: "center",
      }}>
        <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, letterSpacing: "0.36em", fontWeight: 700, color: "#08090C" }}>
          PRESS-{String(index + 1).padStart(3, "0")}
        </Typography>
      </Box>

      {/* Cover image as classified plate */}
      {p.coverImageUrl && (
        <Box sx={{ mb: 2, height: 140, overflow: "hidden", position: "relative", boxShadow: "inset 0 0 0 1px rgba(201,162,39,0.18)" }}>
          <OptimizedImage
  src={p.coverImageUrl}
  alt={resolveLocalized(p.title)}
  sx={{ width: "100%", height: "100%" }}
  imgSx={{ filter: "grayscale(40%) contrast(1.05)" }}
/>
          <Box sx={{ position: "absolute", bottom: 6, left: 6, background: "rgba(8,9,14,0.85)", color: "#C9A227", px: 1, py: 0.25, fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, letterSpacing: "0.32em", fontWeight: 600 }}>
            ★ PLATE
          </Box>
        </Box>
      )}

      {/* Date plate */}
      <Stack direction="row" alignItems="baseline" spacing={1.5} sx={{ mb: 1.5 }}>
        <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: 32, lineHeight: 0.85, color: "#C9A227", fontWeight: 600 }}>
          {day}
        </Typography>
        <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "rgba(242,237,226,0.55)" }}>
          {mon} · {yr}
        </Typography>
      </Stack>

      {/* Title */}
      <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 20, md: 24 }, lineHeight: 1.2, color: "#F2EDE2", mb: 1.5 }}>
        {resolveLocalized(p.title)}
      </Typography>

      {/* Excerpt */}
      <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 16, lineHeight: 1.6, color: "rgba(242,237,226,0.78)", mb: 3 }}>
        {resolveLocalized(p.excerpt)}
      </Typography>

      {/* Tags + open-file marker */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ pt: 2, borderTop: "1px solid rgba(201,162,39,0.18)" }}>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ flex: 1 }}>
          {p.tags.slice(0, 3).map((t) => (
            <Typography key={t} sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, letterSpacing: "0.28em", color: "rgba(242,237,226,0.5)", textTransform: "uppercase" }}>
              · {t}
            </Typography>
          ))}
        </Stack>
        <Box className="openfile" sx={{ color: "#C9A227", fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", fontWeight: 600, transition: "transform 0.2s" }}>
          OPEN ↗
        </Box>
      </Stack>
    </Box>
  );
}

export function IbrahimNews() {
  const { i18n } = useTranslation();
    const news = useQuery({ queryKey: ["news", i18n.language], queryFn: () => api.listNews({ pageSize: 24, lang: normalizeLang(i18n.language) }) });

  return (
    <Box sx={{ background: "#08090C", color: "#F2EDE2", position: "relative", minHeight: "100vh" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Press Dossier" path="/news"  />
      <BreadcrumbSchema
        baseUrl={window.location.origin}
        items={[{ name: "Home", path: "/" }, { name: "News", path: "/news" }]}
      />
      <BlueprintGrid />
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, py: { xs: 8, md: 12 } }}>
        <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "baseline" }} spacing={3} sx={{ mb: 6 }}>
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.4em", color: "#C9A227", textTransform: "uppercase" }}>
            Document · Press Dossier
          </Typography>
          <Box sx={{ flex: 1, height: "1px", background: "rgba(201,162,39,0.32)", display: { xs: "none", md: "block" } }} />
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "rgba(242,237,226,0.55)", textTransform: "uppercase" }}>
            Filed · {news.data?.items.length ?? 0}
          </Typography>
        </Stack>

        <Box sx={{ mb: 8 }}>
          <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 56, md: 96 }, lineHeight: 0.95, fontWeight: 600 }}>
            Press<br /><Box component="span" sx={{ color: "#C9A227", fontStyle: "italic", fontWeight: 500 }}>Dossier.</Box>
          </Typography>
          <Typography sx={{ mt: 3, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 22, color: "rgba(242,237,226,0.78)", maxWidth: 640 }}>
            Statements, partnership news, and major announcements from Engineers & Planners and Dzata Cement — filed by date.
          </Typography>
        </Box>

        {news.isError ? (<QueryError message="Unable to load news posts." onRetry={() => news.refetch()} />) : news.isLoading ? (
          <CardGridSkeleton count={6} />
        ) : !news.data?.items.length ? (
          <EmptyState subject={SUBJECT}
            variant="illustrated"
            title="The press file is open — and currently empty."
            body="When the office releases statements, partnership news, or major announcements, they'll appear here first."
            ctaLabel="Return home"
            ctaTo="/"
           />
        ) : (
          <Grid container spacing={3} >
            {news.data.items.map((p, i) => (
              <Grid item xs={12} sm={6} lg={4} key={p.id} >
                <DossierEntry p={p} index={i} />
              </Grid>
            ))}
          </Grid>
        )}

        {(news.data?.items.length ?? 0) > 0 && (
          <Box sx={{ mt: 12, pt: 4, borderTop: "1px solid rgba(201,162,39,0.32)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
            <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "rgba(242,237,226,0.45)", textTransform: "uppercase" }}>
              End of Dossier · {news.data?.items.length} entries
            </Typography>
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 18, color: "#C9A227" }}>
              Filed for the record.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
