import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@mahama/i18n";
import { Box, Container, Typography, Stack, Grid, Button } from "@mui/material";
import type { FlattenLocalized, EventDTO } from "@mahama/shared-types";
import { BlackStar, CardGridSkeleton, EmptyState, GyeNyame, KenteStripe, QueryError, Seo, BreadcrumbSchema} from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;
import { normalizeLang } from "@mahama/shared-types";
import { resolveLocalized } from "@mahama/shared-types";

function monthKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(Date.UTC(y!, (m! - 1), 1)).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function StateEntry({ e, index, side }: { e: EventDTO; index: number; side: "left" | "right" }) {
  const featured = e.featured || e.category === "political";
  const d = new Date(e.startsAt);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const wk = d.toLocaleDateString("en-GB", { weekday: "long" });

  return (
    <Grid container spacing={4} alignItems="flex-start" sx={{ flexDirection: side === "right" ? "row-reverse" : "row" }}>
      {/* Date plate */}
      <Grid item xs={12} md={3} >
        <Box sx={{
          textAlign: { md: side === "left" ? "right" : "left" },
          pr: { md: side === "left" ? 2 : 0 },
          pl: { md: side === "right" ? 2 : 0 },
          borderRight: { md: side === "left" ? "2px solid #D4AF37" : "none" },
          borderLeft: { md: side === "right" ? "2px solid #D4AF37" : "none" },
          position: { md: "sticky" },
          top: { md: 100 },
        }}>
          <Typography sx={{ fontSize: 10, letterSpacing: "0.4em", color: "#8E1B25", textTransform: "uppercase", fontWeight: 700, mb: 1 }}>
            {wk}
          </Typography>
          <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 64, md: 88 }, lineHeight: 0.9, color: "#0B4F2C" }}>
            {day}
          </Typography>
          <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontSize: 18, color: "#0B4F2C", letterSpacing: "0.04em", mt: 0.5 }}>
            {d.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          </Typography>
        </Box>
      </Grid>

      {/* Card */}
      <Grid item xs={12} md={9} >
        <Box sx={{
          p: { xs: 3, md: 5 },
          background: featured ? "#fff" : "rgba(255,255,255,0.65)",
          border: featured ? "2px solid #D4AF37" : "1px solid rgba(11,79,44,0.16)",
          boxShadow: featured ? "0 24px 48px rgba(11,79,44,0.10)" : "none",
          position: "relative",
        }}>
          {featured && (
            <Box sx={{ position: "absolute", top: -14, left: 24, background: "#FBF8F1", px: 2, fontSize: 10, letterSpacing: "0.36em", color: "#8E1B25", textTransform: "uppercase", fontWeight: 700 }}>
              ★ Of State Significance
            </Box>
          )}
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <BlackStar size={14} color="#D4AF37" />
            <Typography sx={{ fontSize: 10, letterSpacing: "0.4em", color: "#0B4F2C", textTransform: "uppercase", fontWeight: 700 }}>
              Engagement {String(index + 1).padStart(2, "0")} · {e.category}
            </Typography>
          </Stack>
          <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: { xs: 28, md: 38 }, lineHeight: 1.1, color: "#0B4F2C", mb: 2 }}>
            {resolveLocalized(e.title)}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <Box sx={{ width: 28, height: 2, background: "#D4AF37" }} />
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 18, color: "#8E1B25" }}>
              {resolveLocalized(e.venue)} · {resolveLocalized(e.city)}, {e.country}
            </Typography>
          </Stack>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 19, lineHeight: 1.7, color: "rgba(15,26,20,0.85)" }}>
            {resolveLocalized(e.description)}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

