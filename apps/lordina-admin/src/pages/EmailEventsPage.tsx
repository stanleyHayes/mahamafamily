import { Card, CardContent, Stack, Typography, Chip, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { tokenStore } from "../config.js";
import { QueryError } from "@mahama/website-core";

interface EmailEvent {
  type: string;
  to: string;
  emailId?: string;
  subject?: string;
  receivedAt: string;
}

const COLOR: Record<string, "success" | "info" | "warning" | "error" | "default"> = {
  "email.delivered": "success",
  "email.opened": "info",
  "email.clicked": "info",
  "email.bounced": "error",
  "email.complained": "error",
  "email.delivery_delayed": "warning",
  "email.sent": "default",
};

export function EmailEventsPage() {
  const data = useQuery({
    queryKey: ["email-events"],
    queryFn: async () => {
      const r = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/email-events`, {
        headers: { Authorization: `Bearer ${tokenStore.get()}` },
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error?.message);
      return j.data as { list: EmailEvent[]; counts: Record<string, number> };
    },
  });

  return (
    <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
      <CardContent>
        <Typography variant="h5">Email events</Typography>
        {data.isError && <QueryError message="Unable to load email events." onRetry={() => data.refetch()} />}
        <Typography color="text.secondary" sx={{ mb: 3, fontSize: 13 }}>
          Live events from Resend — delivery, opens, clicks, bounces, complaints. Bounced or complained recipients are auto-unsubscribed from the newsletter.
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}>
          {Object.entries(data.data?.counts ?? {}).map(([t, n]) => (
            <Chip
              key={t}
              label={`${t.replace("email.", "")} · ${n}`}
              color={COLOR[t] ?? "default"}
              variant={COLOR[t] === "default" ? "outlined" : "filled"} />
          ))}
          {!Object.keys(data.data?.counts ?? {}).length && (
            <Box sx={{ color: "text.secondary", fontSize: 13 }}>
              No events yet. Configure the Resend webhook to <code>/api/webhooks/resend</code> and set <code>RESEND_WEBHOOK_SECRET</code>.
            </Box>
          )}
        </Stack>
        <DataGrid
          autoHeight
          rows={(data.data?.list ?? []).map((r, i) => ({ id: i, ...r }))}
          loading={data.isLoading}
          getRowId={(r) => r.id}
          columns={[
            { field: "receivedAt", headerName: "When", width: 200, valueFormatter: (v) => new Date(v as string).toLocaleString() },
            { field: "type", headerName: "Event", width: 200, renderCell: (p) => <Chip size="small" color={COLOR[p.value as string] ?? "default"} label={String(p.value).replace("email.", "")} /> },
            { field: "to", headerName: "Recipient", flex: 1 },
            { field: "subject", headerName: "Subject", flex: 1.4 },
          ]}
        />
      </CardContent>
    </Card>
  );
}
