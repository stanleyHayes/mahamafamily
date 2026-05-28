import { Box, Container, Grid, Skeleton, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

function useShimmerStyles() {
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  if (prefersReducedMotion) return {};
  return {
    background: "linear-gradient(90deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0.04) 80%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.6s infinite linear",
    "@keyframes shimmer": { "0%": { backgroundPosition: "200% 0" }, "100%": { backgroundPosition: "-200% 0" } },
  };
}

export function HeroSkeleton() {
  const shimmer = useShimmerStyles();
  return (
    <Box sx={{ minHeight: { xs: "min(640px, 100vh)", md: 760 }, background: (t) => t.palette.background.default, display: "flex", alignItems: "flex-end", py: 8 }}>
      <Container maxWidth="lg">
        <Stack spacing={3} >
          <Skeleton variant="rectangular" width={120} height={14} sx={{ background: (t) => `${t.palette.secondary.main}40`, ...shimmer }} />
          <Skeleton variant="rectangular" width="80%" height={96} sx={{ background: (t) => `${t.palette.text.primary}14`, ...shimmer }} />
          <Skeleton variant="rectangular" width="55%" height={64} sx={{ background: (t) => `${t.palette.secondary.main}2E`, ...shimmer }} />
          <Skeleton variant="rectangular" width="40%" height={28} sx={{ background: (t) => `${t.palette.text.primary}0F`, ...shimmer }} />
        </Stack>
      </Container>
    </Box>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  const shimmer = useShimmerStyles();
  return (
    <Grid container spacing={3} >
      {Array.from({ length: count }).map((_, i) => (
        <Grid item xs={12} md={4} key={i} >
          <Box sx={{ border: "1px solid", borderColor: "divider", p: 3, height: "100%" }}>
            <Skeleton variant="rectangular" width="40%" height={12} sx={{ mb: 1.5, ...shimmer }} />
            <Skeleton variant="rectangular" width="90%" height={28} sx={{ mb: 2, ...shimmer }} />
            <Skeleton variant="rectangular" width="100%" height={14} sx={{ mb: 0.75 }} />
            <Skeleton variant="rectangular" width="100%" height={14} sx={{ mb: 0.75 }} />
            <Skeleton variant="rectangular" width="60%" height={14} />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}

export function VentureGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <Grid container spacing={3} >
      {Array.from({ length: count }).map((_, i) => (
        <Grid item xs={12} md={6} key={i} >
          <Box sx={{ border: "1px solid", borderColor: "divider" }}>
            <Skeleton variant="rectangular" width="100%" height={240} />
            <Box sx={{ p: 4 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <Skeleton variant="rounded" width={80} height={22} />
                <Skeleton variant="rounded" width={100} height={22} />
              </Stack>
              <Skeleton variant="text" width="70%" height={36} />
              <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="80%" />
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}

export function TimelineSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Box sx={{ position: "relative", pl: { xs: 3, md: 6 } }}>
      <Box sx={{ position: "absolute", left: { xs: 8, md: 16 }, top: 8, bottom: 8, width: 2, background: (t) => t.palette.secondary.main, opacity: 0.15 }} />
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i} sx={{ position: "relative", mb: 6 }}>
          <Box sx={{ position: "absolute", left: { xs: -19, md: -39 }, top: 6, width: 18, height: 18, borderRadius: "50%", background: (t) => t.palette.secondary.main, opacity: 0.2 }} />
          <Skeleton variant="text" width={80} height={36} />
          <Skeleton variant="text" width="60%" height={28} sx={{ mt: 0.5 }} />
          <Skeleton variant="rounded" width={90} height={20} sx={{ my: 1 }} />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="80%" />
        </Box>
      ))}
    </Box>
  );
}

export function ProfileSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: 14 }}>
      <Grid container spacing={6} >
        <Grid item xs={12} md={5} >
          <Skeleton variant="rectangular" width="100%" height={520} />
          <Box sx={{ mt: 3, p: 2.5, border: "1px solid", borderColor: "divider" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Stack direction="row" spacing={2} sx={{ mb: 1.5 }} key={i} >
                <Skeleton variant="text" width={80} />
                <Skeleton variant="text" sx={{ flex: 1 }} />
              </Stack>
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} md={7} >
          <Skeleton variant="text" width={160} height={20} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="80%" height={56} />
          <Skeleton variant="text" width="60%" height={28} sx={{ mb: 4 }} />
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} variant="text" width={i % 3 === 2 ? "65%" : "100%"} sx={{ my: 0.5 }} />
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}

export function DetailSkeleton() {
  const shimmer = useShimmerStyles();
  return (
    <Container maxWidth="md" sx={{ py: 14 }}>
      <Stack spacing={3}>
        <Skeleton variant="rectangular" width={160} height={16} sx={{ background: (t) => `${t.palette.secondary.main}40`, ...shimmer }} />
        <Skeleton variant="rectangular" width="90%" height={48} sx={{ background: (t) => `${t.palette.text.primary}14`, ...shimmer }} />
        <Skeleton variant="rectangular" width="60%" height={48} sx={{ background: (t) => `${t.palette.text.primary}14`, ...shimmer }} />
        <Skeleton variant="rectangular" width={140} height={16} sx={{ mb: 2 }} />
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ ...shimmer }} />
          <Stack spacing={2}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="text" width={i % 2 === 0 ? "100%" : "70%"} sx={{ my: 0.5 }} />
            ))}
          </Stack>
        </Box>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="text" width={i % 3 === 2 ? "55%" : "100%"} sx={{ my: 0.5 }} />
        ))}
      </Stack>
    </Container>
  );
}

export function ArticleSkeleton() {
  const shimmer = useShimmerStyles();
  return (
    <Container maxWidth="md" sx={{ py: 14 }}>
      <Stack spacing={3}>
        <Skeleton variant="rectangular" width={160} height={16} sx={{ background: (t) => `${t.palette.secondary.main}40`, ...shimmer }} />
        <Skeleton variant="rectangular" width="90%" height={48} sx={{ background: (t) => `${t.palette.text.primary}14`, ...shimmer }} />
        <Skeleton variant="rectangular" width="60%" height={48} sx={{ background: (t) => `${t.palette.text.primary}14`, ...shimmer }} />
        <Skeleton variant="rectangular" width={140} height={16} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={320} sx={{ mb: 2, ...shimmer }} />
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} variant="text" width={i % 4 === 3 ? "55%" : "100%"} sx={{ my: 0.5 }} />
        ))}
      </Stack>
    </Container>
  );
}
