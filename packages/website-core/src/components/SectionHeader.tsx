import { Box, Typography } from "@mui/material";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export function SectionHeader({ eyebrow, title, subtitle, align = "left" }: Props) {
  return (
    <Box sx={{ textAlign: align, mb: { xs: 3, md: 5 }, maxWidth: 760, mx: align === "center" ? "auto" : 0 }}>
      {eyebrow && (
        <Typography
          sx={{
            color: "secondary.main",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            fontSize: 12,
            fontFamily: '"Inter", sans-serif',
            mb: 1.5,
          }}
        >
          {eyebrow}
        </Typography>
      )}
      <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 44 }, wordBreak: "break-word", overflowWrap: "anywhere" }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" sx={{ mt: 2, color: "text.secondary", fontSize: 18 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
