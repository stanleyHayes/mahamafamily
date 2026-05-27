import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container, Box, Grid, Typography, Stack, Button, TextField, Card, CardContent, Alert, Snackbar, Divider, Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subjectTokens } from "@mahama/ui-theme";
import { trackEvent } from "@mahama/website-core";
import { api, SUBJECT, SUBJECT_LABELS } from "../config.js";
import { IbrahimBookIndex } from "./book/IbrahimBook.js";
import { JohnBookIndex } from "./book/JohnBook.js";
import { SharafBookIndex } from "./book/SharafBook.js";
import { LordinaBookIndex } from "./book/LordinaBook.js";

export function BookPage() {
  const { slug } = useParams<{ slug?: string} >();

  if (!slug) {
    if (SUBJECT === "lordina") return <LordinaBookIndex />;
    if (SUBJECT === "john") return <JohnBookIndex />;
    if (SUBJECT === "sharaf") return <SharafBookIndex />;
    return <IbrahimBookIndex />;
  }

  return <BookingFlow slug={slug} />;
}

function BookingFlow({ slug }: { slug: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    trackEvent("booking_started");
  }, []);
  const mt = useQuery({ queryKey: ["meeting-type", slug], queryFn: () => api.getMeetingType(slug) });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [form, setForm] = useState({ inviteeName: "", inviteeEmail: "", inviteePhone: "", inviteeOrg: "", notes: "" });
  const [honeypot, setHoneypot] = useState("");
  const [snack, setSnack] = useState<{ msg: string; ok: boolean } | null>(null);
  const [confirmed, setConfirmed] = useState<{ when: string; type: string } | null>(null);
  const [staleSlots, setStaleSlots] = useState<Set<string>>(new Set());
  const prevSlotsRef = useRef<string[]>([]);

  const range = useMemo(() => {
    const from = new Date();
    const to = new Date(Date.now() + (mt.data?.horizonDays ?? 30) * 86400_000);
    return { from: from.toISOString(), to: to.toISOString() };
  }, [mt.data?.horizonDays]);

  const slots = useQuery({
    queryKey: ["slots", slug, mt.data?.id, range.from, range.to],
    queryFn: () => api.getAvailableSlots(mt.data!.id, range),
    enabled: !!mt.data?.id,
    refetchInterval: !selectedSlot ? 10_000 : false,
  });

  const create = useMutation({
    mutationFn: () => api.createBooking({
      meetingTypeId: mt.data!.id,
      startsAt: selectedSlot!,
      ...form,
      ...(honeypot ? { website: honeypot } : {}),
    } as Parameters<typeof api.createBooking>[0]),
    onSuccess: (b) => {
      setConfirmed({ when: b.startsAt, type: b.meetingTypeName });
      queryClient.invalidateQueries({ queryKey: ["slots", slug] });
      trackEvent("booking_completed");
    },
    onError: (e: Error) => setSnack({ msg: e.message, ok: false }),
  });

  useEffect(() => {
    if (slots.data && selectedDate == null) {
      const firstWithSlots = slots.data.find((d) => d.slots.length > 0);
      if (firstWithSlots) setSelectedDate(firstWithSlots.date);
    }
  }, [slots.data, selectedDate]);

  useEffect(() => {
    setStaleSlots(new Set());
    prevSlotsRef.current = [];
  }, [selectedDate]);

  useEffect(() => {
    if (!selectedDate || !slots.data) {
      prevSlotsRef.current = [];
      return;
    }
    const currentSlots = slots.data.find((d) => d.date === selectedDate)?.slots.map((s) => s.startsAt) ?? [];
    const currentSet = new Set(currentSlots);
    const prevSet = new Set(prevSlotsRef.current);

    setStaleSlots((prevStale) => {
      const nextStale = new Set(prevStale);
      for (const s of Array.from(nextStale)) {
        if (currentSet.has(s)) nextStale.delete(s);
      }
      for (const s of prevSet) {
        if (!currentSet.has(s)) nextStale.add(s);
      }
      return nextStale;
    });

    prevSlotsRef.current = currentSlots;
  }, [slots.data, selectedDate]);

  if (!mt.data) return <Container sx={{ py: 16 }}>Loading…</Container>;

  if (confirmed) {
    return (
      <Container maxWidth="md" sx={{ py: 16, textAlign: "center" }}>
        <Box sx={{ display: "inline-block", borderTop: "2px solid", borderColor: "secondary.main", pt: 4 }}>
          <Typography sx={{ color: "secondary.main", letterSpacing: "0.32em", textTransform: "uppercase", fontSize: 12, mb: 2 }}>
            Confirmed
          </Typography>
          <Typography variant="h2" sx={{ fontFamily: subjectTokens[SUBJECT].headingFont, fontSize: { xs: 40, md: 56 } }}>
            You're booked.
          </Typography>
          <Typography sx={{ mt: 3, fontSize: 18, color: "text.secondary" }}>
            {confirmed.type} · {new Date(confirmed.when).toLocaleString("en-GB", { weekday: "long", day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" })}
          </Typography>
          <Typography sx={{ mt: 4, color: "text.secondary" }}>
            A confirmation has been sent to {form.inviteeEmail}. You'll get a reminder the day before and an hour before.
          </Typography>
          <Button onClick={() => navigate("/")} sx={{ mt: 4 }} variant="outlined">Return home</Button>
        </Box>
      </Container>
    );
  }

  const dayList = (slots.data ?? []).filter((d) => d.slots.length > 0);
  const currentDay = dayList.find((d) => d.date === selectedDate);

  const staleList = selectedDate ? Array.from(staleSlots).filter((s) => s.slice(0, 10) === selectedDate) : [];
  const allSlots = currentDay
    ? [
        ...currentDay.slots.map((s) => ({ time: s.startsAt, available: true })),
        ...staleList.map((time) => ({ time, available: false })),
      ].sort((a, b) => a.time.localeCompare(b.time))
    : [];

  return (
    <Container maxWidth="lg" sx={{ py: 12 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/book")} sx={{ mb: 3 }}>
        All meeting types
      </Button>
      <Grid container spacing={6} >
        <Grid item xs={12} md={4} >
          <Typography sx={{ color: "secondary.main", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", mb: 1 }}>
            With {SUBJECT_LABELS[SUBJECT].name}
          </Typography>
          <Typography variant="h2" sx={{ fontFamily: subjectTokens[SUBJECT].headingFont, fontSize: { xs: 40, md: 56 }, lineHeight: 1.05, mb: 2 }}>
            {mt.data.name}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>{mt.data.description}</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip size="small" label={`${mt.data.durationMinutes} minutes`} />
            <Chip size="small" label={mt.data.location} variant="outlined" />
            <Chip size="small" label={`${mt.data.noticeHours}h notice`} variant="outlined" />
          </Stack>
        </Grid>
        <Grid item xs={12} md={8} >
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              {!selectedSlot ? (
                <>
                  <Typography variant="h6" sx={{ mb: 2 }}>1 · Choose a day</Typography>
                  <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: 1, mb: 3 }}>
                    {dayList.map((d) => (
                      <Button
                        key={d.date}
                        variant={selectedDate === d.date ? "contained" : "outlined"}
                        onClick={() => setSelectedDate(d.date)}
                        sx={{ flexShrink: 0, minWidth: 96, flexDirection: "column", py: 1, borderRadius: 2 }}
                      >
                        <Box sx={{ fontSize: 11, opacity: 0.7 }}>{new Date(d.date).toLocaleDateString("en-GB", { weekday: "short" })}</Box>
                        <Box sx={{ fontFamily: subjectTokens[SUBJECT].headingFont, fontSize: 22 }}>{new Date(d.date).getDate()}</Box>
                        <Box sx={{ fontSize: 11, opacity: 0.7 }}>{new Date(d.date).toLocaleDateString("en-GB", { month: "short" })}</Box>
                      </Button>
                    ))}
                    {!dayList.length && <Typography color="text.secondary">No available days in the next {mt.data.horizonDays} days.</Typography>}
                  </Stack>
                  {currentDay && (
                    <>
                      <Typography variant="h6" sx={{ mb: 2 }}>2 · Choose a time</Typography>
                      <Grid container spacing={1.5} >
                        {allSlots.map(({ time, available }) => (
                          <Grid item xs={6} sm={4} md={3} key={time} >
                            <Button
                              fullWidth
                              variant="outlined"
                              disabled={!available}
                              onClick={() => available && setSelectedSlot(time)}
                              sx={{
                                justifyContent: "center",
                                py: 1.2,
                                ...(!available && { opacity: 0.45, textDecoration: "line-through", borderColor: "divider", color: "text.disabled" }),
                              }}
                            >
                              {new Date(time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                              {!available && (
                                <Box component="span" sx={{ ml: 0.5, fontSize: 10, color: "error.main", textDecoration: "none" }}>
                                  Just taken
                                </Box>
                              )}
                            </Button>
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Box sx={{ mb: 3 }}>
                    <Button onClick={() => setSelectedSlot(null)} size="small">← Pick a different time</Button>
                    <Typography variant="h5" sx={{ mt: 1 }}>
                      {new Date(selectedSlot).toLocaleString("en-GB", { weekday: "long", day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" })}
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Typography variant="h6" sx={{ mb: 2 }}>3 · Your details</Typography>
                  <Box component="form" onSubmit={(e) => { e.preventDefault(); create.mutate(); }}>
                    <input type="text" name="website" autoComplete="off" tabIndex={-1} value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ position: "absolute", left: -9999, opacity: 0 }} aria-hidden />
                    <Grid container spacing={2} >
                      <Grid item xs={12} sm={6} ><TextField required fullWidth label="Full name" value={form.inviteeName} onChange={(e) => setForm((f) => ({ ...f, inviteeName: e.target.value }))} /></Grid>
                      <Grid item xs={12} sm={6} ><TextField required type="email" fullWidth label="Email" value={form.inviteeEmail} onChange={(e) => setForm((f) => ({ ...f, inviteeEmail: e.target.value }))} /></Grid>
                      <Grid item xs={12} sm={6} ><TextField fullWidth label="Phone" value={form.inviteePhone} onChange={(e) => setForm((f) => ({ ...f, inviteePhone: e.target.value }))} /></Grid>
                      <Grid item xs={12} sm={6} ><TextField fullWidth label="Organisation" value={form.inviteeOrg} onChange={(e) => setForm((f) => ({ ...f, inviteeOrg: e.target.value }))} /></Grid>
                      <Grid item xs={12} ><TextField fullWidth multiline minRows={4} label="What would you like to discuss?" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} /></Grid>
                    </Grid>
                    <Button type="submit" variant="contained" size="large" sx={{ mt: 3 }} disabled={create.isPending} >
                      {create.isPending ? "Confirming…" : "Confirm booking"}
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Snackbar open={!!snack} autoHideDuration={3500} onClose={() => setSnack(null)} >
        <Alert severity={snack?.ok ? "success" : "error"} >{snack?.msg}</Alert>
      </Snackbar>
    </Container>
  );
}
