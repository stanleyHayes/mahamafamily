import { Box } from "@mui/material";

export function SkipLink() {
  return (
    <Box
      component="a"
      href="#main"
      sx={{
        position: "absolute",
        top: -9999,
        left: -9999,
        zIndex: 99999,
        px: 3,
        py: 1.5,
        background: (t) => t.palette.background.paper,
        color: (t) => t.palette.text.primary,
        textDecoration: "none",
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        border: "2px solid",
        borderColor: (t) => t.palette.secondary.main,
        borderRadius: 0,
        '&:focus': {
          top: 16,
          left: 16,
        },
      }}
    >
      Skip to main content
    </Box>
  );
}
