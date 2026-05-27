import { useQuery } from "@tanstack/react-query";
import { Box, Container, Typography, Stack, Grid } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import type { VentureDTO } from "@mahama/shared-types";
import { VentureGridSkeleton } from "@mahama/website-core";
import { EmptyState } from "@mahama/website-core";
import { Seo } from "@mahama/website-core";
import { KenteStripe, BlackStar, GyeNyame } from "@mahama/website-core";
import { StaggerGroup, StaggerItem } from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

function doctrineFor(v: VentureDTO): string {
  const n = v.name.toLowerCase();
  if (n.includes("24-hour") || n.includes("24 hour")) return "24-Hour Economy";
  if (n.includes("accra reset") || n.includes("reset")) return "The Accra Reset";
  if (n.includes("e-block") || n.includes("school")) return "Education Programme";
  if (n.includes("eastern corridor") || n.includes("road") || n.includes("infrastructure")) return "Infrastructure Programme";
  if (n.includes("atuabo") || n.includes("gas") || n.includes("energy")) return "Energy Programme";
  return v.featured ? "Flagship Doctrine" : "Programme";
}

export function JohnPortfolio() {
  const ventures = useQuery({ queryKey: ["ventures"], queryFn: () => api.listVentures() });
  const list = ventures.data ?? [];

  return (
    <Box sx={{ background: "#FBF8F1", color: "#0F1A14" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="The Programme" path="/ventures"  />
      <KenteStripe height={6} />

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 14 } }}>
        {/* Frontispiece */}
        <Box sx={{ textAlign: "center", mb: 10 }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 4 }}>
            <Box sx={{ flex: 1, maxWidth: 140, height: "1px", background: "#0B4F2C" }} />
            <BlackStar size={20} color="#0B4F2C" />
            <Box sx={{ flex: 1, maxWidth: 140, height: "1px", background: "#0B4F2C" }} />
          </Stack>
          <Typography sx={{ fontSize: 11, letterSpacing: "0.5em", color: "#8E1B25", textTransform: "uppercase", fontWeight: 700, mb: 2 }}>
            A Programme for the Republic
          </Typography>
          <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 48, md: 80 }, lineHeight: 0.95, color: "#0B4F2C", mb: 2 }}>
            The Programme.
          </Typography>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 18, md: 22 }, color: "rgba(15,26,20,0.72)", maxWidth: 720, mx: "auto" }}>
            Reset Ghana — the work begins immediately. The doctrine, the policies, the deliverables — set out in full.
          </Typography>
        </Box>

        {/* Doctrine bar */}
        <Box sx={{ mb: 10, background: "#0B4F2C", color: "#FBF8F1", py: 4, px: { xs: 3, md: 5 }, position: "relative", overflow: "hidden" }}>
          <Box sx={{ position: "absolute", top: -10, right: -10, opacity: 0.07 }}>
            <BlackStar size={140} color="#D4AF37" />
          </Box>
          <Grid container spacing={3} sx={{ position: "relative" }}>
            {[
              { name: "Reset Ghana", roman: "I" },
              { name: "24-Hour Economy", roman: "II" },
              { name: "The Accra Reset", roman: "III" },
            ].map((d) => (
              <Grid item xs={12} md={4} key={d.name} >
                <Stack direction="row" alignItems="baseline" spacing={2} >
                  <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontSize: 36, color: "#D4AF37", fontStyle: "italic", lineHeight: 1 }}>
                    {d.roman}
                  </Typography>
                  <Box>
                    <Typography sx={{ fontSize: 10, letterSpacing: "0.4em", color: "#D4AF37", textTransform: "uppercase", fontWeight: 700 }}>
                      Doctrine
                    </Typography>
                    <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: 22, color: "#FBF8F1", lineHeight: 1.1 }}>
                      {d.name}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Box>

        {ventures.isLoading ? (
          <VentureGridSkeleton count={4} />
        ) : !list.length ? (
          <EmptyState subject={SUBJECT}
            variant="illustrated"
            title="The Programme is being prepared."
            body="Policies, programmes and bilateral initiatives will be set out here as they are confirmed by the Office."
           />
        ) : (
          <StaggerGroup>
          <Stack spacing={6} >
            {list.map((v, idx) => (
              <StaggerItem key={v.id} >
              <Grid container spacing={4} alignItems="flex-start">
                {/* Section number */}
                <Grid item xs={12} md={2} >
                  <Box sx={{ position: { md: "sticky" }, top: { md: 100 }, textAlign: { md: "right" }, pr: { md: 2 }, borderRight: { md: "2px solid #D4AF37" } }}>
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 10, letterSpacing: "0.4em", color: "#8E1B25", textTransform: "uppercase", fontWeight: 700, mb: 1 }}>
                      Section
                    </Typography>
                    <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: { xs: 56, md: 80 }, lineHeight: 0.85, color: "#0B4F2C", fontStyle: "italic" }}>
                      {ROMAN[idx] ?? idx + 1}
                    </Typography>
                  </Box>
                </Grid>

                {/* Programme body */}
                <Grid item xs={12} md={10} >
                  {v.featured ? (
                    <Box sx={{
                      p: { xs: 3, md: 5 },
                      background: "#fff",
                      border: "2px solid #D4AF37",
                      boxShadow: "0 24px 48px rgba(11,79,44,0.08)",
                      position: "relative",
                    }}>
                      <Box sx={{ position: "absolute", top: -14, left: 24, background: "#FBF8F1", px: 2, fontSize: 10, letterSpacing: "0.36em", color: "#8E1B25", textTransform: "uppercase", fontWeight: 700 }}>
                        ★ Flagship of the Term
                      </Box>
                      <ProgrammeContent v={v} />
                    </Box>
                  ) : (
                    <ProgrammeContent v={v} />
                  )}
                </Grid>
              </Grid>
              </StaggerItem>
            ))}
          </Stack>
          </StaggerGroup>
        )}

        {/* Closing seal */}
        {list.length > 0 && (
          <Box sx={{ mt: 14, textAlign: "center" }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} >
              <Box sx={{ flex: 1, maxWidth: 160, height: "1px", background: "#0B4F2C" }} />
              <GyeNyame size={28} color="#0B4F2C" />
              <Box sx={{ flex: 1, maxWidth: 160, height: "1px", background: "#0B4F2C" }} />
            </Stack>
            <Typography sx={{ mt: 2, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 18, color: "rgba(15,26,20,0.6)" }}>
              The work begins immediately.
            </Typography>
          </Box>
        )}
      </Container>
      <KenteStripe height={4} />
    </Box>
  );
}

