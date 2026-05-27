import { useState } from "react";
import {
  Box, Card, CardContent, Stack, Button, TextField, Switch, FormControlLabel, Typography, Chip, IconButton, Tooltip, Snackbar, Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NewsPostDTO } from "@mahama/shared-types";
import { localize } from "@mahama/shared-types";
import { api } from "../config.js";
import { LocalizedField } from "../components/LocalizedField.js";

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function NewsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Partial<NewsPostDTO> | null>(null);
  const [snack, setSnack] = useState<{ msg: string; ok: boolean } | null>(null);

  const list = useQuery({
    queryKey: ["news", page, pageSize, search],
    queryFn: () => api.admin.news.list({ page: page + 1, pageSize, search: search || undefined }),
  });

  const save = useMutation({
    mutationFn: () => editing?.id ? api.admin.news.update(editing.id, editing) : api.admin.news.create(editing ?? {}),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["news"] }); setSnack({ msg: "Saved", ok: true }); setEditing(null); },
    onError: (e: Error) => setSnack({ msg: e.message, ok: false }),
  });
  const remove = useMutation({
    mutationFn: (id: string) => api.admin.news.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["news"] }),
  });

  const resolveTitle = (p: Partial<NewsPostDTO>): string => {
    if (!p.title) return "(untitled)";
    if (typeof p.title === "string") return p.title;
    return p.title.en || "(untitled)";
  };

  if (editing) {
    const set = <K extends keyof NewsPostDTO>(k: K, v: NewsPostDTO[K]) => setEditing((x) => ({ ...x, [k]: v }));
    return (
      <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => setEditing(null)}>Back to list</Button>
            <Box sx={{ flex: 1 }} />
            <FormControlLabel
              control={<Switch checked={!!editing.published} onChange={(_, v) => set("published", v)} />}
              label={editing.published ? "Published" : "Draft"} />
            <Button variant="contained" sx={{ ml: 2 }} onClick={() => save.mutate()} disabled={save.isPending || !resolveTitle(editing) || !editing.slug}>
              {editing.id ? "Save changes" : "Create post"}
            </Button>
          </Stack>
          <Stack spacing={2}>
            <LocalizedField
              label="Title"
              value={editing.title}
              onChange={(v) => {
                const t = v.en ?? "";
                setEditing((s) => ({ ...s, title: v, slug: s?.slug || slugify(t) }));
              }}
              required
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label="Slug" value={editing.slug ?? ""} onChange={(e) => set("slug", slugify(e.target.value))} fullWidth />
              <TextField label="Author" value={editing.author ?? "Office"} onChange={(e) => set("author", e.target.value)} fullWidth />
              <TextField type="datetime-local" label="Publish date" InputLabelProps={{ shrink: true }} value={editing.publishedAt?.slice(0, 16) ?? ""} onChange={(e) => set("publishedAt", e.target.value ? new Date(e.target.value).toISOString() : "")} fullWidth />
            </Stack>
            <LocalizedField
              label="Excerpt (used in listings + meta)"
              value={editing.excerpt}
              onChange={(v) => set("excerpt", v)}
              multiline
              minRows={2} />
            <TextField label="Cover image URL" value={editing.coverImageUrl ?? ""} onChange={(e) => set("coverImageUrl", e.target.value)} fullWidth />
            <TextField
              label="Tags (comma separated)"
              value={(editing.tags ?? []).join(", ")}
              onChange={(e) => set("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              fullWidth
            />
            <LocalizedField
              label="Body"
              value={editing.body}
              onChange={(v) => set("body", v)}
              richText
            />
          </Stack>
        </CardContent>
        <Snackbar open={!!snack} autoHideDuration={2500} onClose={() => setSnack(null)}>
          <Alert severity={snack?.ok ? "success" : "error"}>{snack?.msg}</Alert>
        </Snackbar>
      </Card>
    );
  }

  return (
    <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
      <CardContent>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField size="small" placeholder="Search posts…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
          <Box sx={{ flex: 1 }} />
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => setEditing({ title: localize(""), slug: "", excerpt: localize(""), body: localize(""), author: "Office", tags: [], published: false })}>
            New post
          </Button>
        </Stack>
        <DataGrid
          autoHeight
          rows={list.data?.items ?? []}
          rowCount={list.data?.total ?? 0}
          loading={list.isLoading}
          paginationMode="server"
          paginationModel={{ page, pageSize }}
          pageSizeOptions={[10, 20, 50]}
          onPaginationModelChange={(m) => { setPage(m.page); setPageSize(m.pageSize); }}
          getRowId={(r) => r.id}
          onRowDoubleClick={(p) => setEditing(p.row as NewsPostDTO)}
          columns={[
            { field: "title", headerName: "Title", flex: 1.4, valueGetter: (v: unknown) => typeof v === "string" ? v : (v as { en?: string })?.en ?? "" },
            { field: "slug", headerName: "Slug", flex: 1 },
            { field: "published", headerName: "Status", width: 110, renderCell: (p) => <Chip size="small" label={p.value ? "Published" : "Draft"} color={p.value ? "success" : "default"} /> },
            { field: "publishedAt", headerName: "Date", width: 150, valueFormatter: (v) => v ? new Date(v as string).toLocaleDateString() : "—" },
            {
              field: "actions",
              headerName: "",
              width: 110,
              sortable: false,
              renderCell: (p) => (
                <Stack direction="row">
                  <Tooltip title="Edit"><IconButton size="small" onClick={() => setEditing(p.row as NewsPostDTO)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Delete"><IconButton size="small" onClick={() => { if (confirm("Delete?")) remove.mutate(p.row.id as string); }}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                </Stack>
              ),
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
