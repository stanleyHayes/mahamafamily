import { Box, Button, Stack, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTheme } from "@mui/material/styles";

interface QueryErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function QueryError({ message = "We couldn't retrieve that data.", onRetry }: QueryErrorProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 3, md: 6 },
        textAlign: "center",
        border: "1px solid",
        borderColor: "divider",
        background: (t) => `${t.palette.error.main}08`,
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "error.main",
          mb: 2,
          fontFamily: '"Inter", sans-serif',
        }}
      >
        Connection issue
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontSize: { xs: 24, md: 32 },
          lineHeight: 1.2,
          maxWidth: 560,
          mx: "auto",
          fontWeight: 500,
        }}
      >
        {message}
      </Typography>
      {onRetry && (
        <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
          <Button
            onClick={onRetry}
            variant="outlined"
            color="secondary"
            startIcon={<RefreshIcon />}
            sx={{ borderRadius: 999, px: 3 }}
          >
            Try again
          </Button>
        </Stack>
      )}
    </Box>
  );
}
