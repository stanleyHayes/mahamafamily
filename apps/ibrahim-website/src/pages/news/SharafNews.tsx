import { useQuery } from "@tanstack/react-query";
import { Box, Container, Typography, Stack, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { FlattenLocalized, NewsPostDTO } from "@mahama/shared-types";
import { useTranslation } from "@mahama/i18n";
import { CardGridSkeleton, EmptyState, HalftoneDots, OptimizedImage, QueryError, Seo, BreadcrumbSchema} from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;
import { normalizeLang } from "@mahama/shared-types";
import { resolveLocalized } from "@mahama/shared-types";

interface ToneCfg { bg: string; fg: string; accent: string; num: string }
const TONES: ToneCfg[] = [
  { bg: "#0B0B0B", fg: "#F4F1ED", accent: "#E0B73A", num: "#D62828" },
  { bg: "#E0B73A", fg: "#0B0B0B", accent: "#D62828", num: "#0B0B0B" },
  { bg: "#D62828", fg: "#F4F1ED", accent: "#E0B73A", num: "#0B0B0B" },
];

// Boxing-ticket silhouette: snipped top-right corner + zig-zag perforation down the right edge
// (the stub side, where the gate keeper would tear).
const TICKET_CLIP = [
  "polygon(",
  "  0 0, calc(100% - 26px) 0, 100% 26px,",
  "  calc(100% - 14px) 6%, calc(100% - 6px) 14%, calc(100% - 14px) 22%,",
  "  calc(100% - 6px) 30%, calc(100% - 14px) 38%, calc(100% - 6px) 46%,",
  "  calc(100% - 14px) 54%, calc(100% - 6px) 62%, calc(100% - 14px) 70%,",
  "  calc(100% - 6px) 78%, calc(100% - 14px) 86%, calc(100% - 6px) 94%,",
  "  calc(100% - 14px) 100%, 0 100%",
  ")",
].join("");

function FightTicket({ p, index }: { p: NewsPostDTO; index: number }) {
  const tone = TONES[index % TONES.length]!;
  const isBlack = index % TONES.length === 0;
  const d = p.publishedAt ? new Date(p.publishedAt) : null;
  const day = d ? String(d.getUTCDate()).padStart(2, "0") : "—";
  const mon = d ? d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase() : "—";
  const yr = d ? String(d.getUTCFullYear()).slice(2) : "";

  return (
    <Box
      component={RouterLink}
      to={`/news/${p.slug}`}
      sx={{
        position: "relative",
        display: "block",
        textDecoration: "none",
        background: tone.bg,
        color: tone.fg,
        height: "100%",
        clipPath: TICKET_CLIP,
        pr: { xs: 3, md: 3.5 },
        transition: "transform 0.22s, filter 0.22s",
        boxShadow: isBlack ? "inset 0 0 0 2px rgba(224,183,58,0.32)" : "none",
        "&:hover": {
          transform: "translateY(-6px)",
          filter: isBlack ? "brightness(1.18)" : "brightness(0.96)",
          "& .arrow": { transform: "translateX(6px)" },
        },
      }}
    >
      <HalftoneDots color={isBlack ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"} />

      <Box sx={{ p: { xs: 3, md: 3.5 }, pr: 0, position: "relative", zIndex: 1 }}>
        {/* Top strap: bout no. + date */}
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Box sx={{ background: tone.accent, color: tone.num, px: 1.25, py: 0.4, fontFamily: '"Bebas Neue", sans-serif', fontSize: 12, letterSpacing: "0.32em", fontWeight: 700 }}>
            ★ BOUT {String(index + 1).padStart(2, "0")}
          </Box>
          <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 12, letterSpacing: "0.32em", color: tone.num, fontWeight: 700 }}>
            {day} · {mon} · '{yr}
          </Typography>
        </Stack>

        {/* Cover image as fight poster crop */}
        {p.coverImageUrl && (
          <Box sx={{ mb: 2.5, height: 160, overflow: "hidden", border: `2px solid ${tone.num}`, position: "relative" }}>
            <OptimizedImage
  src={p.coverImageUrl}
  alt={resolveLocalized(p.title)}
  sx={{ width: "100%", height: "100%" }}
  imgSx={{ filter: "contrast(1.1) saturate(0.92)" }}
/>
            <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, background: `linear-gradient(transparent, ${tone.bg}cc)`, height: "40%" }} />
          </Box>
        )}

        {/* Title — Bebas, cinematic */}
        <Typography sx={{
          fontFamily: '"Bebas Neue", "Anton", sans-serif',
          fontSize: { xs: 28, md: 36 },
          lineHeight: 0.95,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
          mb: 1.5,
        }}>
          {resolveLocalized(p.title)}
        </Typography>

        {/* VS divider */}
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Box sx={{ flex: 1, maxWidth: 36, height: 2, background: tone.accent, opacity: 0.7 }} />
          <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 11, letterSpacing: "0.4em", color: tone.num, fontWeight: 700 }}>
            ROUND
          </Typography>
          <Box sx={{ flex: 1, height: 2, background: tone.accent, opacity: 0.7 }} />
        </Stack>

        {/* Excerpt */}
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 14, lineHeight: 1.55, opacity: 0.92, mb: 3 }}>
          {resolveLocalized(p.excerpt)}
        </Typography>

        {/* Tag chips + CTA */}
        <Stack direction="row" alignItems="center" sx={{ pt: 2, borderTop: `2px solid ${tone.accent}` }}>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ flex: 1 }}>
            {p.tags.slice(0, 2).map((t) => (
              <Typography key={t} sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 12, letterSpacing: "0.28em", color: tone.accent, fontWeight: 700, textTransform: "uppercase" }}>
                · {t}
              </Typography>
            ))}
          </Stack>
          <Box className="arrow" sx={{
            background: tone.accent,
            color: tone.num,
            px: 1.5,
            py: 0.6,
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: 13,
            letterSpacing: "0.28em",
            fontWeight: 700,
            transition: "transform 0.2s",
          }}>
            READ ↗
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export function SharafNews() {
  const { i18n } = useTranslation();
    const news = useQuery({ queryKey: ["news", i18n.language], queryFn: () => api.listNews({ pageSize: 24, lang: normalizeLang(i18n.language) }) });

  return (
    <Box sx={{ background: "#0B0B0B", color: "#F4F1ED", position: "relative", overflow: "hidden" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Ringside Press" path="/news"  />
      <BreadcrumbSchema
        baseUrl={window.location.origin}
        items={[{ name: "Home", path: "/" }, { name: "News", path: "/news" }]}
      />
      <HalftoneDots color="rgba(255,255,255,0.025)" />

      <Box sx={{ display: "flex", height: 5 }}>
        <Box sx={{ flex: 1, background: "#D62828" }} />
        <Box sx={{ flex: 1, background: "#E0B73A" }} />
        <Box sx={{ flex: 1, background: "#0B4F2C" }} />
      </Box>

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, py: { xs: 6, md: 10 } }}>
        <Box sx={{ mb: 6 }}>
          <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: 18, md: 24 }, letterSpacing: "0.5em", color: "#D62828", mb: 2 }}>
            ★ RINGSIDE PRESS ★ TEAR HERE ★
          </Typography>
          <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 80, md: 200 }, lineHeight: 0.85, color: "#F4F1ED", letterSpacing: "0.02em" }}>
            PRESS
          </Typography>
          <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: { xs: 60, md: 140 }, lineHeight: 0.85, color: "#E0B73A", letterSpacing: "0.02em" }}>
            ROW.
          </Typography>
          <Typography sx={{ mt: 3, fontFamily: '"Inter", sans-serif', fontSize: 14, letterSpacing: "0.32em", color: "rgba(244,241,237,0.55)", textTransform: "uppercase" }}>
            Fight-night recaps · Fighter signings · Broadcast announcements
          </Typography>
        </Box>

        {news.isError ? (<QueryError message="Unable to load news posts." onRetry={() => news.refetch()} />) : news.isLoading ? (
          <CardGridSkeleton count={6} />
        ) : !news.data?.items.length ? (
          <EmptyState subject={SUBJECT}
            variant="illustrated"
            title="Stories drop here when the bell rings."
            body="Fight-night recaps, behind-the-scenes coverage, fighter signings, and broadcast announcements live on this page."
            ctaLabel="Return home"
            ctaTo="/"
           />
        ) : (
          <Grid container spacing={3} >
            {news.data.items.map((p, i) => (
              <Grid item xs={12} sm={6} lg={4} key={p.id} >
                <FightTicket p={p} index={i} />
              </Grid>
            ))}
          </Grid>
        )}

        {(news.data?.items.length ?? 0) > 0 && (
          <Box sx={{ background: "#E0B73A", color: "#0B0B0B", py: 1, overflow: "hidden", borderTop: "2px solid #D62828", mt: 8, mx: -3 }}>
            <Box sx={{
              display: "flex", whiteSpace: "nowrap", animation: "marquee 30s linear infinite",
              fontFamily: '"Bebas Neue", sans-serif', fontSize: 14, letterSpacing: "0.32em",
              "& span": { px: 4 },
              "@keyframes marquee": { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
            
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },}}>
              {Array(2).fill(0).map((_, j) => (
                <Box key={j} sx={{ display: "flex" }}>
                  <span>★ TEAR HERE</span>
                  <span>★ ADMIT ONE</span>
                  <span>★ RINGSIDE</span>
                  <span>★ BUKOM CALLING</span>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
