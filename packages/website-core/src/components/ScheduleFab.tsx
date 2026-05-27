import { Fab, Tooltip } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { Link as RouterLink, useLocation } from "react-router-dom";
import type { SubjectKey } from "@mahama/shared-types";

const LABELS: Record<SubjectKey, string> = {
  ibrahim: "Schedule a meeting",
  john: "Request an audience",
  sharaf: "Book a meeting",
  lordina: "Request a meeting",
};

export function ScheduleFab({ subject }: { subject: SubjectKey }) {
  const loc = useLocation();
  if (loc.pathname.startsWith("/book")) return null;
  return (
    <Tooltip title={LABELS[subject] ?? "Book"} placement="left" arrow>
      <Fab
        aria-label={LABELS[subject] ?? "Book"}
        component={RouterLink}
        to="/book"
        color="secondary"
        sx={{
          position: "fixed",
          bottom: { xs: 20, md: 32 },
          right: { xs: 20, md: 32 },
          zIndex: (t) => t.zIndex.fab,
          boxShadow: "0 16px 36px rgba(0,0,0,0.3)",
          color: (t) => t.palette.text.primary,
        }}
      >
        <EventAvailableIcon />
      </Fab>
    </Tooltip>
  );
}
