import { useEffect, useState } from "react";
import { Box, Card, CardContent, Stack, TextField, Button, Alert, Snackbar, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProfileDTO } from "@mahama/shared-types";
import { api } from "../config.js";
import { QueryError } from "@mahama/website-core";

export function ProfilePage() {
  const qc = useQueryClient();
  const profile = useQuery({ queryKey: ["admin-profile"], queryFn: () => api.admin.profile.get() });
  const [form, setForm] = useState<Partial<ProfileDTO>>({});
  const [snack, setSnack] = useState<string | null>(null);

  useEffect(() => { if (profile.data) setForm(profile.data); }, [profile.data]);

  const save = useMutation({
    mutationFn: () => api.admin.profile.update(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-profile"] }); setSnack("Profile updated"); },
  });

  const set = <K extends keyof ProfileDTO>(k: K, v: ProfileDTO[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
      <CardContent>
        <Stack spacing={2} sx={{ maxWidth: 760 }}>
          {profile.isError && <QueryError message="Unable to load profile." onRetry={() => profile.refetch()} />}
          <Typography variant="h5">Profile</Typography>
          <TextField label="Full name" value={form.fullName ?? ""} onChange={(e) => set("fullName", e.target.value)} fullWidth />
          <TextField label="Title" value={form.title ?? ""} onChange={(e) => set("title", e.target.value)} fullWidth />
          <TextField label="Tagline" value={form.tagline ?? ""} onChange={(e) => set("tagline", e.target.value)} fullWidth />
          <TextField label="Bio" value={form.bio ?? ""} onChange={(e) => set("bio", e.target.value)} multiline minRows={6} fullWidth />
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField label="Birth date" value={form.birthDate ?? ""} onChange={(e) => set("birthDate", e.target.value)} />
            <TextField label="Birthplace" value={form.birthPlace ?? ""} onChange={(e) => set("birthPlace", e.target.value)} />
            <TextField label="Hometown" value={form.hometown ?? ""} onChange={(e) => set("hometown", e.target.value)} />
            <TextField label="Religion" value={form.religion ?? ""} onChange={(e) => set("religion", e.target.value)} />
            <TextField label="Spouse" value={form.spouse ?? ""} onChange={(e) => set("spouse", e.target.value)} />
            <TextField label="Children" value={form.children ?? ""} onChange={(e) => set("children", e.target.value)} />
          </Box>
          <TextField label="Hero image URL" value={form.heroImageUrl ?? ""} onChange={(e) => set("heroImageUrl", e.target.value)} fullWidth />
          <TextField label="Portrait URL" value={form.portraitUrl ?? ""} onChange={(e) => set("portraitUrl", e.target.value)} fullWidth />
          <Button variant="contained" onClick={() => save.mutate()} disabled={save.isPending} sx={{ alignSelf: "flex-start" }}>
            Save changes
          </Button>
        </Stack>
      </CardContent>
      <Snackbar open={!!snack} autoHideDuration={2500} onClose={() => setSnack(null)}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </Card>
  );
}
