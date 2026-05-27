import { Box, Container, Typography, Stack, Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink } from "react-router-dom";
import type { MeetingTypeDTO } from "@mahama/shared-types";
import { Seo } from "@mahama/website-core";
import { CardGridSkeleton } from "@mahama/website-core";
import { EmptyState } from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;
import { LORDINA, PETAL_CLIP } from "../lordina/theme.js";
import { Hibiscus, Ribbon, PaperTexture, Garland } from "../lordina/motifs.js";

function PatronageCard({ mt, index }: { mt: MeetingTypeDTO; index: number }) {
  return (
    <Box sx={{ position: "relative" }}>
      <Box
        component={RouterLink}
        to={`/book/${mt.slug}`}
        sx={{
          position: "relative",
          display: "block",
          textDecoration: "none",
          color: LORDINA.ink,
          background: "#fff",
          clipPath: PETAL_CLIP,
          pt: 6,
          pb: 6,
          px: { xs: 3, md: 4 },
          height: "100%",
          minHeight: 460,
          transition: "transform 0.25s, filter 0.25s",
          "&:hover": {
            transform: "translateY(-4px)",
            filter: "brightness(1.02)",
            "& .request": { color: LORDINA.rose, transform: "translateX(4px)" },
          },
        }}
      >
        {/* Hibiscus crest in the arch */}
        <Box sx={{ position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)" }}>
          <Hibiscus size={26} color={LORDINA.rose} />
        </Box>

        {/* Card no. */}
        <Typography sx={{ textAlign: "center", fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 12, letterSpacing: "0.32em", color: LORDINA.sage, textTransform: "uppercase", mb: 2 }}>
          Patronage No. {String(index + 1).padStart(2, "0")}
        </Typography>

        {/* Title */}
        <Typography sx={{ textAlign: "center", fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: { xs: 26, md: 32 }, lineHeight: 1.18, color: LORDINA.roseDeep, mb: 1 }}>
          {mt.name}
        </Typography>

        {/* Ribbon */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Ribbon width={100} color={LORDINA.gold} />
        </Box>

        {/* Tagline */}
        <Typography sx={{ textAlign: "center", fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 14, letterSpacing: "0.18em", color: LORDINA.sage, textTransform: "uppercase", mb: 2.5 }}>
          {mt.durationMinutes} minutes · {mt.location}
        </Typography>

        {/* Description */}
        <Typography sx={{ textAlign: "center", fontFamily: '"Cormorant Garamond", serif', fontSize: 16, lineHeight: 1.65, color: LORDINA.inkSoft, mb: 3 }}>
          {mt.description}
        </Typography>

        {/* Stat row */}
        <Stack direction="row" justifyContent="center" spacing={4} sx={{ pb: 2.5, mb: 2.5, borderBottom: `1px solid ${LORDINA.rule}` }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 11, letterSpacing: "0.22em", color: LORDINA.gold, textTransform: "uppercase", mb: 0.25 }}>
              Notice
            </Typography>
            <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontStyle: "italic", fontSize: 22, color: LORDINA.roseDeep }}>
              {mt.noticeHours}h
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 11, letterSpacing: "0.22em", color: LORDINA.gold, textTransform: "uppercase", mb: 0.25 }}>
              Horizon
            </Typography>
            <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontStyle: "italic", fontSize: 22, color: LORDINA.roseDeep }}>
              {mt.horizonDays}d
            </Typography>
          </Box>
        </Stack>

        {/* CTA */}
        <Box className="request" sx={{
          textAlign: "center",
          color: LORDINA.roseDeep,
          fontFamily: '"Cormorant Garamond", serif',
          fontStyle: "italic",
          fontSize: 14,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          transition: "color 0.2s, transform 0.2s",
        }}>
          Submit a request →
        </Box>
      </Box>
    </Box>
  );
}

export function LordinaBookIndex() {
  const types = useQuery({ queryKey: ["meeting-types"], queryFn: () => api.listMeetingTypes() });

  return (
    <Box sx={{ background: LORDINA.paper, color: LORDINA.ink, position: "relative", minHeight: "100vh" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Patronage Bureau" path="/book"  />
      <PaperTexture />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 3 }}>
            <Garland width={120} color={LORDINA.sage} />
            <Hibiscus size={32} color={LORDINA.rose} />
            <Garland width={120} color={LORDINA.sage} />
          </Stack>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 14, letterSpacing: "0.4em", color: LORDINA.sage, textTransform: "uppercase", mb: 2 }}>
            Office of the First Lady · Patronage Bureau
          </Typography>
          <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 48, md: 80 }, lineHeight: 0.95, color: LORDINA.roseDeep, mb: 2 }}>
            Request the<br />First Lady.
          </Typography>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 18, md: 22 }, color: LORDINA.inkSoft, maxWidth: 720, mx: "auto" }}>
            Foundation partnerships, press audiences, and ceremonial patronages — for events serving women,
            children, maternal health, and the Foundation's communities. The Office reviews each request personally.
          </Typography>
        </Box>

        {/* Doctrine plate */}
        <Box sx={{
          mb: 8,
          mx: "auto",
          maxWidth: 760,
          background: "#fff",
          py: 4,
          px: { xs: 3, md: 5 },
          position: "relative",
          boxShadow: `inset 0 0 0 1px ${LORDINA.rule}`,
        }}>
          <Box sx={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: LORDINA.paper, px: 2 }}>
            <Hibiscus size={26} color={LORDINA.rose} />
          </Box>
          <Typography sx={{ textAlign: "center", fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 22, md: 28 }, lineHeight: 1.4, color: LORDINA.roseDeep }}>
            "The more we share, the more we have."
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1.5 }}>
            <Ribbon width={120} color={LORDINA.gold} />
          </Box>
          <Typography sx={{ textAlign: "center", mt: 1, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 13, letterSpacing: "0.32em", color: LORDINA.sage, textTransform: "uppercase" }}>
            Lordina Foundation Motto
          </Typography>
        </Box>

        {types.isLoading ? (
          <CardGridSkeleton count={3} />
        ) : !types.data?.length ? (
          <EmptyState subject={SUBJECT} variant="illustrated" title="The Bureau is at rest." body="Public patronage requests will reopen at the discretion of the Office."  />
        ) : (
          <Grid container spacing={4} >
            {types.data.map((mt, i) => (
              <Grid item xs={12} md={6} lg={4} key={mt.id} >
                <PatronageCard mt={mt} index={i} />
              </Grid>
            ))}
          </Grid>
        )}

        {(types.data?.length ?? 0) > 0 && (
          <Box sx={{ mt: 12, textAlign: "center" }}>
            <Garland width={240} color={LORDINA.sage} />
            <Typography sx={{ mt: 1.5, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 18, color: LORDINA.inkMuted }}>
              By patronage and by hand.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
