import { useState } from "react";
import { Box, Button, TextField, Stack, Snackbar, Alert } from "@mui/material";

export interface NewsletterSignupProps {
  onSubscribe: (email: string) => Promise<void>;
  buttonLabel?: string;
  placeholder?: string;
}

export function NewsletterSignup({ onSubscribe, buttonLabel = "Subscribe", placeholder = "Email address" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [snack, setSnack] = useState<{ msg: string; ok: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await onSubscribe(email);
      setEmail("");
      setSnack({ msg: "Subscribed successfully.", ok: true });
    } catch (err) {
      setSnack({ msg: err instanceof Error ? err.message : "Failed to subscribe.", ok: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} >
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <TextField
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          size="small"
          sx={{ flex: 1 }}
        />
        <Button type="submit" variant="contained" size="small" disabled={loading} >
          {loading ? "…" : buttonLabel}
        </Button>
      </Stack>
      <Snackbar open={!!snack} autoHideDuration={4000} onClose={() => setSnack(null)} >
        <Alert severity={snack?.ok ? "success" : "error"} onClose={() => setSnack(null)} >
          {snack?.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
