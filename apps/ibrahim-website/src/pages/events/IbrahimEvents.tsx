import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@mahama/i18n";
import { Box, Container, Typography, Stack, Grid, Button } from "@mui/material";
import type { FlattenLocalized, EventDTO } from "@mahama/shared-types";
import { CardGridSkeleton } from "@mahama/website-core";
import { EmptyState } from "@mahama/website-core";
import { Seo } from "@mahama/website-core";
import { BlueprintGrid } from "@mahama/website-core";
import { StaggerGroup, StaggerItem } from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;
import { normalizeLang } from "@mahama/shared-types";
import { resolveLocalized } from "@mahama/shared-types";

const CAT_CODE: Record<string, string> = {
  speech: "SPK",
  philanthropy: "PHL",
  business: "BUS",
  sport: "SPT",
  political: "POL",
  other: "OTH",
};

function monthKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(Date.UTC(y!, (m! - 1), 1)).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function DiaryEntry({ e, index }: { e: EventDTO; index: number }) {
  const code = CAT_CODE[e.category] ?? "OTH";
  const d = new Date(e.startsAt);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const wk = d.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase();
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Accra" });

  return (
    <Box sx={{
      position: "relative",
      background: "rgba(8,9,14,0.6)",
      border: "1px solid rgba(201,162,39,0.32)",
      transition: "border-color 0.2s",
      "&:hover": { borderColor: "#C9A227" },
    }}>
      {/* Filing tag */}
      <Box sx={{ position: "absolute", top: 0, right: 0, background: "#C9A227", color: "#08090C", px: 1.5, py: 0.5, fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", fontWeight: 600 }}>
        ENGT-{String(index + 1).padStart(3, "0")}
      </Box>

      <Grid container>
        {/* Date plate */}
        <Grid item xs={4} md={2.5} sx={{ p: { xs: 3, md: 4 }, borderRight: "1px solid rgba(201,162,39,0.18)", textAlign: "center" }}>
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "#C9A227", mb: 0.5 }}>
            {wk}
          </Typography>
          <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 56, md: 80 }, lineHeight: 0.9, color: "#F2EDE2" }}>
            {day}
          </Typography>
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "rgba(242,237,226,0.55)", mt: 1 }}>
            {time} GMT
          </Typography>
        </Grid>

        {/* Body */}
        <Grid item xs={8} md={9.5} sx={{ p: { xs: 3, md: 4 } }}>
          <Stack direction="row" spacing={1.5} sx={{ mb: 1.5 }}>
            <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "#C9A227", textTransform: "uppercase", fontWeight: 600 }}>
              {code} · {e.category}
            </Typography>
            {e.featured && (
              <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.28em", color: "#08090C", background: "#C9A227", px: 1, py: 0.25, fontWeight: 600 }}>
                ★ FEATURED
              </Typography>
            )}
          </Stack>
          <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 24, md: 32 }, lineHeight: 1.15, color: "#F2EDE2", mb: 1.5 }}>
            {resolveLocalized(e.title)}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <Box sx={{ width: 24, height: 1, background: "#C9A227" }} />
            <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, letterSpacing: "0.28em", color: "rgba(242,237,226,0.78)", textTransform: "uppercase" }}>
              {resolveLocalized(e.venue)} · {resolveLocalized(e.city)}, {e.country}
            </Typography>
          </Stack>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 17, lineHeight: 1.65, color: "rgba(242,237,226,0.82)" }}>
            {resolveLocalized(e.description)}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export function IbrahimEvents() {
  const { i18n } = useTranslation();
    const events = useQuery({ queryKey: ["events", i18n.language], queryFn: () => api.listEvents(normalizeLang(i18n.language)) });
  const [filter, setFilter] = useState<"upcoming" | "past" | "all">("all");

  const sorted = useMemo(() => [...(events.data ?? [])].sort((a, b) => +new Date(b.startsAt) - +new Date(a.startsAt)), [events.data]);
  const items = useMemo(() => {
    const now = Date.now();
    if (filter === "upcoming") return sorted.filter((e) => +new Date(e.startsAt) >= now);
    if (filter === "past") return sorted.filter((e) => +new Date(e.startsAt) < now);
    return sorted;
  }, [sorted, filter]);

  // Group by month
  const grouped = useMemo(() => {
    const map = new Map<string, EventDTO[]>();
    items.forEach((e) => {
      const k = monthKey(e.startsAt);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(e);
    });
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [items]);

  const upcomingCount = sorted.filter((e) => +new Date(e.startsAt) >= Date.now()).length;
  const pastCount = sorted.length - upcomingCount;

  return (
    <Box sx={{ background: "#08090C", color: "#F2EDE2", position: "relative", minHeight: "100vh" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Engagements Diary" path="/events"  />
      <BlueprintGrid />
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, py: { xs: 8, md: 12 } }}>
        {/* Filing header */}
        <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "baseline" }} spacing={3} sx={{ mb: 6 }}>
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.4em", color: "#C9A227", textTransform: "uppercase" }}>
            Document · Engagements Diary
          </Typography>
          <Box sx={{ flex: 1, height: "1px", background: "rgba(201,162,39,0.32)", display: { xs: "none", md: "block" } }} />
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "rgba(242,237,226,0.55)", textTransform: "uppercase" }}>
            Total · {sorted.length}
          </Typography>
        </Stack>

        {/* Title */}
        <Box sx={{ mb: 8 }}>
          <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 56, md: 96 }, lineHeight: 0.95, fontWeight: 600 }}>
            Engagements<br /><Box component="span" sx={{ color: "#C9A227", fontStyle: "italic", fontWeight: 500 }}>Diary.</Box>
          </Typography>
          <Typography sx={{ mt: 3, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 22, color: "rgba(242,237,226,0.78)", maxWidth: 640 }}>
            Speeches, ceremonies, mining-industry forums and partnership meetings — public and forthcoming.
          </Typography>
        </Box>

        {/* Filter strip */}
        {sorted.length > 0 && (
          <Box sx={{ mb: 6, borderTop: "1px solid rgba(201,162,39,0.32)", borderBottom: "1px solid rgba(201,162,39,0.32)", py: 2, display: "flex", flexWrap: "wrap" }}>
            {[
              { k: "all", label: "All", count: sorted.length },
              { k: "upcoming", label: "Upcoming", count: upcomingCount },
              { k: "past", label: "Archive", count: pastCount },
            ].map((f) => (
              <Button
                key={f.k}
                onClick={() => setFilter(f.k as typeof filter)}
                disableRipple
                sx={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: 11,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: filter === f.k ? "#C9A227" : "rgba(242,237,226,0.55)",
                  borderBottom: "2px solid",
                  borderColor: filter === f.k ? "#C9A227" : "transparent",
                  borderRadius: 0,
                  px: 2,
                  mr: 1,
                  "&:hover": { background: "transparent", color: "#C9A227" },
                }}
              >
                {f.label} <Box component="span" sx={{ ml: 1, opacity: 0.5 }}>· {f.count}</Box>
              </Button>
            ))}
          </Box>
        )}

        {events.isLoading ? (
          <CardGridSkeleton count={4} />
        ) : !sorted.length ? (
          <EmptyState subject={SUBJECT} variant="illustrated" title="No engagements on the diary." body="Speeches and forums will appear here as they are confirmed." ctaLabel="Schedule a meeting" ctaTo="/book"  />
        ) : items.length === 0 ? (
          <EmptyState subject={SUBJECT} eyebrow="Filter" title={filter === "upcoming" ? "Nothing upcoming." : "No archive entries."} body="Try a different view."  />
        ) : (
          <Stack spacing={6} >
            {grouped.map(([monthK, list]) => (
              <Box key={monthK} >
                {/* Month spine */}
                <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "baseline" }} spacing={2} sx={{ mb: 3 }}>
                  <Typography sx={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 36, md: 56 }, color: "#C9A227", lineHeight: 1, opacity: 0.85 }}>
                    {monthLabel(monthK)}
                  </Typography>
                  <Box sx={{ flex: 1, height: "1px", background: "rgba(201,162,39,0.32)" }} />
                  <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "rgba(242,237,226,0.55)", textTransform: "uppercase" }}>
                    {list.length} {list.length === 1 ? "entry" : "entries"}
                  </Typography>
                </Stack>
                <StaggerGroup>
                <Stack spacing={2} >
                  {list.map((e, i) => (
                    <StaggerItem key={e.id} >
                      <DiaryEntry e={e} index={i} />
                    </StaggerItem>
                  ))}
                </Stack>
                </StaggerGroup>
              </Box>
            ))}
          </Stack>
        )}

        {/* Closing colophon */}
        {sorted.length > 0 && (
          <Box sx={{ mt: 12, pt: 4, borderTop: "1px solid rgba(201,162,39,0.32)", display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 2 }}>
            <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "rgba(242,237,226,0.45)", textTransform: "uppercase" }}>
              End of Diary · {items.length} of {sorted.length} entries
            </Typography>
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 20, color: "#C9A227" }}>
              The work continues.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
