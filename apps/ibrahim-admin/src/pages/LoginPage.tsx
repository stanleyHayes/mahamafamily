import { useState } from "react";
import { Box, Card, CardContent, Typography, TextField, Button, Stack, Alert, useTheme } from "@mui/material";
import { useAuth } from "../auth/AuthContext.js";
import { SUBJECT } from "../config.js";

export function LoginPage() {
  const { login } = useAuth();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      location.href = "/";
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const subjectName = `${SUBJECT[0]?.toUpperCase()}${SUBJECT.slice(1)}`;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        position: "relative",
        overflow: "hidden",
        px: 2,
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle at 20% 30%, ${theme.palette.secondary.main}22 0%, transparent 50%),
                            radial-gradient(circle at 80% 70%, ${theme.palette.secondary.main}15 0%, transparent 50%)`,
          zIndex: 0,
        },
      }}
    >
      {/* Subtle dot pattern */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          zIndex: 0,
        }}
      />
      <Card
        sx={{
          width: "100%",
          maxWidth: 440,
          p: 1,
          position: "relative",
          zIndex: 1,
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: `0 24px 80px rgba(0,0,0,0.35)`,
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                boxShadow: `0 8px 24px ${theme.palette.secondary.main}44`,
              }}
            >
              <Typography sx={{ fontSize: 24, fontWeight: 700, color: "#000" }}>
                {subjectName[0]}
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              {subjectName} Admin
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: "0.95rem" }}>
              Sign in to manage your portfolio.
            </Typography>
          </Box>
          <form onSubmit={submit}>
            <Stack spacing={2.5}>
              {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
              <TextField
                label="Email"
                type="email"
                required
                fullWidth
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
              />
              <TextField
                label="Password"
                type="password"
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 1,
                  py: 1.2,
                  borderRadius: 999,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                }}
              >
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
