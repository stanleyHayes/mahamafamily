import { Grid, Card, CardContent, Typography, Stack, Box } from "@mui/material";
import { QueryError } from "@mahama/website-core";
import { useQuery } from "@tanstack/react-query";
import { api } from "../config.js";

interface Stat {
  label: string;
  value: number;
  hint?: string;
}

function StatCard({ label, value, hint }: Stat) {
  return (
    <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", height: "100%" }}>
      <CardContent>
        <Typography sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 11 }}>
          {label}
        </Typography>
        <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: 44, lineHeight: 1.1, mt: 1 }}>
          {value}
        </Typography>
        {hint && <Typography color="text.secondary" sx={{ fontSize: 12, mt: 1 }}>{hint}</Typography>}
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const messages = useQuery({ queryKey: ["m", "messages"], queryFn: () => api.admin.messages.list({ pageSize: 1 }) });
  const subs = useQuery({ queryKey: ["m", "subs"], queryFn: () => api.admin.subscribers.list({ pageSize: 1 }) });
  const news = useQuery({ queryKey: ["m", "news"], queryFn: () => api.admin.news.list({ pageSize: 1 }) });
  const ventures = useQuery({ queryKey: ["m", "ventures"], queryFn: () => api.admin.ventures.list({ pageSize: 1 }) });
  const events = useQuery({ queryKey: ["m", "events"], queryFn: () => api.admin.events.list({ pageSize: 1 }) });
  const recentMessages = useQuery({ queryKey: ["m", "recent-msg"], queryFn: () => api.admin.messages.list({ pageSize: 5, sortBy: "createdAt", sortDir: "desc" }) });

  return (
    <Stack spacing={4}>
      {(messages.isError || subs.isError || news.isError || ventures.isError || events.isError || recentMessages.isError) && (
        <QueryError message="Unable to load dashboard data." onRetry={() => { messages.refetch(); subs.refetch(); news.refetch(); ventures.refetch(); events.refetch(); recentMessages.refetch(); }} />
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}><StatCard label="Inbox" value={messages.data?.total ?? 0} hint="Total messages" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard label="Subscribers" value={subs.data?.total ?? 0} hint="Newsletter list" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard label="News posts" value={news.data?.total ?? 0} /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard label="Ventures" value={ventures.data?.total ?? 0} /></Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Recent messages</Typography>
              <Stack divider={<Box sx={{ borderTop: "1px solid", borderColor: "divider" }} />} spacing={1.5}>
                {recentMessages.data?.items.length === 0 && <Typography color="text.secondary">No messages yet.</Typography>}
                {recentMessages.data?.items.map((m) => (
                  <Box key={m.id} sx={{ pt: 1.5 }}>
                    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                      {new Date(m.createdAt).toLocaleString()} · {m.category}
                    </Typography>
                    <Typography variant="subtitle1">{m.subject}</Typography>
                    <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                      {m.name} &lt;{m.email}&gt;
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Upcoming events</Typography>
              <Typography color="text.secondary">{events.data?.total ?? 0} total events</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
