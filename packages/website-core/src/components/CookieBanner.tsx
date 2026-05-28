import { useEffect, useRef, useState } from "react";
import { Box, Button, Stack, Typography, Container, Link as MuiLink } from "@mui/material";

const KEY = "mahama_cookie_consent";

type Choice = "accepted" | "rejected" | null;

export function CookieBanner() {
  const [choice, setChoice] = useState<Choice>(null);
  const acceptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const saved = (localStorage.getItem(KEY) as Choice) ?? null;
    setChoice(saved);
  }, []);

  useEffect(() => {
    if (choice === null) {
      acceptRef.current?.focus();
    }
  }, [choice]);

  if (choice !== null) return null;

  const set = (c: Exclude<Choice, null>) => {
    localStorage.setItem(KEY, c);
    setChoice(c);
    window.dispatchEvent(new Event("mahama:consent-change"));
  };

  return (
    <Box
      role="dialog"
      aria-label="Cookie preferences"
      aria-live="polite"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: (t) => t.zIndex.modal,
        background: (t) => t.palette.background.paper,
        color: (t) => t.palette.text.primary,
        borderTop: "1px solid",
        borderColor: "divider",
        py: 2.5,
      }}
    >
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }} spacing={2} >
          <Typography sx={{ flex: 1, fontSize: 14, opacity: 0.85 }}>
            This site uses essential cookies to keep you signed in for booking and to store your preferences. Optional analytics cookies help the office understand how visitors use the site. <MuiLink href="/about" sx={{ color: "secondary.main" }}>Read more</MuiLink>.
          </Typography>
          <Stack direction="row" spacing={1.5} >
            <Button onClick={() => set("rejected")} variant="text" sx={{ color: "text.secondary" }}>
              Essential only
            </Button>
            <Button ref={acceptRef} onClick={() => set("accepted")} variant="contained" color="secondary" sx={{ borderRadius: 0, px: 3 }}>
              Accept all
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
