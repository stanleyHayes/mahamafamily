import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { Box, Container, Stack, Typography, Button, Alert, Grid, CircularProgress } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { api, SUBJECT, SUBJECT_LABELS } from "../config.js";;
import { Seo, BlueprintGrid, QueryError } from "@mahama/website-core";

const MONO = '"IBM Plex Mono", monospace';
const SERIF = '"Playfair Display", Georgia, serif';
const SANS = '"IBM Plex Sans", sans-serif';

const slotBtn = (active: boolean) => ({
  borderRadius: 0,
  fontFamily: MONO,
  fontSize: 13,
  letterSpacing: "0.08em",
  py: 1.2,
  background: active ? "#C9A227" : "transparent",
  color: active ? "#08090C" : "#F2EDE2",
  border: `1px solid ${active ? "#C9A227" : "rgba(201,162,39,0.35)"}`,
  "&:hover": { background: active ? "#F2EDE2" : "rgba(201,162,39,0.12)", borderColor: "#C9A227" },
});

export function ReschedulePage() {
  const { id } = useParams<{ id: string} >();
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const range = useMemo(() => {
    const from = new Date();
    const to = new Date(Date.now() + 30 * 86400_000);
    return { from: from.toISOString(), to: to.toISOString() };
  }, []);

  const types = useQuery({ queryKey: ["meeting-types"], queryFn: () => api.listMeetingTypes() });
  const fallbackType = types.data?.[0];
  const slots = useQuery({
    queryKey: ["resched-slots", fallbackType?.id, range.from, range.to],
    queryFn: () => api.getAvailableSlots(fallbackType!.id, range),
    enabled: !!fallbackType?.id,
  });

  useEffect(() => {
    if (slots.data && selectedDate == null) {
      const first = slots.data.find((d) => d.slots.length > 0);
      if (first) setSelectedDate(first.date);
    }
  }, [slots.data, selectedDate]);

  const reschedule = useMutation({
    mutationFn: () => api.rescheduleBooking(id!, token, selectedSlot!),
    onSuccess: (b) => setDone(b.startsAt),
  });

  if (!id || !token) {
    return (
      <Box sx={{ background: "#08090C", color: "#F2EDE2", minHeight: "100vh" }}>
        <Container sx={{ py: 14 }}>
          <Alert severity="error" sx={{ background: "#2A0E0E", color: "#F2EDE2", border: "1px solid #7A1F1F", borderRadius: 0, fontFamily: MONO }}>
            This reissue link is not valid.
          </Alert>
        </Container>
      </Box>
    );
  }

  if (done) {
    return (
      <Box sx={{ background: "#08090C", color: "#F2EDE2", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
        <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Engagement reissued"  />
        <BlueprintGrid />
        <Container maxWidth="md" sx={{ py: 16, textAlign: "center", position: "relative" }}>
          <Typography sx={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.4em", color: "#C9A227", textTransform: "uppercase", mb: 3 }}>
            Reissued · stamped
          </Typography>
          <Typography sx={{ fontFamily: SERIF, fontSize: { xs: 44, md: 72 }, lineHeight: 0.96, fontWeight: 600 }}>
            New time entered<br />into the diary.
          </Typography>
          <Box sx={{ height: 1, width: 120, background: "rgba(201,162,39,0.5)", mx: "auto", my: 4 }} />
          <Typography sx={{ fontFamily: MONO, fontSize: 14, letterSpacing: "0.12em", color: "rgba(242,237,226,0.85)" }}>
            {new Date(done).toLocaleString("en-GB", { weekday: "long", day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" })}
          </Typography>
          <Button
            onClick={() => navigate("/")}
            sx={{ mt: 5, color: "#C9A227", fontFamily: SANS, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", borderRadius: 0, border: "1px solid rgba(201,162,39,0.5)", px: 3, py: 1.4, "&:hover": { background: "rgba(201,162,39,0.1)", borderColor: "#C9A227" } }}
          >
            Return to cover sheet
          </Button>
        </Container>
      </Box>
    );
  }

  const dayList = (slots.data ?? []).filter((d) => d.slots.length > 0);
  const day = dayList.find((d) => d.date === selectedDate);
  const stamp = new Date().toISOString().slice(0, 10);

  return (
    <Box sx={{ background: "#08090C", color: "#F2EDE2", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="Reissue the engagement"  />
      <BlueprintGrid />

      {types.isError && <Container maxWidth="md" sx={{ py: 4 }}><QueryError message="Unable to load meeting types." onRetry={() => types.refetch()} /></Container>}
      {slots.isError && <Container maxWidth="md" sx={{ py: 4 }}><QueryError message="Unable to load available slots." onRetry={() => slots.refetch()} /></Container>}

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, pt: { xs: 10, md: 14 }, pb: { xs: 10, md: 14 } }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
            <Typography sx={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.4em", color: "#C9A227", textTransform: "uppercase" }}>
              Form R–02 · Reissue
            </Typography>
            <Box sx={{ flex: 1, maxWidth: 160, height: "1px", background: "rgba(201,162,39,0.4)" }} />
            <Typography sx={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.32em", color: "rgba(242,237,226,0.55)", textTransform: "uppercase" }}>
              {stamp}
            </Typography>
          </Stack>

          <Typography sx={{ fontFamily: SERIF, fontSize: { xs: 40, md: 64 }, lineHeight: 0.98, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Reissue the{" "}
            <Box component="span" sx={{ color: "#C9A227", fontStyle: "italic" }}>engagement.</Box>
          </Typography>

          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 17, md: 19 }, lineHeight: 1.55, color: "rgba(242,237,226,0.78)", mt: 3, maxWidth: 600 }}>
            Pick a new time. The previous slot will be released; the
            secretariat will stamp the diary against the chosen entry.
          </Typography>
        </motion.div>

        <Box sx={{ mt: 6, border: "1px solid rgba(201,162,39,0.35)", p: { xs: 3, md: 4 }, background: "rgba(8,9,12,0.7)" }}>
          <Typography sx={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.32em", color: "#C9A227", textTransform: "uppercase", mb: 2 }}>
            Available days
          </Typography>
          <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: 1, mb: 4 }}>
            {dayList.map((d) => {
              const active = selectedDate === d.date;
              return (
                <Button
                  key={d.date}
                  onClick={() => { setSelectedDate(d.date); setSelectedSlot(null); }}
                  sx={{ flexShrink: 0, minWidth: 92, flexDirection: "column", py: 1.2, borderRadius: 0, fontFamily: MONO, background: active ? "#C9A227" : "transparent", color: active ? "#08090C" : "#F2EDE2", border: `1px solid ${active ? "#C9A227" : "rgba(201,162,39,0.35)"}`, "&:hover": { background: active ? "#F2EDE2" : "rgba(201,162,39,0.12)", borderColor: "#C9A227" } }}
                >
                  <Box sx={{ fontSize: 10, opacity: 0.8, letterSpacing: "0.2em", textTransform: "uppercase" }}>{new Date(d.date).toLocaleDateString("en-GB", { weekday: "short" })}</Box>
                  <Box sx={{ fontFamily: SERIF, fontSize: 24, lineHeight: 1.1, mt: 0.5 }}>{new Date(d.date).getDate()}</Box>
                  <Box sx={{ fontSize: 10, opacity: 0.8, letterSpacing: "0.2em", textTransform: "uppercase" }}>{new Date(d.date).toLocaleDateString("en-GB", { month: "short" })}</Box>
                </Button>
              );
            })}
          </Stack>

          {day && (
            <>
              <Typography sx={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.32em", color: "#C9A227", textTransform: "uppercase", mb: 2 }}>
                Slots on the diary
              </Typography>
              <Grid container spacing={1.5} >
                {day.slots.map((s) => {
                  const active = selectedSlot === s.startsAt;
                  return (
                    <Grid item xs={6} sm={4} md={3} key={s.startsAt} >
                      <Button fullWidth onClick={() => setSelectedSlot(s.startsAt)} sx={slotBtn(active)} >
                        {new Date(s.startsAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
            </>
          )}

          {reschedule.isError && (
            <Alert severity="error" sx={{ mt: 3, background: "#2A0E0E", color: "#F2EDE2", border: "1px solid #7A1F1F", borderRadius: 0, fontFamily: MONO, letterSpacing: "0.06em" }}>
              {(reschedule.error as Error).message}
            </Alert>
          )}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4 }} alignItems={{ sm: "center" }} justifyContent="space-between">
            <Typography sx={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.18em", color: "rgba(242,237,226,0.5)", textTransform: "uppercase" }}>
              Stamp · {stamp}
            </Typography>
            <Button
              disabled={!selectedSlot || reschedule.isPending}
              onClick={() => reschedule.mutate()}
              startIcon={reschedule.isPending ? <CircularProgress size={18} color="inherit" /> : undefined}
              sx={{ background: "#C9A227", color: "#08090C", fontFamily: SANS, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, borderRadius: 0, px: 4, py: 1.5, "&:hover": { background: "#F2EDE2" }, "&.Mui-disabled": { background: "rgba(201,162,39,0.3)", color: "#08090C" } }}
            >
              {reschedule.isPending ? "Stamping…" : "Stamp the new entry"}
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
