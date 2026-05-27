import { useEffect, useState } from "react";
import { Card, CardContent, Stack, TextField, Button, Snackbar, Alert, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SiteSettingsDTO } from "@mahama/shared-types";
import { api } from "../config.js";

export function SettingsPage() {
  const qc = useQueryClient();
  const settings = useQuery({ queryKey: ["site-settings"], queryFn: () => api.admin.settings.get() });
  const [form, setForm] = useState<Partial<SiteSettingsDTO>>({});
  const [snack, setSnack] = useState<string | null>(null);

  useEffect(() => { if (settings.data) setForm(settings.data); }, [settings.data]);

  const save = useMutation({
    mutationFn: () => api.admin.settings.update(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["site-settings"] }); setSnack("Saved"); },
  });

  const set = <K extends keyof SiteSettingsDTO>(k: K, v: SiteSettingsDTO[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3 }}>Site settings</Typography>
        <Stack spacing={2} sx={{ maxWidth: 720 }}>
          <TextField label="Meta title" value={form.metaTitle ?? ""} onChange={(e) => set("metaTitle", e.target.value)} />
          <TextField label="Meta description" multiline minRows={3} value={form.metaDescription ?? ""} onChange={(e) => set("metaDescription", e.target.value)} />
          <TextField label="Meta image" value={form.metaImage ?? ""} onChange={(e) => set("metaImage", e.target.value)} />
          <TextField label="Theme colour" value={form.themeColor ?? ""} onChange={(e) => set("themeColor", e.target.value)} />
          <TextField label="Accent colour" value={form.accentColor ?? ""} onChange={(e) => set("accentColor", e.target.value)} />
          <TextField label="CTA label" value={form.ctaLabel ?? ""} onChange={(e) => set("ctaLabel", e.target.value)} />
          <TextField label="CTA href" value={form.ctaHref ?? ""} onChange={(e) => set("ctaHref", e.target.value)} />
          <TextField label="Footer text" value={form.footerText ?? ""} onChange={(e) => set("footerText", e.target.value)} />
          <TextField label="Contact email" value={form.contactEmail ?? ""} onChange={(e) => set("contactEmail", e.target.value)} />
          <Button variant="contained" onClick={() => save.mutate()} disabled={save.isPending} sx={{ alignSelf: "flex-start" }}>Save</Button>
        </Stack>
      </CardContent>
      <Snackbar open={!!snack} autoHideDuration={2500} onClose={() => setSnack(null)}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </Card>
  );
}
