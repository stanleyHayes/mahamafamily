import { Card, CardContent, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { tokenStore } from "../config.js";
import { QueryError } from "@mahama/website-core";

export function AuditLogPage() {
  const list = useQuery({
    queryKey: ["audit-log"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/audit-log`, {
        headers: { Authorization: `Bearer ${tokenStore.get()}` },
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message);
      return (json.data as unknown as Array<{ actorEmail?: string; action: string; resource: string; resourceId?: string; ts: string}>);
    },
  });

  return (
    <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>Audit log</Typography>
        {list.isError && <QueryError message="Unable to load audit log." onRetry={() => list.refetch()} />}
        <Typography color="text.secondary" sx={{ mb: 3, fontSize: 13 }}>
          Last 100 admin mutations. Read-only. Useful for accountability and reverting unintended changes.
        </Typography>
        <DataGrid
          autoHeight
          rows={(list.data ?? []).map((r, i) => ({ id: i, ...r }))}
          loading={list.isLoading}
          columns={[
            { field: "ts", headerName: "When", width: 200, valueFormatter: (v) => new Date(v as string).toLocaleString() },
            { field: "actorEmail", headerName: "Actor", flex: 1 },
            { field: "action", headerName: "Action", width: 100 },
            { field: "resource", headerName: "Resource", width: 160 },
            { field: "resourceId", headerName: "ID", flex: 1 },
          ]}
          disableRowSelectionOnClick
        />
      </CardContent>
    </Card>
  );
}
