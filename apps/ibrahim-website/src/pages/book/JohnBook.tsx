import { Box, Container, Typography, Stack, Grid } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink } from "react-router-dom";
import type { MeetingTypeDTO } from "@mahama/shared-types";
import { BlackStar, CardGridSkeleton, EmptyState, GyeNyame, KenteStripe, QueryError, Seo, BreadcrumbSchema} from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;

function AudienceCard({ mt, index }: { mt: MeetingTypeDTO; index: number }) {
  const isFlagship = mt.slug === "diplomatic-call" || mt.slug.includes("speaking");
  return (
    <Box
      component={RouterLink}
      to={`/book/${mt.slug}`}
      sx={{
        position: "relative",
        background: isFlagship ? "#fff" : "rgba(255,255,255,0.65)",
        boxShadow: isFlagship
          ? "inset 0 0 0 2px #D4AF37, 0 24px 48px rgba(11,79,44,0.10)"
          : "inset 0 0 0 1px rgba(11,79,44,0.16)",
        clipPath:
          "polygon(0 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 28px 100%, 0 calc(100% - 28px))",
        textDecoration: "none",
        color: "inherit",
        display: "block",
        height: "100%",
        transition: "transform 0.2s, box-shadow 0.2s, filter 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          filter: "brightness(1.02)",
          boxShadow: isFlagship
            ? "inset 0 0 0 2px #D4AF37, 0 32px 60px rgba(11,79,44,0.18)"
            : "inset 0 0 0 1px #0B4F2C",
          "& .arrow": { color: "#8E1B25", transform: "translateX(4px)" },
        },
      }}
    >
      <KenteStripe height={4} />

      <Box sx={{ p: { xs: 3, md: 4 }, position: "relative" }}>
        {/* Roman disc */}
        <Box sx={{
          position: "absolute",
          top: 14,
          right: 16,
          width: 56,
          height: 56,
          background: "#0B4F2C",
          color: "#D4AF37",
          display: "grid",
          placeItems: "center",
          borderRadius: "50%",
          fontFamily: '"DM Serif Display", serif',
          fontStyle: "italic",
          fontSize: 22,
        }}>
          {String(index + 1).padStart(2, "0")}
        </Box>

        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <BlackStar size={14} color="#D4AF37" />
          <Typography sx={{ fontSize: 10, letterSpacing: "0.4em", color: "#0B4F2C", textTransform: "uppercase", fontWeight: 700 }}>
            Audience Type
          </Typography>
        </Stack>

        {/* Title */}
        <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: { xs: 26, md: 32 }, lineHeight: 1.15, color: "#0B4F2C", mb: 1, pr: 7 }}>
          {mt.name}
        </Typography>

        {/* Tagline */}
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Box sx={{ width: 28, height: 2, background: "#D4AF37" }} />
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 16, color: "#8E1B25" }}>
            {mt.durationMinutes} minutes · {mt.location}
          </Typography>
        </Stack>

        {/* Body */}
        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 18, lineHeight: 1.65, color: "rgba(15,26,20,0.85)", mb: 3 }}>
          {mt.description}
        </Typography>

        {/* Stat row */}
        <Grid container spacing={2} sx={{ pb: 3, mb: 3, borderBottom: "1px solid rgba(11,79,44,0.18)" }}>
          <Grid item xs={4} >
            <Typography sx={{ fontSize: 10, letterSpacing: "0.32em", color: "#0B4F2C", textTransform: "uppercase", fontWeight: 700, mb: 0.25 }}>
              Notice
            </Typography>
            <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, color: "#0B4F2C" }}>
              {mt.noticeHours}h
            </Typography>
          </Grid>
          <Grid item xs={4} >
            <Typography sx={{ fontSize: 10, letterSpacing: "0.32em", color: "#0B4F2C", textTransform: "uppercase", fontWeight: 700, mb: 0.25 }}>
              Horizon
            </Typography>
            <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, color: "#0B4F2C" }}>
              {mt.horizonDays}d
            </Typography>
          </Grid>
          <Grid item xs={4} >
            <Typography sx={{ fontSize: 10, letterSpacing: "0.32em", color: "#0B4F2C", textTransform: "uppercase", fontWeight: 700, mb: 0.25 }}>
              Buffer
            </Typography>
            <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, color: "#0B4F2C" }}>
              {mt.bufferMinutes}m
            </Typography>
          </Grid>
        </Grid>

        {/* Footer */}
        <Stack direction="row" alignItems="center">
          {isFlagship && (
            <Typography sx={{ color: "#8E1B25", fontFamily: '"Inter", sans-serif', fontSize: 10, letterSpacing: "0.32em", fontWeight: 700 }}>
              ★ FLAGSHIP AUDIENCE
            </Typography>
          )}
          <Box sx={{ flex: 1 }} />
          <Box className="arrow" sx={{ color: "#0B4F2C", fontFamily: '"Inter", sans-serif', fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700, borderBottom: "1px solid #D4AF37", pb: 0.5, transition: "color 0.2s, transform 0.2s", display: "flex", alignItems: "center", gap: 0.6 }}>
            Request audience
            <ArrowOutwardIcon sx={{ fontSize: 14 }} />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export function JohnBookIndex() {
  const types = useQuery({ queryKey: ["meeting-types"], queryFn: () => api.listMeetingTypes() });

  return (
    <Box sx={{ background: "#FBF8F1", color: "#0F1A14" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Audience Bureau" path="/book"  />
      <BreadcrumbSchema
        baseUrl={window.location.origin}
        items={[{ name: "Home", path: "/" }, { name: "Book", path: "/book" }]}
      />
      <KenteStripe height={6} />

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        {/* Frontispiece */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 4 }}>
            <Box sx={{ flex: 1, maxWidth: 140, height: "1px", background: "#0B4F2C" }} />
            <BlackStar size={20} color="#0B4F2C" />
            <Box sx={{ flex: 1, maxWidth: 140, height: "1px", background: "#0B4F2C" }} />
          </Stack>
          <Typography sx={{ fontSize: 11, letterSpacing: "0.5em", color: "#8E1B25", textTransform: "uppercase", fontWeight: 700, mb: 2 }}>
            Office of the President · Bureau of Audiences
          </Typography>
          <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 48, md: 80 }, lineHeight: 0.95, color: "#0B4F2C", mb: 2 }}>
            Request an<br />Audience.
          </Typography>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 18, md: 22 }, color: "rgba(15,26,20,0.72)", maxWidth: 720, mx: "auto" }}>
            The Chief of Staff reviews and confirms each audience personally. Speaking engagements, policy briefings, and diplomatic meetings — choose the right form below.
          </Typography>
        </Box>

        {/* Doctrine banner */}
        <Box sx={{ mb: 8, background: "#0B4F2C", color: "#FBF8F1", py: 4, px: { xs: 3, md: 5 }, position: "relative", overflow: "hidden" }}>
          <Box sx={{ position: "absolute", top: -20, right: -20, opacity: 0.07 }}>
            <BlackStar size={160} color="#D4AF37" />
          </Box>
          <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }} spacing={3} sx={{ position: "relative" }}>
            <GyeNyame size={48} color="#D4AF37" />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 11, letterSpacing: "0.4em", color: "#D4AF37", textTransform: "uppercase", fontWeight: 700, mb: 1 }}>
                A Note on Audiences
              </Typography>
              <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 20, md: 26 }, lineHeight: 1.4 }}>
                "An office is a door. We are honoured by who passes through it."
              </Typography>
            </Box>
          </Stack>
        </Box>

        {types.isError ? (<QueryError message="Unable to load meeting types." onRetry={() => types.refetch()} />) : types.isLoading ? (
          <CardGridSkeleton count={3} />
        ) : !types.data?.length ? (
          <EmptyState subject={SUBJECT} variant="illustrated" title="The Bureau is currently closed." body="Audiences will be made available again at the discretion of the Office."  />
        ) : (
          <Grid container spacing={3} >
            {types.data.map((mt, i) => (
              <Grid item xs={12} md={6} key={mt.id} >
                <AudienceCard mt={mt} index={i} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Closing seal */}
        {(types.data?.length ?? 0) > 0 && (
          <Box sx={{ mt: 12, textAlign: "center" }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} >
              <Box sx={{ flex: 1, maxWidth: 160, height: "1px", background: "#0B4F2C" }} />
              <GyeNyame size={28} color="#0B4F2C" />
              <Box sx={{ flex: 1, maxWidth: 160, height: "1px", background: "#0B4F2C" }} />
            </Stack>
            <Typography sx={{ mt: 2, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 18, color: "rgba(15,26,20,0.6)" }}>
              The Republic, in audience.
            </Typography>
          </Box>
        )}
      </Container>
      <KenteStripe height={4} />
    </Box>
  );
}
