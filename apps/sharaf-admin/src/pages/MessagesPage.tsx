import { useState } from "react";
import {
  Box, Card, CardContent, Stack, TextField, Typography, Chip, Button, Dialog, DialogContent, DialogTitle, DialogActions, Alert, Snackbar,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MessageDTO } from "@mahama/shared-types";
import { api } from "../config.js";

export function MessagesPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<MessageDTO | null>(null);
  const [reply, setReply] = useState("");
  const [snack, setSnack] = useState<string | null>(null);

  const list = useQuery({
    queryKey: ["messages", page, pageSize, search],
    queryFn: () => api.admin.messages.list({ page: page + 1, pageSize, search: search || undefined }),
  });

  const replyM = useMutation({
    mutationFn: (vars: { id: string; body: string }) => api.admin.messages.reply(vars.id, vars.body),
    onSuccess: () => {
      setOpen(null); setReply("");
      qc.invalidateQueries({ queryKey: ["messages"] });
      setSnack("Reply sent");
    },
  });

  const archive = useMutation({
    mutationFn: (id: string) => api.admin.messages.update(id, { status: "archived" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages"] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.admin.messages.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages"] }),
  });

  return (
    <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
      <CardContent>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField size="small" placeholder="Search inbox…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
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
          onRowClick={(p) => setOpen(p.row as MessageDTO)}
          columns={[
            { field: "createdAt", headerName: "When", width: 160, valueFormatter: (v) => new Date(v as string).toLocaleString() },
            { field: "name", headerName: "From", width: 160 },
            { field: "subject", headerName: "Subject", flex: 1 },
            { field: "category", headerName: "Category", width: 130 },
            { field: "status", headerName: "Status", width: 110, renderCell: (p) => <Chip size="small" label={p.value as string} /> },
          ]}
        />
      </CardContent>
      <Dialog open={!!open} onClose={() => setOpen(null)} maxWidth="md" fullWidth>
        {open && (
          <>
            <DialogTitle>{open.subject}</DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2}>
                <Box>
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                    {new Date(open.createdAt).toLocaleString()} · {open.category}
                  </Typography>
                  <Typography>{open.name} &lt;{open.email}&gt; {open.phone ? `· ${open.phone}` : ""}</Typography>
                </Box>
                <Box sx={{ p: 2, background: "background.default", borderRadius: 2, whiteSpace: "pre-wrap" }}>
                  {open.body}
                </Box>
                <TextField multiline minRows={5} placeholder="Reply…" value={reply} onChange={(e) => setReply(e.target.value)} />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button color="error" onClick={() => { if (confirm("Delete?")) remove.mutate(open.id); setOpen(null); }}>Delete</Button>
              <Button onClick={() => archive.mutate(open.id)}>Archive</Button>
              <Button variant="contained" disabled={!reply || replyM.isPending} onClick={() => replyM.mutate({ id: open.id, body: reply })}>
                Send reply
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <Snackbar open={!!snack} autoHideDuration={2500} onClose={() => setSnack(null)}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </Card>
  );
}
