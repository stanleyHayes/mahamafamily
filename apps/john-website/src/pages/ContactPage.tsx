import { useState } from "react";
import {
  Box, Container, Grid, Stack, Typography, TextField, MenuItem, Button, Alert, Snackbar, CircularProgress,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { api, SUBJECT, SUBJECT_LABELS } from "../config.js";;
import { trackEvent } from "@mahama/website-core";
import { Seo } from "@mahama/website-core";
import { BlueprintGrid, DrillRig } from "@mahama/website-core";

const MONO = '"IBM Plex Mono", monospace';
const SERIF = '"Playfair Display", Georgia, serif';
const SANS = '"IBM Plex Sans", sans-serif';

const CATEGORIES = [
  { value: "press", label: "Press · interview" },
  { value: "philanthropy", label: "SCCA · cultural" },
  { value: "business", label: "Industrial · partnership" },
  { value: "speaking", label: "Lecture · convening" },
  { value: "fan", label: "From the public" },
  { value: "general", label: "General correspondence" },
] as const;

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 0,
    background: "rgba(242,237,226,0.04)",
    color: "#F2EDE2",
    fontFamily: SANS,
    "& fieldset": { borderColor: "rgba(201,162,39,0.35)" },
    "&:hover fieldset": { borderColor: "rgba(201,162,39,0.65)" },
    "&.Mui-focused fieldset": { borderColor: "#C9A227" },
  },
  "& .MuiInputLabel-root": { color: "rgba(242,237,226,0.6)", fontFamily: SANS, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#C9A227" },
} as const;

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", body: "", category: "general" as (typeof CATEGORIES)[number]["value"] });
  const [honeypot, setHoneypot] = useState("");
  const [snack, setSnack] = useState<{ msg: string; ok: boolean } | null>(null);

  const submit = useMutation({
    mutationFn: () => api.sendMessage({ ...form, ...(honeypot ? { website: honeypot } : {}) } as Parameters<typeof api.sendMessage>[0]),
    onSuccess: () => {
      setSnack({ msg: "Filed. The secretariat will respond.", ok: true });
      setForm({ name: "", email: "", phone: "", subject: "", body: "", category: "general" });
      trackEvent("contact_form_sent");
    },
    onError: (e: Error) => setSnack({ msg: e.message ?? "Could not file the dispatch.", ok: false }),
  });

  const stamp = new Date().toISOString().slice(0, 10);

  return (
    <Box sx={{ background: "#08090C", color: "#F2EDE2", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} title="File a dispatch · Office of the Patron" path="/contact"  />
      <BlueprintGrid />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, pt: { xs: 12, md: 18 }, pb: { xs: 12, md: 18 } }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 0.95] }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 6 }}>
            <Typography sx={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.4em", color: "#C9A227", textTransform: "uppercase" }}>
              Form C–01 · Dispatch
            </Typography>
            <Box sx={{ flex: 1, maxWidth: 160, height: "1px", background: "rgba(201,162,39,0.4)" }} />
            <Typography sx={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.32em", color: "rgba(242,237,226,0.55)", textTransform: "uppercase" }}>
              Office of the Patron · Tamale
            </Typography>
          </Stack>

          <Typography sx={{ fontFamily: SERIF, fontSize: { xs: 44, sm: 64, md: 96 }, lineHeight: 0.96, fontWeight: 600, letterSpacing: "-0.02em", maxWidth: 1100 }}>
            File a{" "}
            <Box component="span" sx={{ color: "#C9A227", fontStyle: "italic", fontWeight: 500 }}>dispatch</Box>
            <br />to the office.
          </Typography>

          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: { xs: 18, md: 21 }, lineHeight: 1.55, color: "rgba(242,237,226,0.78)", mt: 4, maxWidth: 720 }}>
            Press, lecture, partnership, or a note from the public — log it
            below. The secretariat reviews each entry; the Patron sees
            everything that has been logged.
          </Typography>
        </motion.div>

        <Grid container spacing={{ xs: 4, md: 6 }} sx={{ mt: { xs: 4, md: 8 } }}>
          {/* Letter form */}
          <Grid item xs={12} md={8} >
            <Box
              component="form"
              onSubmit={(e) => { e.preventDefault(); submit.mutate(); }}
              sx={{ border: "1px solid rgba(201,162,39,0.35)", p: { xs: 3, md: 5 }, background: "rgba(8,9,12,0.65)", position: "relative" }}
            >
              {/* corner stamp */}
              <Box sx={{ position: "absolute", top: 16, right: 16, transform: "rotate(-8deg)", border: "2px solid rgba(201,162,39,0.5)", color: "rgba(201,162,39,0.6)", px: 1.4, py: 0.4, fontFamily: MONO, fontSize: 10, letterSpacing: "0.18em", fontWeight: 700, pointerEvents: "none" }}>
                LOGGED · {stamp}
              </Box>

              <input type="text" name="website" autoComplete="off" tabIndex={-1} value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ position: "absolute", left: -9999, opacity: 0 }} aria-hidden />

              <Grid container spacing={2.5} >
                <Grid item xs={12} >
                  <Typography sx={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.32em", color: "#C9A227", textTransform: "uppercase", mb: 0.5 }}>
                    § 1 · Sender
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} ><TextField label="Full name" required fullWidth value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} sx={inputSx} /></Grid>
                <Grid item xs={12} sm={6} ><TextField label="Email" type="email" required fullWidth value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} sx={inputSx} /></Grid>
                <Grid item xs={12} sm={6} ><TextField label="Phone (optional)" fullWidth value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} sx={inputSx} /></Grid>
                <Grid item xs={12} sm={6} >
                  <TextField select label="Filing category" fullWidth value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as typeof form.category }))} sx={inputSx} >
                    {CATEGORIES.map((c) => <MenuItem key={c.value} value={c.value} >{c.label}</MenuItem>)}
                  </TextField>
                </Grid>

                <Grid item xs={12} ><Box sx={{ height: 1, background: "rgba(201,162,39,0.18)", my: 1 }} /></Grid>

                <Grid item xs={12} >
                  <Typography sx={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.32em", color: "#C9A227", textTransform: "uppercase", mb: 0.5 }}>
                    § 2 · The matter
                  </Typography>
                </Grid>
                <Grid item xs={12} ><TextField label="Subject heading" required fullWidth value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} sx={inputSx} /></Grid>
                <Grid item xs={12} >
                  <TextField
                    label="Body of the letter"
                    multiline
                    minRows={7}
                    required
                    fullWidth
                    value={form.body}
                    onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                    sx={inputSx} />
                </Grid>
              </Grid>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4 }} alignItems={{ sm: "center" }} justifyContent="space-between">
                <Typography sx={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.18em", color: "rgba(242,237,226,0.5)", textTransform: "uppercase" }}>
                  Filed dispatches are reviewed in order received.
                </Typography>
                <Button
                  type="submit"
                  disabled={submit.isPending}
                  startIcon={submit.isPending ? <CircularProgress size={18} color="inherit" /> : undefined}
                  sx={{ background: "#C9A227", color: "#08090C", fontFamily: SANS, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, borderRadius: 0, px: 4, py: 1.5, "&:hover": { background: "#F2EDE2" }, "&.Mui-disabled": { background: "rgba(201,162,39,0.4)", color: "#08090C" } }}
                >
                  {submit.isPending ? "Filing…" : "Lodge the dispatch"}
                </Button>
              </Stack>
            </Box>
          </Grid>

          {/* Filing record / addresses */}
          <Grid item xs={12} md={4} >
            <Stack spacing={3} >
              <Box sx={{ border: "1px solid rgba(201,162,39,0.35)", p: 3, fontFamily: MONO, fontSize: 11, letterSpacing: "0.08em", color: "rgba(242,237,226,0.78)" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography sx={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.32em", color: "#C9A227", textTransform: "uppercase" }}>
                    Filing slip
                  </Typography>
                  <DrillRig size={28} color="rgba(201,162,39,0.7)" />
                </Stack>
                <Stack spacing={1.2} >
                  <Stack direction="row" justifyContent="space-between"><span style={{ opacity: 0.55 }}>FORM</span><span>C-01 / DISPATCH</span></Stack>
                  <Stack direction="row" justifyContent="space-between"><span style={{ opacity: 0.55 }}>STAMP</span><span>{stamp}</span></Stack>
                  <Stack direction="row" justifyContent="space-between"><span style={{ opacity: 0.55 }}>CLERK</span><span>Office of the Patron</span></Stack>
                </Stack>
              </Box>

              <Box sx={{ border: "1px solid rgba(242,237,226,0.12)", p: 3 }}>
                <Typography sx={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.32em", color: "#C9A227", textTransform: "uppercase", mb: 2 }}>
                  Addresses
                </Typography>
                <Stack spacing={2.5} >
                  <Box>
                    <Typography sx={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(242,237,226,0.55)" }}>
                      Tamale · SCCA
                    </Typography>
                    <Typography sx={{ fontFamily: SERIF, fontSize: 18, color: "#F2EDE2", mt: 0.5 }}>
                      Savannah Centre for<br />Contemporary Art
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(242,237,226,0.55)" }}>
                      Accra · Engineers & Planners
                    </Typography>
                    <Typography sx={{ fontFamily: SERIF, fontSize: 18, color: "#F2EDE2", mt: 0.5 }}>
                      Industrial correspondence
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Snackbar open={!!snack} autoHideDuration={4000} onClose={() => setSnack(null)} >
        <Alert
          severity={snack?.ok ? "success" : "error"}
          onClose={() => setSnack(null)}
          sx={{ background: snack?.ok ? "#0E2A18" : "#2A0E0E", color: "#F2EDE2", border: "1px solid", borderColor: snack?.ok ? "#2C5A3A" : "#7A1F1F", borderRadius: 0, fontFamily: MONO, letterSpacing: "0.06em" }}
        >
          {snack?.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