export function JohnEvents() {
  const { i18n } = useTranslation();
    const events = useQuery({ queryKey: ["events", i18n.language], queryFn: () => api.listEvents(normalizeLang(i18n.language)) });
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  const sorted = useMemo(() => [...(events.data ?? [])].sort((a, b) => +new Date(b.startsAt) - +new Date(a.startsAt)), [events.data]);
  const items = useMemo(() => {
    const now = Date.now();
    if (filter === "upcoming") return sorted.filter((e) => +new Date(e.startsAt) >= now);
    if (filter === "past") return sorted.filter((e) => +new Date(e.startsAt) < now);
    return sorted;
  }, [sorted, filter]);

  const grouped = useMemo(() => {
    const map = new Map<string, EventDTO[]>();
    items.forEach((e) => {
      const k = monthKey(e.startsAt);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(e);
    });
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [items]);

  return (
    <Box sx={{ background: "#FBF8F1", color: "#0F1A14" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="The State Diary" path="/events"  />
      <BreadcrumbSchema
        baseUrl={window.location.origin}
        items={[{ name: "Home", path: "/" }, { name: "Events", path: "/events" }]}
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
            Audiences · Addresses · Engagements
          </Typography>
          <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 48, md: 84 }, lineHeight: 0.95, color: "#0B4F2C", mb: 2 }}>
            The State<br />Diary.
          </Typography>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 18, md: 22 }, color: "rgba(15,26,20,0.72)", maxWidth: 720, mx: "auto" }}>
            The Office's calendar of speeches, state ceremonies, bilateral meetings and civic functions — open to the public record.
          </Typography>
        </Box>

        {/* Filter pills */}
        {sorted.length > 0 && (
          <Stack direction="row" justifyContent="center" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 8 }}>
            {[
              { k: "all", label: "All Engagements", n: sorted.length },
              { k: "upcoming", label: "Forthcoming", n: sorted.filter((e) => +new Date(e.startsAt) >= Date.now()).length },
              { k: "past", label: "Archive", n: sorted.filter((e) => +new Date(e.startsAt) < Date.now()).length },
            ].map((f) => (
              <Button
                key={f.k}
                onClick={() => setFilter(f.k as typeof filter)}
                disableRipple
                sx={{
                  fontFamily: '"DM Serif Display", serif',
                  fontSize: 14,
                  textTransform: "none",
                  color: filter === f.k ? "#FBF8F1" : "#0B4F2C",
                  background: filter === f.k ? "#0B4F2C" : "transparent",
                  border: "1.5px solid #0B4F2C",
                  borderRadius: 999,
                  px: 2.5,
                  py: 0.6,
                  "&:hover": { background: filter === f.k ? "#063820" : "rgba(11,79,44,0.08)" },
                }}
              >
                {f.label} <Box component="span" sx={{ ml: 1, opacity: 0.7, fontFamily: '"Inter", sans-serif', fontSize: 12 }}>· {f.n}</Box>
              </Button>
            ))}
          </Stack>
        )}

        {events.isError ? (<QueryError message="Unable to load events." onRetry={() => events.refetch()} />) : events.isLoading ? (
          <CardGridSkeleton count={4} />
        ) : !sorted.length ? (
          <EmptyState subject={SUBJECT} variant="illustrated" title="No engagements on the diary." body="State functions and bilateral meetings will be filed here as they are confirmed." ctaLabel="Request an audience" ctaTo="/book"  />
        ) : items.length === 0 ? (
          <EmptyState subject={SUBJECT} eyebrow="Filter" title="Nothing in this view." body="Try a different filter."  />
        ) : (
          <Stack spacing={8} >
            {grouped.map(([monthK, list]) => (
              <Box key={monthK} >
                {/* Month banner */}
                <Box sx={{ position: "relative", mb: 5, py: 3, px: 4, background: "#0B4F2C", color: "#FBF8F1", overflow: "hidden" }}>
                  <Box sx={{ position: "absolute", top: -10, right: -10, opacity: 0.07 }}>
                    <BlackStar size={120} color="#D4AF37" />
                  </Box>
                  <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "baseline" }} spacing={2} sx={{ position: "relative" }}>
                    <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 28, md: 40 }, lineHeight: 1 }}>
                      {monthLabel(monthK)}
                    </Typography>
                    <Box sx={{ flex: 1 }} />
                    <Typography sx={{ fontSize: 11, letterSpacing: "0.32em", color: "#D4AF37", textTransform: "uppercase", fontWeight: 700 }}>
                      {list.length} {list.length === 1 ? "engagement" : "engagements"}
                    </Typography>
                  </Stack>
                  <KenteStripe height={3} style={{ marginTop: 16 }} />
                </Box>
                <Stack spacing={5} >
                  {list.map((e, i) => <StateEntry key={e.id} e={e} index={i} side={i % 2 === 0 ? "left" : "right"} />)}
                </Stack>
              </Box>
            ))}
          </Stack>
        )}

        {/* Closing seal */}
        {sorted.length > 0 && (
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
