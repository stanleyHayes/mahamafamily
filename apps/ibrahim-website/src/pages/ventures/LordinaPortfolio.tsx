import { useQuery } from "@tanstack/react-query";
import { Box, Container, Typography, Stack, Grid } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import type { VentureDTO } from "@mahama/shared-types";
import { EmptyState, QueryError, Seo, VentureGridSkeleton , BreadcrumbSchema} from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;
import { LORDINA } from "../lordina/theme.js";
import { Hibiscus, Ribbon, Garland, PaperTexture, Mmusuyidee } from "../lordina/motifs.js";

function pillarFor(v: VentureDTO): string {
  const n = v.name.toLowerCase();
  if (n.includes("foundation")) return "The Foundation";
  if (n.includes("oafla")) return "Pan-African Sisterhood";
  if (n.includes("unaids") || n.includes("pmtct")) return "Global Advocacy";
  return v.featured ? "Foundation Pillar" : "Programme";
}

export function LordinaPortfolio() {
  const ventures = useQuery({ queryKey: ["ventures"], queryFn: () => api.listVentures() });
  const list = ventures.data ?? [];

  return (
    <Box sx={{ background: LORDINA.paper, color: LORDINA.ink, position: "relative", minHeight: "100vh" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="The Foundation & Advocacy" path="/ventures"  />
      <BreadcrumbSchema
        baseUrl={window.location.origin}
        items={[{ name: "Home", path: "/" }, { name: "Ventures", path: "/ventures" }]}
      />
      <PaperTexture />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: { xs: 8, md: 14 } }}>
        {/* Frontispiece */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 3 }}>
            <Garland width={120} color={LORDINA.sage} />
            <Hibiscus size={28} color={LORDINA.rose} />
            <Garland width={120} color={LORDINA.sage} />
          </Stack>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 14, letterSpacing: "0.4em", color: LORDINA.sage, textTransform: "uppercase", mb: 2 }}>
            The Work of the Foundation
          </Typography>
          <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 48, md: 80 }, lineHeight: 0.95, color: LORDINA.roseDeep, mb: 2 }}>
            The Pillars.
          </Typography>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 18, md: 22 }, color: LORDINA.inkSoft, maxWidth: 720, mx: "auto" }}>
            The Foundation, OAFLAD, and the global fight for an AIDS-free generation — set out in full.
          </Typography>
        </Box>

        {/* Doctrine plate */}
        <Box sx={{ mb: 10, background: LORDINA.roseDeep, color: LORDINA.paper, py: 4, px: { xs: 3, md: 5 }, position: "relative", overflow: "hidden" }}>
          <Box sx={{ position: "absolute", top: -40, right: -40, opacity: 0.1 }}>
            <Hibiscus size={240} color={LORDINA.gold} />
          </Box>
          <Grid container spacing={3} sx={{ position: "relative" }}>
            {[
              { name: "Maternal & Child Health", icon: <Hibiscus size={28} color={LORDINA.gold} /> },
              { name: "PMTCT & SRH Integration", icon: <Mmusuyidee size={28} color={LORDINA.gold} /> },
              { name: "Welfare of the Vulnerable", icon: <Hibiscus size={28} color={LORDINA.gold} /> },
            ].map((d) => (
              <Grid item xs={12} md={4} key={d.name} >
                <Stack direction="row" alignItems="center" spacing={2} >
                  {d.icon}
                  <Box>
                    <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 11, letterSpacing: "0.4em", color: LORDINA.gold, textTransform: "uppercase", fontWeight: 600 }}>
                      Pillar
                    </Typography>
                    <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: 22, color: LORDINA.paper, lineHeight: 1.15 }}>
                      {d.name}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Box>

        {ventures.isError ? (<QueryError message="Unable to load ventures." onRetry={() => ventures.refetch()} />) : ventures.isLoading ? (
          <VentureGridSkeleton count={4} />
        ) : !list.length ? (
          <EmptyState subject={SUBJECT}
            variant="illustrated"
            title="The Foundation's register is being prepared."
            body="Programmes, partnerships and continental advocacy will be set out here."
           />
        ) : (
          <Stack spacing={6} >
            {list.map((v, idx) => (
              <Grid container spacing={4} alignItems="flex-start" key={v.id} >
                {/* Pillar number */}
                <Grid item xs={12} md={2} >
                  <Box sx={{ position: { md: "sticky" }, top: { md: 100 }, textAlign: { md: "right" }, pr: { md: 2 }, borderRight: { md: `1px solid ${LORDINA.gold}` } }}>
                    <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 11, letterSpacing: "0.4em", color: LORDINA.sage, textTransform: "uppercase", fontWeight: 600, mb: 1 }}>
                      Pillar
                    </Typography>
                    <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 56, md: 80 }, lineHeight: 0.85, color: LORDINA.roseDeep }}>
                      {String(idx + 1).padStart(2, "0")}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={10} >
                  {v.featured ? (
                    <Box sx={{
                      p: { xs: 3, md: 5 },
                      background: "#fff",
                      boxShadow: `inset 0 0 0 1px ${LORDINA.gold}, 0 12px 28px rgba(123,35,53,0.06)`,
                      position: "relative",
                    }}>
                      <Box sx={{ position: "absolute", top: -14, left: 24, background: LORDINA.paper, px: 2, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 11, letterSpacing: "0.4em", color: LORDINA.rose, textTransform: "uppercase", fontWeight: 700 }}>
                        ❦ Foundation Flagship
                      </Box>
                      <PillarContent v={v} />
                    </Box>
                  ) : (
                    <PillarContent v={v} />
                  )}
                </Grid>
              </Grid>
            ))}
          </Stack>
        )}

        {list.length > 0 && (
          <Box sx={{ mt: 14, textAlign: "center" }}>
            <Garland width={300} color={LORDINA.sage} />
            <Typography sx={{ mt: 1.5, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 18, color: LORDINA.inkMuted }}>
              The more we share, the more we have.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

function PillarContent({ v }: { v: VentureDTO }) {
  return (
    <>
      <Stack direction="row" alignItems="baseline" spacing={2} sx={{ flexWrap: "wrap", rowGap: 1, mb: 2 }}>
        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 11, letterSpacing: "0.4em", color: LORDINA.paper, background: LORDINA.roseDeep, px: 1.25, py: 0.5, textTransform: "uppercase", fontWeight: 600 }}>
          {pillarFor(v)}
        </Typography>
        {v.founded && (
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 12, letterSpacing: "0.32em", color: LORDINA.gold, textTransform: "uppercase", fontWeight: 600 }}>
            Founded · {v.founded}
          </Typography>
        )}
      </Stack>
      <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: { xs: 30, md: 44 }, lineHeight: 1.1, color: LORDINA.roseDeep, mb: 1 }}>
        {v.name}
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Ribbon width={100} color={LORDINA.gold} />
      </Box>
      <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 18, color: LORDINA.sage, mb: 3 }}>
        {v.role}
      </Typography>
      <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 19, lineHeight: 1.7, color: LORDINA.inkSoft, mb: 3, maxWidth: 740 }}>
        {v.summary}
      </Typography>
      {v.highlights?.length > 0 && (
        <Box sx={{ borderTop: `1px solid ${LORDINA.rule}`, pt: 3 }}>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 11, letterSpacing: "0.4em", color: LORDINA.rose, textTransform: "uppercase", fontWeight: 700, mb: 2 }}>
            By Hand
          </Typography>
          <Stack spacing={1.5} >
            {v.highlights.map((h, hi) => (
              <Stack key={hi} direction="row" alignItems="baseline" spacing={2} >
                <Hibiscus size={12} color={LORDINA.gold} style={{ marginTop: 4, flexShrink: 0 }} />
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 17, color: LORDINA.inkSoft }}>
                  {h}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      )}
      {v.metrics?.length > 0 && (
        <Stack direction="row" spacing={3} sx={{ mt: 3, flexWrap: "wrap", rowGap: 1 }}>
          {v.metrics.map((m) => (
            <Box key={m.label} sx={{ borderLeft: `3px solid ${LORDINA.gold}`, pl: 1.5 }}>
              <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 11, letterSpacing: "0.32em", color: LORDINA.sage, textTransform: "uppercase", fontWeight: 600 }}>
                {m.label}
              </Typography>
              <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontStyle: "italic", fontSize: 24, color: LORDINA.roseDeep }}>
                {m.value}
              </Typography>
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
          sx={{ mt: 3, display: "inline-flex", alignItems: "center", gap: 1, color: LORDINA.roseDeep, textDecoration: "none", fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 14, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, borderBottom: `1px solid ${LORDINA.gold}`, pb: 0.5, "&:hover": { color: LORDINA.rose, borderColor: LORDINA.rose } }}
        >
          Visit the Foundation <ArrowOutwardIcon sx={{ fontSize: 14 }} />
        </Box>
      )}
    </>
  );
}
