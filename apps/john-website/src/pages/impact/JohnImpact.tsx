import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Container, Typography, Stack, Grid, Button } from "@mui/material";
import type { PhilanthropyDTO } from "@mahama/shared-types";
import { BlackStar, CardGridSkeleton, EmptyState, GyeNyame, KenteStripe, QueryError, Sankofa, Seo, StaggerGroup, StaggerItem , BreadcrumbSchema} from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;

const CATEGORIES = [
  { key: "all", label: "All Service" },
  { key: "health", label: "Health" },
  { key: "education", label: "Education" },
  { key: "youth", label: "Youth" },
  { key: "disaster-relief", label: "Disaster Relief" },
  { key: "religion", label: "Faith" },
  { key: "sports", label: "Sport" },
  { key: "other", label: "Other" },
];

function ServiceRecord({ p, index }: { p: PhilanthropyDTO; index: number }) {
  const featured = p.featured;
  return (
    <Box sx={{
      background: featured ? "#fff" : "rgba(255,255,255,0.6)",
      border: featured ? "2px solid #D4AF37" : "1px solid rgba(11,79,44,0.15)",
      boxShadow: featured ? "0 24px 48px rgba(11,79,44,0.08)" : "none",
      position: "relative",
      height: "100%",
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 32px 60px rgba(11,79,44,0.16)",
      },
    }}>
      {/* Kente stripe accent */}
      <KenteStripe height={4} />

      <Box sx={{ p: { xs: 3, md: 4 }, position: "relative" }}>
        {/* Roman index in green badge */}
        <Box sx={{
          position: "absolute",
          top: 12,
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
          {index < 9 ? `0${index + 1}` : index + 1}
        </Box>

        {/* Top label */}
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <BlackStar size={14} color="#D4AF37" />
          <Typography sx={{ fontSize: 10, letterSpacing: "0.4em", color: "#0B4F2C", textTransform: "uppercase", fontWeight: 700 }}>
            Service Record · {p.year}
          </Typography>
        </Stack>

        {/* Title */}
        <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: { xs: 24, md: 30 }, lineHeight: 1.15, color: "#0B4F2C", mb: 1.5, pr: 7 }}>
          {p.title}
        </Typography>

        {/* Beneficiary line */}
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Box sx={{ width: 28, height: 2, background: "#D4AF37" }} />
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 16, color: "#8E1B25" }}>
            {p.beneficiary}
          </Typography>
        </Stack>

        {/* Body */}
        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 18, lineHeight: 1.65, color: "rgba(15,26,20,0.85)", mb: 3 }}>
          {p.summary}
        </Typography>

        {/* Footer */}
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ pt: 2, borderTop: "1px solid rgba(11,79,44,0.18)" }}>
          <Box sx={{ background: "#0B4F2C", color: "#FBF8F1", px: 1.25, py: 0.4, fontFamily: '"Inter", sans-serif', fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 700 }}>
            {p.category.replace("-", " ")}
          </Box>
          {p.amount && (
            <Box sx={{ background: "#D4AF37", color: "#0B4F2C", px: 1.25, py: 0.4, fontFamily: '"Inter", sans-serif', fontSize: 10, letterSpacing: "0.18em", fontWeight: 700 }}>
              {p.amount}
            </Box>
          )}
          {featured && (
            <Box sx={{ color: "#8E1B25", fontFamily: '"Inter", sans-serif', fontSize: 10, letterSpacing: "0.32em", fontWeight: 700, ml: "auto" }}>
              ★ FLAGSHIP
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
}

export function JohnImpact() {
  const phil = useQuery({ queryKey: ["philanthropy"], queryFn: () => api.listPhilanthropy() });
  const [filter, setFilter] = useState("all");
  const all = phil.data ?? [];
  const items = useMemo(() => all.filter((p) => filter === "all" || p.category === filter), [all, filter]);

  return (
    <Box sx={{ background: "#FBF8F1", color: "#0F1A14" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Public Service Record" path="/impact"  />
      <BreadcrumbSchema
        baseUrl={window.location.origin}
        items={[{ name: "Home", path: "/" }, { name: "Impact", path: "/impact" }]}
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
            In the Service of the People
          </Typography>
          <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 48, md: 84 }, lineHeight: 0.95, color: "#0B4F2C", mb: 2 }}>
            Public Service<br />Record.
          </Typography>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 18, md: 22 }, color: "rgba(15,26,20,0.72)", maxWidth: 720, mx: "auto" }}>
            A working register of acts undertaken in service of the Republic — health, education, infrastructure, faith.
          </Typography>
        </Box>

        {/* Doctrine banner */}
        <Box sx={{ mb: 8, background: "#0B4F2C", color: "#FBF8F1", py: 4, px: { xs: 3, md: 5 }, position: "relative", overflow: "hidden" }}>
          <Box sx={{ position: "absolute", top: -20, right: -20, opacity: 0.06 }}>
            <BlackStar size={180} color="#D4AF37" />
          </Box>
          <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }} spacing={3} sx={{ position: "relative" }}>
            <GyeNyame size={48} color="#D4AF37" />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 11, letterSpacing: "0.4em", color: "#D4AF37", textTransform: "uppercase", fontWeight: 700, mb: 1 }}>
                The Doctrine of Service
              </Typography>
              <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 22, md: 28 }, lineHeight: 1.4, color: "#FBF8F1", maxWidth: 720 }}>
                "The work of an office is not measured in speeches, but in schools opened, hospitals built, and households reached."
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
                  fontFamily: '"DM Serif Display", serif',
                  fontSize: 14,
                  textTransform: "none",
                  color: filter === c.key ? "#FBF8F1" : "#0B4F2C",
                  background: filter === c.key ? "#0B4F2C" : "transparent",
                  border: "1.5px solid #0B4F2C",
                  borderRadius: 999,
                  px: 2.25,
                  py: 0.6,
                  "&:hover": { background: filter === c.key ? "#063820" : "rgba(11,79,44,0.08)" },
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
          <EmptyState subject={SUBJECT} variant="illustrated" title="The record is being prepared." body="Programmes will be filed here as the office of the President formalises them."  />
        ) : items.length === 0 ? (
          <EmptyState subject={SUBJECT} eyebrow="Filter" title="Nothing under this category." body="Try another filter, or view the full record."  />
        ) : (
          <StaggerGroup>
          <Grid container spacing={3} >
            {items.map((p, i) => (
              <Grid item xs={12} md={6} key={p.id} >
                <StaggerItem>
                  <ServiceRecord p={p} index={i} />
                </StaggerItem>
              </Grid>
            ))}
          </Grid>
          </StaggerGroup>
        )}

        {/* Closing seal */}
        {all.length > 0 && (
          <Box sx={{ mt: 12, textAlign: "center" }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} >
              <Box sx={{ flex: 1, maxWidth: 160, height: "1px", background: "#0B4F2C" }} />
              <Sankofa size={28} color="#0B4F2C" />
              <Box sx={{ flex: 1, maxWidth: 160, height: "1px", background: "#0B4F2C" }} />
            </Stack>
            <Typography sx={{ mt: 2, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 18, color: "rgba(15,26,20,0.6)" }}>
              By the work, by the deed.
            </Typography>
          </Box>
        )}
      </Container>
      <KenteStripe height={4} />
    </Box>
  );
}
