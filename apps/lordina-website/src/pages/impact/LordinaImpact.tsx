import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Container, Typography, Stack, Grid, Button } from "@mui/material";
import type { PhilanthropyDTO } from "@mahama/shared-types";
import { CardGridSkeleton, EmptyState, QueryError, Seo, StaggerGroup, StaggerItem , BreadcrumbSchema} from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;
import { LORDINA, HANDKERCHIEF_CLIP } from "../lordina/theme.js";
import { Hibiscus, Ribbon, Garland, PaperTexture, Mmusuyidee } from "../lordina/motifs.js";

const CATEGORIES = [
  { key: "all", label: "All Work" },
  { key: "health", label: "Maternal & Child Health" },
  { key: "youth", label: "Children & Youth" },
  { key: "education", label: "Education" },
  { key: "disaster-relief", label: "Relief" },
  { key: "religion", label: "Faith" },
  { key: "other", label: "Other" },
];

function FoundationEntry({ p, index }: { p: PhilanthropyDTO; index: number }) {
  const featured = p.featured;
  return (
    <Box sx={{
      position: "relative",
      background: "#fff",
      clipPath: HANDKERCHIEF_CLIP,
      py: 5,
      px: { xs: 3, md: 4 },
      height: "100%",
      minHeight: 360,
      transition: "transform 0.25s, filter 0.25s",
      "&:hover": { transform: "translateY(-3px)", filter: "brightness(1.02)" },
    }}>
      {/* Top hibiscus crest */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
        <Hibiscus size={18} color={LORDINA.rose} />
        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 12, letterSpacing: "0.32em", color: LORDINA.sage, textTransform: "uppercase", fontWeight: 600 }}>
          Entry No. {String(index + 1).padStart(2, "0")} · {p.year}
        </Typography>
        <Box sx={{ flex: 1, height: "1px", background: LORDINA.gold }} />
      </Stack>

      {/* Title */}
      <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: { xs: 22, md: 28 }, lineHeight: 1.18, color: LORDINA.roseDeep, mb: 1 }}>
        {p.title}
      </Typography>

      {/* Ribbon */}
      <Ribbon width={70} color={LORDINA.gold} style={{ marginBottom: 12 }} />

      {/* Beneficiary */}
      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 2 }}>
        <Box sx={{ width: 18, height: 1, background: LORDINA.gold }} />
        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 14, color: LORDINA.rose, letterSpacing: "0.06em" }}>
          For {p.beneficiary}
        </Typography>
      </Stack>

      {/* Body */}
      <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 17, lineHeight: 1.65, color: LORDINA.inkSoft, mb: 3 }}>
        {p.summary}
      </Typography>

      {/* Footer */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ pt: 2, borderTop: `1px solid ${LORDINA.rule}` }}>
        <Box sx={{ background: LORDINA.sage, color: LORDINA.paper, px: 1.25, py: 0.4, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 600 }}>
          {p.category.replace("-", " ")}
        </Box>
        {p.amount && (
          <Box sx={{ background: LORDINA.gold, color: LORDINA.ink, px: 1.25, py: 0.4, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 11, letterSpacing: "0.18em", fontWeight: 600 }}>
            {p.amount}
          </Box>
        )}
        {featured && (
          <Typography sx={{ color: LORDINA.rose, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 11, letterSpacing: "0.32em", fontWeight: 700, ml: "auto", textTransform: "uppercase" }}>
            ❦ Flagship
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

export function LordinaImpact() {
  const phil = useQuery({ queryKey: ["philanthropy"], queryFn: () => api.listPhilanthropy() });
  const [filter, setFilter] = useState("all");
  const all = phil.data ?? [];
  const items = useMemo(() => all.filter((p) => filter === "all" || p.category === filter), [all, filter]);

  return (
    <Box sx={{ background: LORDINA.paper, color: LORDINA.ink, position: "relative", minHeight: "100vh" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="The Foundation Register" path="/impact"  />
      <BreadcrumbSchema
        baseUrl={window.location.origin}
        items={[{ name: "Home", path: "/" }, { name: "Impact", path: "/impact" }]}
      />
      <PaperTexture />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: { xs: 8, md: 12 } }}>
        {/* Frontispiece */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 3 }}>
            <Garland width={120} color={LORDINA.sage} />
            <Hibiscus size={28} color={LORDINA.rose} />
            <Garland width={120} color={LORDINA.sage} />
          </Stack>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 14, letterSpacing: "0.4em", color: LORDINA.sage, textTransform: "uppercase", mb: 2 }}>
            By Hand &amp; By Heart
          </Typography>
          <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 48, md: 84 }, lineHeight: 0.95, color: LORDINA.roseDeep, mb: 2 }}>
            The Foundation<br />Register.
          </Typography>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 18, md: 22 }, color: LORDINA.inkSoft, maxWidth: 720, mx: "auto" }}>
            Maternity wards built. PMTCT integrated. Children's homes adopted. The Lordina Foundation's
            working register — by community, by year.
          </Typography>
        </Box>

        {/* Doctrine plate */}
        <Box sx={{ mb: 8, background: LORDINA.roseDeep, color: LORDINA.paper, py: 4, px: { xs: 3, md: 5 }, position: "relative", overflow: "hidden" }}>
          <Box sx={{ position: "absolute", top: -30, right: -30, opacity: 0.1 }}>
            <Hibiscus size={220} color={LORDINA.gold} />
          </Box>
          <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }} spacing={3} sx={{ position: "relative" }}>
            <Mmusuyidee size={48} color={LORDINA.gold} />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 12, letterSpacing: "0.4em", color: LORDINA.gold, textTransform: "uppercase", fontWeight: 600, mb: 1 }}>
                The Foundation's Promise
              </Typography>
              <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 22, md: 28 }, lineHeight: 1.4, color: LORDINA.paper, maxWidth: 720 }}>
                "Every mother deserves a safe space to give birth, and every child deserves a strong and healthy start to life."
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Filter pills */}
        {all.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 5 }}>
            {CATEGORIES.map((c) => (
              <Button
                key={c.key}
                onClick={() => setFilter(c.key)}
                disableRipple
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontStyle: "italic",
                  fontSize: 14,
                  textTransform: "none",
                  color: filter === c.key ? LORDINA.paper : LORDINA.roseDeep,
                  background: filter === c.key ? LORDINA.roseDeep : "transparent",
                  border: `1px solid ${LORDINA.roseDeep}`,
                  borderRadius: 0,
                  px: 2.25,
                  py: 0.6,
                  letterSpacing: "0.18em",
                  "&:hover": { background: filter === c.key ? LORDINA.rose : `${LORDINA.roseDeep}11` },
                }}
              >
                {c.label}
              </Button>
            ))}
          </Stack>
        )}

        {phil.isError ? (<QueryError message="Unable to load philanthropy." onRetry={() => phil.refetch()} />) : phil.isLoading ? (
          <CardGridSkeleton count={6} />
        ) : !all.length ? (
          <EmptyState subject={SUBJECT}
            variant="illustrated"
            title="The register is being prepared."
            body="Foundation programmes will be filed here as they are completed."
           />
        ) : items.length === 0 ? (
          <EmptyState subject={SUBJECT} eyebrow="Filter" title="Nothing under this category." body="Try another filter, or view the full register."  />
        ) : (
          <StaggerGroup>
          <Grid container spacing={4} >
            {items.map((p, i) => (
              <Grid item xs={12} md={6} key={p.id} >
                <StaggerItem>
                  <FoundationEntry p={p} index={i} />
                </StaggerItem>
              </Grid>
            ))}
          </Grid>
          </StaggerGroup>
        )}

        {all.length > 0 && (
          <Box sx={{ mt: 12, textAlign: "center" }}>
            <Garland width={300} color={LORDINA.sage} />
            <Typography sx={{ mt: 1.5, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 18, color: LORDINA.inkMuted }}>
              By patronage, by hand, by heart.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
