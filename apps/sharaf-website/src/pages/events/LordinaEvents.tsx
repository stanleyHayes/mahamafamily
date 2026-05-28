import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@mahama/i18n";
import { Box, Container, Typography, Stack, Grid, Button } from "@mui/material";
import type { FlattenLocalized, EventDTO } from "@mahama/shared-types";
import { CardGridSkeleton, EmptyState, QueryError, Seo, BreadcrumbSchema} from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../../config.js";;
import { LORDINA, INVITATION_CLIP } from "../lordina/theme.js";
import { Hibiscus, Ribbon, PaperTexture, Garland, Mmusuyidee } from "../lordina/motifs.js";
import { normalizeLang } from "@mahama/shared-types";
import { resolveLocalized } from "@mahama/shared-types";

function monthKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, 1)).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function InvitationCard({ e }: { e: EventDTO }) {
  const d = new Date(e.startsAt);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const wk = d.toLocaleDateString("en-GB", { weekday: "long" });
  const mo = d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Accra" });

  return (
    <Box sx={{
      position: "relative",
      background: "#fff",
      clipPath: INVITATION_CLIP,
      pt: 5,
      pb: 4,
      px: { xs: 3, md: 4 },
      transition: "transform 0.25s, filter 0.25s",
      "&:hover": { transform: "translateY(-3px)", filter: "brightness(1.02)" },
    }}>
      {/* Top hibiscus crown — sits in the arch */}
      <Box sx={{ position: "absolute", top: 4, left: "50%", transform: "translateX(-50%)" }}>
        <Hibiscus size={22} color={LORDINA.rose} />
      </Box>

      <Grid container spacing={3} alignItems="center">
        {/* Date plate */}
        <Grid item xs={4} sx={{ textAlign: "center", borderRight: `1px solid ${LORDINA.rule}`, pr: 2 }}>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 12, letterSpacing: "0.18em", color: LORDINA.sage, textTransform: "uppercase", mb: 0.5 }}>
            {wk}
          </Typography>
          <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 56, md: 76 }, lineHeight: 0.85, color: LORDINA.roseDeep }}>
            {day}
          </Typography>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 12, letterSpacing: "0.32em", color: LORDINA.gold, mt: 0.5, fontWeight: 600 }}>
            {mo}
          </Typography>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 12, color: LORDINA.inkMuted, mt: 1 }}>
            {time}
          </Typography>
        </Grid>

        {/* Body */}
        <Grid item xs={8} >
          <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1 }}>
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 12, letterSpacing: "0.18em", color: LORDINA.sage, textTransform: "uppercase" }}>
              {e.category}
            </Typography>
            {e.featured && (
              <Typography sx={{ background: LORDINA.gold, color: LORDINA.ink, px: 1, py: 0.2, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600 }}>
                Patroness
              </Typography>
            )}
          </Stack>
          <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: { xs: 22, md: 26 }, lineHeight: 1.18, color: LORDINA.roseDeep, mb: 1 }}>
            {resolveLocalized(e.title)}
          </Typography>
          <Ribbon width={64} color={LORDINA.gold} style={{ marginBottom: 10 }} />
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 14, color: LORDINA.sage, textTransform: "uppercase", letterSpacing: "0.18em", mb: 1.5 }}>
            {resolveLocalized(e.venue)} · {resolveLocalized(e.city)}, {e.country}
          </Typography>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 16, lineHeight: 1.6, color: LORDINA.inkSoft }}>
            {resolveLocalized(e.description)}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export function LordinaEvents() {
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
    <Box sx={{ background: LORDINA.paper, color: LORDINA.ink, position: "relative", minHeight: "100vh" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Engagements" path="/events"  />
      <BreadcrumbSchema
        baseUrl={window.location.origin}
        items={[{ name: "Home", path: "/" }, { name: "Events", path: "/events" }]}
      />
      <PaperTexture />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: { xs: 8, md: 12 } }}>
        {/* Frontispiece */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 3 }}>
            <Garland width={120} color={LORDINA.sage} />
            <Mmusuyidee size={28} color={LORDINA.rose} />
            <Garland width={120} color={LORDINA.sage} />
          </Stack>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 14, letterSpacing: "0.4em", color: LORDINA.sage, textTransform: "uppercase", mb: 2 }}>
            Patroness · Hostess · Speaker
          </Typography>
          <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 56, md: 96 }, lineHeight: 0.95, color: LORDINA.roseDeep, mb: 2 }}>
            Engagements.
          </Typography>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 18, md: 22 }, color: LORDINA.inkSoft, maxWidth: 720, mx: "auto" }}>
            Inaugurations, gatherings, and addresses where the First Lady stands with women, with children, and with the Foundation.
          </Typography>
        </Box>

        {/* Filter */}
        {sorted.length > 0 && (
          <Stack direction="row" justifyContent="center" spacing={1} sx={{ mb: 6, flexWrap: "wrap" }} useFlexGap>
            {[
              { k: "all", label: "All", count: sorted.length },
              { k: "upcoming", label: "Forthcoming", count: upcomingCount },
              { k: "past", label: "Past", count: pastCount },
            ].map((f) => (
              <Button
                key={f.k}
                onClick={() => setFilter(f.k as typeof filter)}
                disableRipple
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontStyle: "italic",
                  fontSize: 14,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: filter === f.k ? LORDINA.roseDeep : LORDINA.inkMuted,
                  borderBottom: "1px solid",
                  borderColor: filter === f.k ? LORDINA.gold : "transparent",
                  borderRadius: 0,
                  px: 2,
                  "&:hover": { background: "transparent", color: LORDINA.roseDeep },
                }}
              >
                {f.label} <Box component="span" sx={{ ml: 0.75, opacity: 0.6 }}>· {f.count}</Box>
              </Button>
            ))}
          </Stack>
        )}

        {events.isError ? (<QueryError message="Unable to load events." onRetry={() => events.refetch()} />) : events.isLoading ? (
          <CardGridSkeleton count={4} />
        ) : !sorted.length ? (
          <EmptyState subject={SUBJECT}
            variant="illustrated"
            title="The diary is at rest."
            body="Engagements with the Foundation, OAFLAD, and traditional patronages will appear here when announced."
            ctaLabel="Schedule a meeting"
            ctaTo="/book"
           />
        ) : items.length === 0 ? (
          <EmptyState subject={SUBJECT} eyebrow="Filter" title={filter === "upcoming" ? "Nothing forthcoming." : "No past entries."} body="Try a different view."  />
        ) : (
          <Stack spacing={6} >
            {grouped.map(([monthK, list]) => (
              <Box key={monthK} >
                <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "baseline" }} spacing={2} sx={{ mb: 3 }}>
                  <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontStyle: "italic", fontSize: { xs: 32, md: 44 }, color: LORDINA.roseDeep, lineHeight: 1 }}>
                    {monthLabel(monthK)}
                  </Typography>
                  <Box sx={{ flex: 1, height: "1px", background: LORDINA.gold, opacity: 0.6 }} />
                  <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 13, letterSpacing: "0.18em", color: LORDINA.sage, textTransform: "uppercase" }}>
                    {list.length} {list.length === 1 ? "engagement" : "engagements"}
                  </Typography>
                </Stack>
                <Grid container spacing={3} >
                  {list.map((e) => (
                    <Grid item xs={12} md={6} key={e.id} >
                      <InvitationCard e={e} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Stack>
        )}

        {sorted.length > 0 && (
          <Box sx={{ mt: 12, textAlign: "center" }}>
            <Garland width={240} color={LORDINA.sage} />
            <Typography sx={{ mt: 1.5, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 18, color: LORDINA.inkMuted }}>
              No mother walks this road alone.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
