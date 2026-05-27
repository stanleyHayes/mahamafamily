import { Box } from "@mui/material";
import { ghanaFlag } from "@mahama/ui-theme";

export function GhanaStripe() {
  return (
    <Box
      sx={{
        height: 6,
        display: "flex",
        "& > *": { flex: 1 },
      }}
    >
      <Box sx={{ background: ghanaFlag.red }} />
      <Box sx={{ background: ghanaFlag.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ fontSize: 8, lineHeight: 1, color: ghanaFlag.black }}>★</Box>
      </Box>
      <Box sx={{ background: ghanaFlag.green }} />
    </Box>
  );
}
