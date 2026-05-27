import { useState } from "react";
import {
  Box, Card, CardContent, Stack, TextField, Button, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CampaignIcon from "@mui/icons-material/Campaign";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../config.js";
import { QueryError } from "@mahama/website-core";

export function SubscribersPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [snack, setSnack] = useState<string | null>(null);

  const list = useQuery({
    queryKey: ["subs", page, pageSize],
    queryFn: () => api.admin.subscribers.list({ page: page + 1, pageSize }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.admin.subscribers.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subs"] }),
  });

  const broadcast = useMutation({
    mutationFn: () => api.admin.subscribers.broadcast({ subject, html }),
    onSuccess: (r) => { setSnack(`Sent to ${r.sent} subscribers`); setOpen(false); setSubject(""); setHtml(""); },
  });

  return (
    <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
      <CardContent>
        {list.isError && <QueryError message="Unable to load subscribers." onRetry={() => list.refetch()} />}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Box sx={{ flex: 1 }} />
          <Button variant="contained" startIcon={<CampaignIcon />} onClick={() => setOpen(true)}>Broadcast</Button>
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
          columns={[
            { field: "email", headerName: "Email", flex: 1 },
            { field: "name", headerName: "Name", width: 180 },
            { field: "source", headerName: "Source", width: 140 },
            { field: "createdAt", headerName: "Joined", width: 160, valueFormatter: (v) => new Date(v as string).toLocaleDateString() },
            {
              field: "actions",
              headerName: "",
              width: 80,
              sortable: false,
              renderCell: (p) => (
                <Tooltip title="Remove"><IconButton size="small" onClick={() => { if (confirm("Remove subscriber?")) remove.mutate(p.row.id as string); }} aria-label="Remove subscriber"><DeleteIcon fontSize="small" /></IconButton></Tooltip>
              ),
            },
          ]}
        />
      </CardContent>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Broadcast email</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <TextField label="HTML body" multiline minRows={10} value={html} onChange={(e) => setHtml(e.target.value)} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" disabled={!subject || !html || broadcast.isPending} onClick={() => broadcast.mutate()}>
            Send to all
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack(null)}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </Card>
  );
}
