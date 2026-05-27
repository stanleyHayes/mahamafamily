import { useState } from "react";
import {
  Box, Card, CardContent, Stack, Typography, Chip, Button, ToggleButtonGroup, ToggleButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BookingDTO } from "@mahama/shared-types";
import { api } from "../config.js";
import { QueryError } from "@mahama/website-core";

const STATUS_COLORS: Record<string, "default" | "primary" | "success" | "error" | "warning"> = {
  pending: "warning",
  confirmed: "primary",
  completed: "success",
  cancelled: "error",
  "no-show": "default",
};

export function BookingsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [status, setStatus] = useState<string>("all");
  const [open, setOpen] = useState<BookingDTO | null>(null);
  const [reason, setReason] = useState("");
  const [snack, setSnack] = useState<{ msg: string; ok: boolean } | null>(null);

  const list = useQuery({
    queryKey: ["bookings", page, pageSize, status],
    queryFn: () => api.admin.bookings.list({ page: page + 1, pageSize, status: status === "all" ? undefined : status }),
  });

  const cancel = useMutation({
    mutationFn: (vars: { id: string; reason?: string }) => api.admin.bookings.cancel(vars.id, vars.reason),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["bookings"] }); setOpen(null); setReason(""); setSnack({ msg: "Cancelled — invitee notified", ok: true }); },
    onError: (e: Error) => setSnack({ msg: e.message, ok: false }),
  });
  const complete = useMutation({
    mutationFn: (id: string) => api.admin.bookings.complete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["bookings"] }); setOpen(null); },
  });

  return (
    <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
      <CardContent>
        {list.isError && <QueryError message="Unable to load bookings." onRetry={() => list.refetch()} />}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <ToggleButtonGroup exclusive size="small" value={status} onChange={(_, v) => v && setStatus(v)}>
            {["all", "confirmed", "pending", "completed", "cancelled"].map((s) => <ToggleButton key={s} value={s}>{s}</ToggleButton>)}
          </ToggleButtonGroup>
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
          onRowClick={(p) => setOpen(p.row as BookingDTO)}
          columns={[
            { field: "startsAt", headerName: "When", width: 170, valueFormatter: (v) => new Date(v as string).toLocaleString() },
            { field: "meetingTypeName", headerName: "Meeting", flex: 1 },
            { field: "inviteeName", headerName: "With", width: 200 },
            { field: "inviteeEmail", headerName: "Email", flex: 1 },
            { field: "durationMinutes", headerName: "Min", width: 80 },
            { field: "status", headerName: "Status", width: 130, renderCell: (p) => <Chip size="small" color={STATUS_COLORS[p.value as string] ?? "default"} label={p.value as string} /> },
          ]}
        />
      </CardContent>
      <Dialog open={!!open} onClose={() => setOpen(null)} maxWidth="sm" fullWidth>
        {open && (
          <>
            <DialogTitle>{open.meetingTypeName} — {new Date(open.startsAt).toLocaleString()}</DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="overline" color="text.secondary">Invitee</Typography>
                  <Typography>{open.inviteeName} &lt;{open.inviteeEmail}&gt;</Typography>
                  {open.inviteePhone && <Typography color="text.secondary">{open.inviteePhone}</Typography>}
                  {open.inviteeOrg && <Typography color="text.secondary">{open.inviteeOrg}</Typography>}
                </Box>
                <Box>
                  <Typography variant="overline" color="text.secondary">Where</Typography>
                  <Typography>{open.meetingLocation}</Typography>
                </Box>
                {open.notes && (
                  <Box>
                    <Typography variant="overline" color="text.secondary">Notes</Typography>
                    <Typography sx={{ whiteSpace: "pre-wrap" }}>{open.notes}</Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="overline" color="text.secondary">Reminders</Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip size="small" label={`Day before: ${open.reminderState.dayBefore ? "sent" : "pending"}`} variant="outlined" />
                    <Chip size="small" label={`Hour before: ${open.reminderState.hourBefore ? "sent" : "pending"}`} variant="outlined" />
                  </Stack>
                </Box>
                {open.status === "confirmed" && (
                  <TextField label="Cancellation reason (optional, sent to invitee)" multiline minRows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
                )}
              </Stack>
            </DialogContent>
            <DialogActions>
              {open.status === "confirmed" && (
                <>
                  <Button color="error" onClick={() => cancel.mutate({ id: open.id, reason })} disabled={cancel.isPending}>Cancel meeting</Button>
                  <Button onClick={() => complete.mutate(open.id)} disabled={complete.isPending}>Mark complete</Button>
                </>
              )}
              <Button onClick={() => setOpen(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack(null)}>
        <Alert severity={snack?.ok ? "success" : "error"}>{snack?.msg}</Alert>
      </Snackbar>
    </Card>
  );
}
