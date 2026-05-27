import { Component, type ErrorInfo, type ReactNode } from "react";
import { Box, Typography, Button, Container } from "@mui/material";

interface State { error: Error | null }

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[boundary]", error, info.componentStack);
  }

  override render() {
    if (!this.state.error) return this.props.children;
    return (
      <Container maxWidth="sm" sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <Box sx={{ textAlign: "center", width: "100%", py: 12 }}>
          <Typography sx={{ color: "secondary.main", letterSpacing: "0.32em", textTransform: "uppercase", fontSize: 12, mb: 2 }}>
            Something went wrong
          </Typography>
          <Typography variant="h3" sx={{ fontFamily: '"Playfair Display", serif' }}>
            We hit a snag.
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 2, fontFamily: "monospace", fontSize: 13 }}>
            {this.state.error.message}
          </Typography>
          <Button onClick={() => location.assign("/")} variant="contained" color="secondary" sx={{ mt: 4, borderRadius: 0 }}>
            Reload home
          </Button>
        </Box>
      </Container>
    );
  }
}