function ProgrammeContent({ v }: { v: VentureDTO }) {
  return (
    <>
      <Stack direction="row" alignItems="baseline" spacing={2} sx={{ flexWrap: "wrap", rowGap: 1, mb: 2 }}>
        <Typography sx={{ fontSize: 10, letterSpacing: "0.4em", color: "#FBF8F1", background: "#0B4F2C", px: 1.25, py: 0.5, textTransform: "uppercase", fontWeight: 700 }}>
          {doctrineFor(v)}
        </Typography>
        {v.founded && (
          <Typography sx={{ fontSize: 10, letterSpacing: "0.36em", color: "#8E1B25", textTransform: "uppercase", fontWeight: 700 }}>
            Initiated · {v.founded}
          </Typography>
        )}
      </Stack>
      <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: { xs: 30, md: 44 }, lineHeight: 1.1, color: "#0B4F2C", mb: 1 }}>
        {v.name}
      </Typography>
      <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 18, color: "#8E1B25", mb: 3 }}>
        {v.role}
      </Typography>
      <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 20, lineHeight: 1.7, color: "#1a261d", mb: 3, maxWidth: 740 }}>
        {v.summary}
      </Typography>
      {v.highlights?.length > 0 && (
        <Box sx={{ borderTop: "1px solid rgba(11,79,44,0.18)", pt: 3 }}>
          <Typography sx={{ fontSize: 10, letterSpacing: "0.4em", color: "#0B4F2C", textTransform: "uppercase", fontWeight: 700, mb: 2 }}>
            Deliverables
          </Typography>
          <Stack spacing={1.5} >
            {v.highlights.map((h, hi) => (
              <Stack key={hi} direction="row" alignItems="baseline" spacing={2} >
                <Box sx={{ width: 6, height: 6, background: "#D4AF37", mt: 1, flexShrink: 0 }} />
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 18, color: "rgba(15,26,20,0.85)" }}>
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
            <Box key={m.label} sx={{ borderLeft: "3px solid #D4AF37", pl: 1.5 }}>
              <Typography sx={{ fontSize: 10, letterSpacing: "0.32em", color: "#0B4F2C", textTransform: "uppercase", fontWeight: 700 }}>
                {m.label}
              </Typography>
              <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, color: "#0B4F2C" }}>
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
          sx={{ mt: 3, display: "inline-flex", alignItems: "center", gap: 1, color: "#0B4F2C", textDecoration: "none", fontFamily: '"Inter", sans-serif', fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, borderBottom: "1px solid #D4AF37", pb: 0.5, "&:hover": { color: "#8E1B25", borderColor: "#8E1B25" } }}
        >
          Read in full <ArrowOutwardIcon sx={{ fontSize: 14 }} />
        </Box>
      )}
    </>
  );
}
