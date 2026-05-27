import { useState } from "react";
import {
  Box, Card, CardContent, Stack, Button, Dialog, DialogContent, DialogActions, DialogTitle, TextField, IconButton, Tooltip, Snackbar, Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../config.js";
import { QueryError } from "@mahama/website-core";

export function UsersPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [snack, setSnack] = useState<{ msg: string; ok: boolean } | null>(null);
  const [form, setForm] = useState({ email: "", name: "", password: "", role: "editor" as "owner" | "editor" | "viewer" });

  const list = useQuery({ queryKey: ["users"], queryFn: () => api.admin.users.list() });
  const create = useMutation({
    mutationFn: () => fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("mahama_admin_token")}` },
      body: JSON.stringify(form),
    }).then(async (r) => {
      const j = await r.json();
      if (!j.ok) throw new Error(j.error?.message ?? "Failed");
      return j.data;
    }),
    onSuccess: () => {
      setOpen(false); setForm({ email: "", name: "", password: "", role: "editor" });
      qc.invalidateQueries({ queryKey: ["users"] });
      setSnack({ msg: "User created", ok: true });
    },
    onError: (e: Error) => setSnack({ msg: e.message, ok: false }),
  });
  const remove = useMutation({
    mutationFn: (id: string) => api.admin.users.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });

  return (
    <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
      <CardContent>
        {list.isError && <QueryError message="Unable to load users." onRetry={() => list.refetch()} />}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Box sx={{ flex: 1 }} />
          <Button variant="contained" onClick={() => setOpen(true)}>New user</Button>
        </Stack>
        <DataGrid
          autoHeight
          rows={(list.data as unknown as { items: { id: string; email: string; name: string; role: string }[] })?.items ?? []}
          loading={list.isLoading}
          getRowId={(r) => r.id}
          columns={[
            { field: "email", headerName: "Email", flex: 1 },
            { field: "name", headerName: "Name", width: 200 },
            { field: "role", headerName: "Role", width: 120 },
            { field: "lastLoginAt", headerName: "Last login", width: 180 },
            {
              field: "actions",
              headerName: "",
              width: 80,
              sortable: false,
              renderCell: (p) => (
                <Tooltip title="Delete">
                  <IconButton size="small" onClick={() => { if (confirm("Delete?")) remove.mutate(p.row.id as string); }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ),
            },
          ]}
        />
      </CardContent>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New admin user</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            <TextField label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <TextField label="Password" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
            <TextField select SelectProps={{ native: true }} label="Role" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as typeof f.role }))}>
              <option value="owner">owner</option>
              <option value="editor">editor</option>
              <option value="viewer">viewer</option>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" disabled={create.isPending || !form.email || !form.password} onClick={() => create.mutate()}>Create</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack(null)}>
        <Alert severity={snack?.ok ? "success" : "error"}>{snack?.msg}</Alert>
      </Snackbar>
    </Card>
  );
}
