import { LinearProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export function RouteFallback() {
  const theme = useTheme();
  return (
    <LinearProgress
      sx={{
        height: 2,
        background: "transparent",
        "& .MuiLinearProgress-bar": { background: theme.palette.secondary.main },
      }}
    />
  );
}
