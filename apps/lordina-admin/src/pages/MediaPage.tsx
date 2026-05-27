import { useRef, useState } from "react";
import {
  Box, Card, CardContent, Stack, Button, Grid, IconButton, Tooltip, Snackbar, Alert, Typography, TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/CloudUpload";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../config.js";

export function MediaPage() {
  const qc = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [snack, setSnack] = useState<{ msg: string; ok: boolean } | null>(null);

  const list = useQuery({
    queryKey: ["media", page, search],
    queryFn: () => api.admin.media.list({ page: page + 1, pageSize: 24, search: search || undefined }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.admin.media.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["media"] }),
  });

  const upload = async (file: File) => {
    try {
      const sig = await api.admin.media.sign();
      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", sig.apiKey);
      fd.append("timestamp", String(sig.timestamp));
      fd.append("signature", sig.signature);
      fd.append("folder", sig.folder);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Cloudinary upload failed");
      const json = await res.json() as { public_id: string; secure_url: string; url: string; format: string; resource_type: "image" | "video" | "raw"; bytes: number; width?: number; height?: number };
      await api.admin.media.record({
        publicId: json.public_id,
        url: json.url,
        secureUrl: json.secure_url,
        format: json.format,
        resourceType: json.resource_type,
        bytes: json.bytes,
        width: json.width,
        height: json.height,
        alt: file.name,
        tags: [],
      });
      qc.invalidateQueries({ queryKey: ["media"] });
      setSnack({ msg: `Uploaded ${file.name}`, ok: true });
    } catch (e) {
      setSnack({ msg: (e as Error).message, ok: false });
    }
  };

  return (
    <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
      <CardContent>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <TextField size="small" placeholder="Search media…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
          <Box sx={{ flex: 1 }} />
          <Button startIcon={<UploadIcon />} variant="contained" onClick={() => fileInput.current?.click()}>
            Upload
          </Button>
          <input
            ref={fileInput}
            type="file"
            hidden
            accept="image/*,video/*"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.currentTarget.value = ""; }}
          />
        </Stack>
        <Grid container spacing={2}>
          {(list.data?.items ?? []).map((m) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={m.id}>
              <Box sx={{ position: "relative", borderRadius: 2, overflow: "hidden", aspectRatio: "1 / 1", background: "#eee" }}>
                {m.resourceType === "image"
                  ? <Box component="img"
  src={m.secureUrl}
  alt={m.alt ?? ""}
  sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <Box sx={{ p: 2, fontSize: 12 }}>{m.publicId}</Box>}
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={() => { if (confirm("Delete media?")) remove.mutate(m.id); }}
                    sx={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.5)", color: "#fff", "&:hover": { background: "rgba(0,0,0,0.8)" } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography sx={{ fontSize: 11, mt: 1, color: "text.secondary" }} noWrap>{m.alt || m.publicId}</Typography>
            </Grid>
          ))}
        </Grid>
        {list.data && list.data.total > 24 && (
          <Stack direction="row" justifyContent="center" sx={{ mt: 3 }} spacing={1}>
            <Button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Prev</Button>
            <Button disabled={(page + 1) * 24 >= (list.data?.total ?? 0)} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </Stack>
        )}
      </CardContent>
      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack(null)}>
        <Alert severity={snack?.ok ? "success" : "error"}>{snack?.msg}</Alert>
      </Snackbar>
    </Card>
  );
}
