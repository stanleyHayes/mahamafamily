import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Container, Typography, Stack, Grid, Button } from "@mui/material";
import type { PhilanthropyDTO } from "@mahama/shared-types";
import { BlueprintGrid, CardGridSkeleton, EmptyState, QueryError, Seo, StaggerGroup, StaggerItem , BreadcrumbSchema} from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;

const CATEGORIES: Array<{ key: string; label: string; code: string} > = [
  { key: "all", label: "All", code: "ALL" },
  { key: "health", label: "Health", code: "HLT" },
  { key: "education", label: "Education", code: "EDU" },
  { key: "youth", label: "Youth", code: "YTH" },
  { key: "disaster-relief", label: "Disaster Relief", code: "DRF" },
  { key: "religion", label: "Faith", code: "FTH" },
  { key: "sports", label: "Sport", code: "SPT" },
  { key: "other", label: "Other", code: "OTH" },
];

function CaseFileCard({ p, index }: { p: PhilanthropyDTO; index: number }) {
  const code = CATEGORIES.find((c) => c.key === p.category)?.code ?? "OTH";
  return (
    <Box
      sx={{
        position: "relative",
        background: "rgba(8,9,14,0.6)",
        backdropFilter: "blur(2px)",
        border: "1px solid rgba(201,162,39,0.32)",
        p: { xs: 3, md: 4 },
        height: "100%",
        transition: "border-color 0.2s, transform 0.2s",
        "&:hover": {
          borderColor: "#C9A227",
          "& .arrow": { transform: "translateX(4px)" },
        },
      }}
    >
      {/* Corner identifier */}
      <Box sx={{ position: "absolute", top: 0, right: 0, background: "#C9A227", color: "#08090C", px: 1.5, py: 0.5, fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", fontWeight: 600 }}>
        CASE-{String(index + 1).padStart(3, "0")}
      </Box>

      {/* Top filing strip */}
      <Stack direction="row" spacing={2} sx={{ pb: 2, borderBottom: "1px solid rgba(201,162,39,0.18)", mb: 3 }}>
        <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "#C9A227", textTransform: "uppercase", fontWeight: 600 }}>
          {code} · {p.category.replace("-", " ")}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.28em", color: "rgba(242,237,226,0.55)" }}>
          FY · {p.year}
        </Typography>
      </Stack>

      {/* Beneficiary on gold side-rule */}
      <Box sx={{ borderLeft: "3px solid #C9A227", pl: 2, mb: 3 }}>
        <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, letterSpacing: "0.32em", color: "#C9A227", textTransform: "uppercase", mb: 0.5 }}>
          Beneficiary
        </Typography>
        <Typography sx={{ fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 14, color: "rgba(242,237,226,0.92)", lineHeight: 1.4 }}>
          {p.beneficiary}
        </Typography>
      </Box>

      {/* Title */}
      <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 24, md: 30 }, lineHeight: 1.15, color: "#F2EDE2", mb: 2 }}>
        {p.title}
      </Typography>

      {/* Body */}
      <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 17, lineHeight: 1.65, color: "rgba(242,237,226,0.82)", mb: 3 }}>
        {p.summary}
      </Typography>

      {/* Footer row */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ pt: 2, borderTop: "1px solid rgba(201,162,39,0.16)" }}>
        {p.amount && (
          <Box sx={{ background: "#C9A227", color: "#08090C", px: 1.25, py: 0.4, fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.18em", fontWeight: 600 }}>
            {p.amount}
          </Box>
        )}
        {p.featured && (
          <Box sx={{ border: "1px solid #C9A227", color: "#C9A227", px: 1.25, py: 0.4, fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", fontWeight: 600 }}>
            ★ FLAGSHIP
          </Box>
        )}
        <Box sx={{ flex: 1 }} />
        <Box className="arrow" sx={{ color: "#C9A227", fontFamily: '"IBM Plex Mono", monospace', fontSize: 13, transition: "transform 0.2s" }}>
          OPEN →
        </Box>
      </Stack>
    </Box>
  );
}

export function IbrahimImpact() {
  const phil = useQuery({ queryKey: ["philanthropy"], queryFn: () => api.listPhilanthropy() });
  const [filter, setFilter] = useState("all");

  const items = useMemo(() => (phil.data ?? []).filter((p) => filter === "all" || p.category === filter), [phil.data, filter]);
  const allItems = phil.data ?? [];

  const stats = useMemo(() => {
    const sectors = new Set(allItems.map((i) => i.category));
    const years = allItems.map((i) => Number(i.year)).filter((n) => !Number.isNaN(n));
    const minYear = years.length ? Math.min(...years) : 0;
    const span = years.length ? new Date().getFullYear() - minYear + 1 : 0;
    const beneficiaryStr = allItems.map((p) => p.beneficiary).join(" ");
    const num = beneficiaryStr.match(/[\d,]+\+?/g)?.[0] ?? "10K+";
    return [
      { v: String(allItems.length).padStart(2, "0"), k: "Programmes Filed", h: "Across the office" },
      { v: num, k: "Beneficiaries", h: "Direct & indirect" },
      { v: `${span || "—"}`, k: "Years of Giving", h: "Continuous record" },
      { v: String(sectors.size), k: "Sectors", h: "Health · Edu · Faith · ..." },
    ];
  }, [allItems]);

  return (
    <Box sx={{ background: "#08090C", color: "#F2EDE2", position: "relative", minHeight: "100vh" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Ledger of Service" path="/impact"  />
      <BreadcrumbSchema
        baseUrl={window.location.origin}
        items={[{ name: "Home", path: "/" }, { name: "Impact", path: "/impact" }]}
      />
      <BlueprintGrid />
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, py: { xs: 8, md: 12 } }}>
        {/* Filing header */}
        <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "baseline" }} spacing={3} sx={{ mb: 6 }}>
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.4em", color: "#C9A227", textTransform: "uppercase" }}>
            Document · Ledger of Service
          </Typography>
          <Box sx={{ flex: 1, height: "1px", background: "rgba(201,162,39,0.32)", display: { xs: "none", md: "block" } }} />
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "rgba(242,237,226,0.55)", textTransform: "uppercase" }}>
            Filed · {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "short" })}
          </Typography>
        </Stack>

        {/* Title */}
        <Box sx={{ mb: 8 }}>
          <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 56, md: 96 }, lineHeight: 0.95, fontWeight: 600 }}>
            Service<br /><Box component="span" sx={{ color: "#C9A227", fontStyle: "italic", fontWeight: 500 }}>in Practice.</Box>
          </Typography>
          <Typography sx={{ mt: 3, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 22, color: "rgba(242,237,226,0.78)", maxWidth: 640 }}>
            A complete record of the office's giving — health, education, faith, disaster relief, sport. Filed for the public record.
          </Typography>
        </Box>

        {/* Total impact stats */}
        {allItems.length > 0 && (
          <Box sx={{ mb: 10 }}>
            <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.4em", color: "#C9A227", textTransform: "uppercase", mb: 2 }}>
              I. Total Impact
            </Typography>
            <Grid container sx={{ borderTop: "1px solid rgba(201,162,39,0.32)", borderBottom: "1px solid rgba(201,162,39,0.32)" }}>
              {stats.map((r, i) => (
                <Grid item xs={6} md={3} key={r.k} sx={{ py: 5, px: 4, borderRight: { md: i < 3 ? "1px solid rgba(201,162,39,0.16)" : "none" }, borderBottom: { xs: i < 2 ? "1px solid rgba(201,162,39,0.16)" : "none", md: "none" } }}>
                  <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 44, md: 72 }, lineHeight: 0.9, color: "#F2EDE2" }}>
                    {r.v}
                  </Typography>
                  <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.28em", color: "#C9A227", textTransform: "uppercase", mt: 1.5 }}>
                    {r.k}
                  </Typography>
                  <Typography sx={{ fontSize: 12, opacity: 0.5, fontFamily: '"IBM Plex Sans", sans-serif', mt: 0.5 }}>
                    {r.h}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Filter strip */}
        {allItems.length > 0 && (
          <Box sx={{ mb: 5, display: "flex", gap: 0, flexWrap: "wrap" }}>
            <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "rgba(242,237,226,0.55)", textTransform: "uppercase", py: 1, pr: 3 }}>
              Filter ▸
            </Typography>
            {CATEGORIES.map((c) => (
              <Button
                key={c.key}
                onClick={() => setFilter(c.key)}
                disableRipple
                sx={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: filter === c.key ? "#C9A227" : "rgba(242,237,226,0.55)",
                  borderBottom: "2px solid",
                  borderColor: filter === c.key ? "#C9A227" : "transparent",
                  borderRadius: 0,
                  px: 1.5,
                  py: 1,
                  minWidth: 0,
                  "&:hover": { background: "transparent", color: "#C9A227" },
                }}
              >
                {c.code} · {c.label}
              </Button>
            ))}
          </Box>
        )}

        {phil.isError ? (<QueryError message="Unable to load philanthropy." onRetry={() => phil.refetch()} />) : phil.isLoading ? (
          <CardGridSkeleton count={6} />
        ) : !allItems.length ? (
          <EmptyState subject={SUBJECT} variant="illustrated" title="The ledger awaits filing." body="Programmes are recorded here as the office formalises them."  />
        ) : items.length === 0 ? (
          <EmptyState subject={SUBJECT} eyebrow="Filter" title="Nothing under this code." body="Try another filter, or view the complete record."  />
        ) : (
          <StaggerGroup>
          <Grid container spacing={3} >
            {items.map((p, i) => (
              <Grid item xs={12} md={6} lg={4} key={p.id} >
                <StaggerItem>
                  <CaseFileCard p={p} index={i} />
                </StaggerItem>
              </Grid>
            ))}
          </Grid>
          </StaggerGroup>
        )}

        {/* Closing colophon */}
        {allItems.length > 0 && (
          <Box sx={{ mt: 12, pt: 4, borderTop: "1px solid rgba(201,162,39,0.32)", display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 2 }}>
            <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "rgba(242,237,226,0.45)", textTransform: "uppercase" }}>
              End of Ledger · {items.length} of {allItems.length} entries
            </Typography>
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 20, color: "#C9A227" }}>
              Service is its own ledger.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
