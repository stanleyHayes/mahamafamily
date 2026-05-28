import { useEffect } from "react";
import { Box, Container, Stack, Typography, Button } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { motion } from "framer-motion";
import { BlueprintGrid, DrillRig, Seo, trackEvent } from "@mahama/website-core";
import { SUBJECT, SUBJECT_LABELS, api } from "../config.js";

const MONO = '"IBM Plex Mono", monospace';
const SERIF = '"Playfair Display", Georgia, serif';

export function NotFoundPage() {
  const { pathname } = useLocation();
  useEffect(() => { trackEvent("404", { path: pathname }); }, [pathname]);
  const stamp = new Date().toISOString().slice(0, 10);

  return (
    <Box sx={{ background: "#08090C", color: "#F2EDE2", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Document not in the dossier · 404" path="/404"  />
      <BlueprintGrid />

      {/* Diagonal "MISFILED" stamp watermark */}
      <Box sx={{ position: "absolute", top: { xs: 80, md: 120 }, right: { xs: -40, md: 40 }, transform: "rotate(-14deg)", border: "3px solid rgba(122,31,31,0.55)", color: "rgba(122,31,31,0.55)", px: 3, py: 1, fontFamily: MONO, fontSize: { xs: 22, md: 38 }, letterSpacing: "0.18em", fontWeight: 700, pointerEvents: "none" }}>
        MISFILED
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, pt: { xs: 12, md: 18 }, pb: { xs: 12, md: 18 } }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.2, 0.65, 0.3, 0.95] }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 6 }}>
            <Typography sx={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.4em", color: "#C9A227", textTransform: "uppercase" }}>
              Document № 404
            </Typography>
            <Box sx={{ flex: 1, maxWidth: 120, height: "1px", background: "rgba(201,162,39,0.4)" }} />
            <Typography sx={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.32em", color: "rgba(242,237,226,0.55)", textTransform: "uppercase" }}>
              Archive · Sealed
            </Typography>
          </Stack>

          <Typography sx={{ fontFamily: SERIF, fontSize: { xs: 56, sm: 88, md: 132 }, lineHeight: 0.92, fontWeight: 600, letterSpacing: "-0.02em", maxWidth: 1100 }}>
            The file you<br />
            requested is{" "}
            <Box component="span" sx={{ color: "#C9A227", fontStyle: "italic", fontWeight: 500 }}>
              not in
            </Box>
            <br />the dossier.
          </Typography>

          <Stack direction={{ xs: "column", md: "row" }} spacing={6} sx={{ mt: { xs: 6, md: 10 } }} alignItems={{ md: "flex-start" }}>
            {/* Filing slip — left */}
            <Box sx={{ flex: "1 1 480px", maxWidth: 560 }}>
              <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 19, md: 22 }, lineHeight: 1.55, color: "rgba(242,237,226,0.82)", mb: 4 }}>
                The page you opened may have been moved to a sealed archive,
                renamed during a quarterly review, or never entered the record.
                Either way, the trail ends here.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} >
                <Button
                  component={RouterLink}
                  to="/"
                  endIcon={<ArrowOutwardIcon sx={{ fontSize: "16px !important" }} />}
                  sx={{ background: "#C9A227", color: "#08090C", fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, borderRadius: 0, px: 3, py: 1.4, "&:hover": { background: "#F2EDE2" } }}
                >
                  Return to cover sheet
                </Button>
                <Button
                  component={RouterLink}
                  to="/timeline"
                  sx={{ color: "#C9A227", fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500, borderRadius: 0, justifyContent: "flex-start", "&:hover": { background: "transparent", color: "#F2EDE2" } }}
                >
                  Browse the index →
                </Button>
              </Stack>
            </Box>

            {/* Filing card — right */}
            <Box sx={{ flex: "0 0 320px", border: "1px solid rgba(201,162,39,0.35)", p: 3, fontFamily: MONO, fontSize: 11, letterSpacing: "0.08em", color: "rgba(242,237,226,0.78)" }}>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography sx={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.32em", color: "#C9A227", textTransform: "uppercase" }}>
                  Filing Slip
                </Typography>
                <DrillRig size={28} color="rgba(201,162,39,0.7)" />
              </Stack>
              <Stack spacing={1.2} >
                <Stack direction="row" justifyContent="space-between"><span style={{ opacity: 0.55 }}>STATUS</span><span>404 · NOT FOUND</span></Stack>
                <Stack direction="row" justifyContent="space-between"><span style={{ opacity: 0.55 }}>QUERY</span><span style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pathname}</span></Stack>
                <Stack direction="row" justifyContent="space-between"><span style={{ opacity: 0.55 }}>STAMP</span><span>{stamp}</span></Stack>
                <Stack direction="row" justifyContent="space-between"><span style={{ opacity: 0.55 }}>CLERK</span><span>I.M. — Office of the Patron</span></Stack>
                <Box sx={{ height: 1, background: "rgba(201,162,39,0.25)", my: 1.2 }} />
                <Typography sx={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.16em", color: "rgba(242,237,226,0.55)", lineHeight: 1.6 }}>
                  Refile request via /contact for assistance from the secretariat.
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}
