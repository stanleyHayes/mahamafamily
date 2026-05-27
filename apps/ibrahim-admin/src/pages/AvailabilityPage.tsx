import { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography, Stack, TextField, Button, Switch, IconButton, Snackbar, Alert,
  FormControlLabel, MenuItem, Tab, Tabs, Chip, Grid, Tooltip, Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AvailabilityProfileDTO, AvailabilityWindowDTO, MeetingTypeDTO } from "@mahama/shared-types";
import { api } from "../config.js";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function AvailabilityPage() {
  const params = new URLSearchParams(window.location.search);
  const hasCode = params.has("code");
  const [tab, setTab] = useState(hasCode ? 2 : 0);

  return (
    <Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Weekly hours" />
        <Tab label="Meeting types" />
        <Tab label="Integrations" />
      </Tabs>
      {tab === 0 ? <WeeklyHours /> : tab === 1 ? <MeetingTypes /> : <GoogleCalendarIntegration />}
    </Box>
  );
}

function WeeklyHours() {
  const qc = useQueryClient();
  const profile = useQuery({ queryKey: ["availability"], queryFn: () => api.admin.availability.get() });
  const [windows, setWindows] = useState<AvailabilityWindowDTO[]>([]);
  const [timezone, setTimezone] = useState("Africa/Accra");
  const [blackouts, setBlackouts] = useState<string[]>([]);
  const [newBlackout, setNewBlackout] = useState("");
  const [snack, setSnack] = useState<string | null>(null);

  useEffect(() => {
    if (profile.data) {
      setWindows(profile.data.windows ?? []);
      setTimezone(profile.data.timezone);
      setBlackouts(profile.data.blackoutDates ?? []);
    }
  }, [profile.data]);

  const save = useMutation({
    mutationFn: (data: Partial<AvailabilityProfileDTO>) => api.admin.availability.update(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["availability"] }); setSnack("Availability saved"); },
  });

  const addWindow = () => setWindows((ws) => [...ws, { id: `win-${Date.now()}`, dayOfWeek: 1, startTime: "09:00", endTime: "17:00", active: true }]);
  const updateWindow = (id: string, patch: Partial<AvailabilityWindowDTO>) => setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  const removeWindow = (id: string) => setWindows((ws) => ws.filter((w) => w.id !== id));

  return (
    <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5">When are you available?</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>Visitors can only book inside these windows.</Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField label="Timezone" fullWidth value={timezone} onChange={(e) => setTimezone(e.target.value)} helperText="IANA timezone (e.g. Africa/Accra)" />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6">Recurring windows</Typography>
            <Box sx={{ flex: 1 }} />
            <Button startIcon={<AddIcon />} onClick={addWindow}>Add window</Button>
          </Stack>
          <Stack spacing={1.5}>
            {windows.map((w) => (
              <Stack key={w.id} direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                <FormControlLabel
                  control={<Switch checked={w.active} onChange={(_, v) => updateWindow(w.id, { active: v })} />}
                  label={w.active ? "On" : "Off"}
                  sx={{ minWidth: 80 }}
                />
                <TextField select size="small" value={w.dayOfWeek} onChange={(e) => updateWindow(w.id, { dayOfWeek: Number(e.target.value) as AvailabilityWindowDTO["dayOfWeek"] })} sx={{ minWidth: 110 }}>
                  {DAY_LABELS.map((d, i) => <MenuItem key={d} value={i}>{d}</MenuItem>)}
                </TextField>
                <TextField type="time" size="small" value={w.startTime} onChange={(e) => updateWindow(w.id, { startTime: e.target.value })} />
                <Typography sx={{ opacity: 0.5 }}>—</Typography>
                <TextField type="time" size="small" value={w.endTime} onChange={(e) => updateWindow(w.id, { endTime: e.target.value })} />
                <Box sx={{ flex: 1 }} />
                <Tooltip title="Remove"><IconButton onClick={() => removeWindow(w.id)}><DeleteIcon /></IconButton></Tooltip>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Blackout dates</Typography>
          <Typography color="text.secondary" sx={{ mb: 2, fontSize: 13 }}>Specific days when bookings are blocked (holidays, travel).</Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <TextField type="date" size="small" value={newBlackout} onChange={(e) => setNewBlackout(e.target.value)} />
            <Button onClick={() => { if (newBlackout && !blackouts.includes(newBlackout)) { setBlackouts((b) => [...b, newBlackout].sort()); setNewBlackout(""); } }}>Add</Button>
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {blackouts.map((d) => (
              <Chip key={d} label={d} onDelete={() => setBlackouts((b) => b.filter((x) => x !== d))} />
            ))}
          </Stack>
        </Box>

        <Button variant="contained" sx={{ mt: 4 }} onClick={() => save.mutate({ windows, timezone, blackoutDates: blackouts })} disabled={save.isPending}>
          Save changes
        </Button>
      </CardContent>
      <Snackbar open={!!snack} autoHideDuration={2500} onClose={() => setSnack(null)}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </Card>
  );
}

function MeetingTypes() {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["meeting-types"], queryFn: () => api.admin.meetingTypes.list() });
  const [editing, setEditing] = useState<Partial<MeetingTypeDTO> | null>(null);
  const [snack, setSnack] = useState<string | null>(null);

  const save = useMutation({
    mutationFn: () => editing?.id ? api.admin.meetingTypes.update(editing.id, editing) : api.admin.meetingTypes.create(editing ?? {}),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["meeting-types"] }); setSnack("Saved"); setEditing(null); },
  });
  const remove = useMutation({
    mutationFn: (id: string) => api.admin.meetingTypes.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["meeting-types"] }),
  });

  if (editing) {
    const e = editing;
    const set = <K extends keyof MeetingTypeDTO>(k: K, v: MeetingTypeDTO[K]) => setEditing((x) => ({ ...x, [k]: v }));
    return (
      <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>{e.id ? "Edit" : "New"} meeting type</Typography>
          <Stack spacing={2} sx={{ maxWidth: 720 }}>
            <TextField label="Name" value={e.name ?? ""} onChange={(ev) => set("name", ev.target.value)} fullWidth />
            <TextField label="Slug" value={e.slug ?? ""} onChange={(ev) => set("slug", ev.target.value)} helperText="URL-friendly identifier (e.g. press-interview)" />
            <TextField label="Description" multiline minRows={3} value={e.description ?? ""} onChange={(ev) => set("description", ev.target.value)} />
            <Stack direction="row" spacing={2}>
              <TextField type="number" label="Duration (min)" value={e.durationMinutes ?? 30} onChange={(ev) => set("durationMinutes", Number(ev.target.value))} />
              <TextField type="number" label="Buffer (min)" value={e.bufferMinutes ?? 0} onChange={(ev) => set("bufferMinutes", Number(ev.target.value))} />
              <TextField type="number" label="Notice (hours)" value={e.noticeHours ?? 24} onChange={(ev) => set("noticeHours", Number(ev.target.value))} />
              <TextField type="number" label="Horizon (days)" value={e.horizonDays ?? 30} onChange={(ev) => set("horizonDays", Number(ev.target.value))} />
            </Stack>
            <TextField select label="Location" value={e.location ?? "video"} onChange={(ev) => set("location", ev.target.value as MeetingTypeDTO["location"])}>
              {["in-person", "video", "phone", "custom"].map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </TextField>
            <TextField label="Location details" value={e.locationDetails ?? ""} onChange={(ev) => set("locationDetails", ev.target.value)} helperText="Address / video link / phone instructions" />
            <Stack direction="row" spacing={3}>
              <FormControlLabel control={<Switch checked={!!e.active} onChange={(_, v) => set("active", v)} />} label="Active" />
              <FormControlLabel control={<Switch checked={!!e.public} onChange={(_, v) => set("public", v)} />} label="Public (visible on website)" />
            </Stack>
            <Stack direction="row" spacing={2}>
              <Button onClick={() => setEditing(null)}>Cancel</Button>
              <Button variant="contained" onClick={() => save.mutate()} disabled={save.isPending || !e.name}>Save</Button>
            </Stack>
          </Stack>
        </CardContent>
        <Snackbar open={!!snack} autoHideDuration={2500} onClose={() => setSnack(null)}>
          <Alert severity="success">{snack}</Alert>
        </Snackbar>
      </Card>
    );
  }

  return (
    <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
      <CardContent sx={{ p: 4 }}>
        <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5">Meeting types</Typography>
          <Box sx={{ flex: 1 }} />
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setEditing({ name: "", slug: "", description: "", durationMinutes: 30, bufferMinutes: 0, location: "video", noticeHours: 24, horizonDays: 30, active: true, public: true })}>
            New meeting type
          </Button>
        </Stack>
        <Stack spacing={1.5}>
          {(list.data ?? []).map((mt) => (
            <Stack key={mt.id} direction="row" alignItems="center" spacing={2} sx={{ p: 2.5, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">{mt.name}</Typography>
                <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                  /book/{mt.slug} · {mt.durationMinutes} min · {mt.location}
                </Typography>
              </Box>
              <Chip size="small" label={mt.active ? "Active" : "Off"} color={mt.active ? "success" : "default"} />
              <Chip size="small" label={mt.public ? "Public" : "Private"} variant="outlined" />
              <Button size="small" onClick={() => setEditing(mt)}>Edit</Button>
              <Tooltip title="Delete">
                <IconButton size="small" onClick={() => { if (confirm("Delete?")) remove.mutate(mt.id); }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          ))}
          {!list.data?.length && <Typography color="text.secondary">No meeting types yet — create one to start accepting bookings.</Typography>}
        </Stack>
      </CardContent>
    </Card>
  );
}

function GoogleCalendarIntegration() {
  const qc = useQueryClient();
  const [snack, setSnack] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const settings = useQuery({ queryKey: ["settings"], queryFn: () => api.admin.settings.get() });
  const gc = settings.data?.googleCalendar;

  const connect = useMutation({
    mutationFn: () => api.admin.googleCalendar.connect(),
    onSuccess: (data) => {
      if (data.authUrl) window.location.href = data.authUrl;
    },
    onError: (err: Error) => setError(err.message),
  });

  const callback = useMutation({
    mutationFn: (code: string) => api.admin.googleCalendar.callback(code),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["settings"] }); setSnack("Google Calendar connected"); },
    onError: (err: Error) => setError(err.message),
  });

  const sync = useMutation({
    mutationFn: () => api.admin.googleCalendar.sync(),
    onSuccess: (data) => setSnack(`Sync complete: ${data.pushed} pushed, ${data.pulled} pulled`),
    onError: (err: Error) => setError(err.message),
  });

  const disconnect = useMutation({
    mutationFn: () => api.admin.googleCalendar.disconnect(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["settings"] }); setSnack("Google Calendar disconnected"); },
    onError: (err: Error) => setError(err.message),
  });

  // Handle OAuth callback code from URL when redirected back
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code && !callback.isPending && !settings.isLoading) {
      callback.mutate(code);
      // clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [settings.isLoading]);

  return (
    <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5">Google Calendar</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Two-way sync keeps your availability up to date with Google Calendar.
        </Typography>

        <Divider sx={{ my: 2 }} />

        {gc?.refreshToken ? (
          <Stack spacing={3} alignItems="flex-start">
            <Alert severity="success" sx={{ width: "100%" }}>
              Connected {gc.connectedAt ? `on ${new Date(gc.connectedAt).toLocaleDateString()}` : ""}
            </Alert>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={() => sync.mutate()} disabled={sync.isPending}>
                {sync.isPending ? "Syncing…" : "Sync now"}
              </Button>
              <Button color="error" variant="outlined" onClick={() => disconnect.mutate()} disabled={disconnect.isPending}>
                Disconnect
              </Button>
            </Stack>
          </Stack>
        ) : (
          <Stack spacing={3} alignItems="flex-start">
            <Typography color="text.secondary">
              Connect your Google Calendar to push bookings and pull busy slots automatically.
            </Typography>
            <Button variant="contained" onClick={() => connect.mutate()} disabled={connect.isPending}>
              {connect.isPending ? "Connecting…" : "Connect Google Calendar"}
            </Button>
          </Stack>
        )}
      </CardContent>

      <Snackbar open={!!snack} autoHideDuration={4000} onClose={() => setSnack(null)}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Card>
  );
}
