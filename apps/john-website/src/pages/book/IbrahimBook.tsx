import { Box, Container, Typography, Stack, Grid } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink } from "react-router-dom";
import type { MeetingTypeDTO } from "@mahama/shared-types";
import { BlueprintGrid, CardGridSkeleton, EmptyState, QueryError, Seo, BreadcrumbSchema} from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;

const CAT_CODE: Record<string, string> = {
  "video": "VID",
  "in-person": "IPN",
  "phone": "PHN",
  "custom": "OTH",
};

function MeetingSlip({ mt, index }: { mt: MeetingTypeDTO; index: number }) {
  const code = CAT_CODE[mt.location] ?? "OTH";
  return (
    <Box
      component={RouterLink}
      to={`/book/${mt.slug}`}
      sx={{
        position: "relative",
        background: "rgba(8,9,14,0.6)",
        backdropFilter: "blur(2px)",
        textDecoration: "none",
        color: "inherit",
        display: "block",
        p: { xs: 3, md: 4 },
        height: "100%",
        transition: "transform 0.22s, filter 0.22s",
        clipPath: "polygon(0 0, calc(100% - 32px) 0, 100% 32px, 100% 100%, 32px 100%, 0 calc(100% - 32px))",
        boxShadow: "inset 0 0 0 1px rgba(201,162,39,0.32)",
        "&:hover": {
          filter: "brightness(1.08)",
          transform: "translateY(-3px)",
          boxShadow: "inset 0 0 0 1px #C9A227",
          "& .arrow": { transform: "translateX(6px)", color: "#C9A227" },
          "& .clock": { color: "#F2EDE2" },
        },
      }}
    >
      {/* Filing tag — top-left (top-right corner is cut) */}
      <Box sx={{ position: "absolute", top: 0, left: 0, background: "#C9A227", color: "#08090C", px: 1.5, py: 0.5, fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", fontWeight: 600 }}>
        MTG-{String(index + 1).padStart(3, "0")}
      </Box>

      {/* Top filing strip */}
      <Stack direction="row" spacing={2} sx={{ pb: 2, borderBottom: "1px solid rgba(201,162,39,0.18)", mb: 3 }}>
        <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "#C9A227", textTransform: "uppercase", fontWeight: 600 }}>
          {code} · {mt.location}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.28em", color: "rgba(242,237,226,0.55)" }}>
          STATUS · OPEN
        </Typography>
      </Stack>

      {/* Big clock duration */}
      <Stack direction="row" alignItems="baseline" spacing={2} sx={{ mb: 3 }}>
        <Typography className="clock" sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 64, md: 88 }, lineHeight: 0.85, color: "#C9A227", fontWeight: 600, transition: "color 0.2s" }}>
          {String(mt.durationMinutes).padStart(2, "0")}
        </Typography>
        <Box sx={{ pb: 1.5 }}>
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, letterSpacing: "0.32em", color: "rgba(242,237,226,0.55)", textTransform: "uppercase" }}>
            Min
          </Typography>
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, letterSpacing: "0.32em", color: "rgba(242,237,226,0.4)", textTransform: "uppercase", mt: 0.5 }}>
            +{mt.bufferMinutes} buf
          </Typography>
        </Box>
      </Stack>

      {/* Title */}
      <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 24, md: 30 }, lineHeight: 1.15, color: "#F2EDE2", mb: 1.5 }}>
        {mt.name}
      </Typography>

      {/* Body */}
      <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 16, lineHeight: 1.65, color: "rgba(242,237,226,0.78)", mb: 3 }}>
        {mt.description}
      </Typography>

      {/* Location */}
      {mt.locationDetails && (
        <Box sx={{ borderLeft: "3px solid #C9A227", pl: 2, mb: 3 }}>
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, letterSpacing: "0.32em", color: "#C9A227", textTransform: "uppercase", mb: 0.5 }}>
            Location
          </Typography>
          <Typography sx={{ fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 13, color: "rgba(242,237,226,0.85)" }}>
            {mt.locationDetails}
          </Typography>
        </Box>
      )}

      {/* Footer */}
      <Stack direction="row" alignItems="center" sx={{ pt: 2, borderTop: "1px solid rgba(201,162,39,0.16)" }}>
        <Stack direction="row" spacing={3} >
          <Box>
            <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, letterSpacing: "0.28em", color: "rgba(242,237,226,0.4)", textTransform: "uppercase" }}>
              Notice
            </Typography>
            <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: 16, color: "#F2EDE2" }}>
              {mt.noticeHours}h
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, letterSpacing: "0.28em", color: "rgba(242,237,226,0.4)", textTransform: "uppercase" }}>
              Horizon
            </Typography>
            <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: 16, color: "#F2EDE2" }}>
              {mt.horizonDays}d
            </Typography>
          </Box>
        </Stack>
        <Box sx={{ flex: 1 }} />
        <Box className="arrow" sx={{ color: "#C9A227", fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, letterSpacing: "0.28em", transition: "transform 0.2s, color 0.2s", display: "flex", alignItems: "center", gap: 0.5 }}>
          OPEN FILE
          <ArrowOutwardIcon sx={{ fontSize: 14 }} />
        </Box>
      </Stack>
    </Box>
  );
}

