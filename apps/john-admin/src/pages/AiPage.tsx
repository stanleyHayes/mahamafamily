import { useState } from "react";
import { Card, CardContent, Stack, Tabs, Tab, TextField, Button, Box, Typography, Chip, Alert } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { api } from "../config.js";

export function AiPage() {
  const [tab, setTab] = useState(0);
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("dignified");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const run = useMutation({
    mutationFn: async () => {
      setError(null);
      if (tab === 0) return (await api.admin.ai.draftBio(input)).text;
      if (tab === 1) return (await api.admin.ai.polish(input, tone)).text;
      return (await api.admin.ai.summarize(input)).text;
    },
    onSuccess: setOutput,
    onError: (e: Error) => setError(e.message),
  });

  return (
    <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
      <CardContent>
        <Typography variant="h5">AI helper</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>OpenAI-powered drafting tools, scoped to this subject's content.</Typography>
        <Tabs value={tab} onChange={(_, v) => { setTab(v); setOutput(""); }}>
          <Tab label="Draft a bio" />
          <Tab label="Polish text" />
          <Tab label="Summarize" />
        </Tabs>
        <Stack spacing={2} sx={{ mt: 3 }}>
          {tab === 1 && <TextField label="Tone" value={tone} onChange={(e) => setTone(e.target.value)} sx={{ maxWidth: 320 }} />}
          <TextField multiline minRows={8} value={input} onChange={(e) => setInput(e.target.value)} placeholder={tab === 0 ? "Notes about the subject…" : tab === 1 ? "Text to polish…" : "Long text to summarize…"} />
          {error && <Alert severity="error">{error}</Alert>}
          <Button variant="contained" disabled={!input || run.isPending} onClick={() => run.mutate()}>
            {run.isPending ? "Working…" : "Run"}
          </Button>
          {output && (
            <Box sx={{ p: 2, background: "background.default", borderRadius: 2 }}>
              <Chip size="small" label="Result" sx={{ mb: 1 }} />
              <Typography sx={{ whiteSpace: "pre-wrap" }}>{output}</Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