export function IbrahimBookIndex() {
  const types = useQuery({ queryKey: ["meeting-types"], queryFn: () => api.listMeetingTypes() });

  return (
    <Box sx={{ background: "#08090C", color: "#F2EDE2", position: "relative", minHeight: "100vh" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Appointment Registry" path="/book"  />
      <BreadcrumbSchema
        baseUrl={window.location.origin}
        items={[{ name: "Home", path: "/" }, { name: "Book", path: "/book" }]}
      />
      <BlueprintGrid />
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, py: { xs: 8, md: 12 } }}>
        {/* Header */}
        <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "baseline" }} spacing={3} sx={{ mb: 6 }}>
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.4em", color: "#C9A227", textTransform: "uppercase" }}>
            Document · Appointment Registry
          </Typography>
          <Box sx={{ flex: 1, height: "1px", background: "rgba(201,162,39,0.32)", display: { xs: "none", md: "block" } }} />
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "rgba(242,237,226,0.55)", textTransform: "uppercase" }}>
            {types.data?.length ?? 0} meeting types
          </Typography>
        </Stack>

        <Box sx={{ mb: 8 }}>
          <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 56, md: 96 }, lineHeight: 0.95, fontWeight: 600 }}>
            Schedule<br /><Box component="span" sx={{ color: "#C9A227", fontStyle: "italic", fontWeight: 500 }}>a Meeting.</Box>
          </Typography>
          <Typography sx={{ mt: 3, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 22, color: "rgba(242,237,226,0.78)", maxWidth: 640 }}>
            Press, partnership, philanthropy. The office of Ibrahim Mahama reads each request — choose a meeting type, hold a slot, and the office will confirm.
          </Typography>
        </Box>

        {types.isError ? (<QueryError message="Unable to load meeting types." onRetry={() => types.refetch()} />) : types.isLoading ? (
          <CardGridSkeleton count={3} />
        ) : !types.data?.length ? (
          <EmptyState subject={SUBJECT} variant="illustrated" title="The office is closed for new bookings." body="Public scheduling will reopen shortly."  />
        ) : (
          <Grid container spacing={3} >
            {types.data.map((mt, i) => (
              <Grid item xs={12} md={6} lg={4} key={mt.id} >
                <MeetingSlip mt={mt} index={i} />
              </Grid>
            ))}
          </Grid>
        )}

        {(types.data?.length ?? 0) > 0 && (
          <Box sx={{ mt: 12, pt: 4, borderTop: "1px solid rgba(201,162,39,0.32)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
            <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "rgba(242,237,226,0.45)", textTransform: "uppercase" }}>
              Office Hours · Mon–Fri · GMT
            </Typography>
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 18, color: "#C9A227" }}>
              Confirmation by return.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
