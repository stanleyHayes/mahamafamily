import { Routes, Route, Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { useAuth } from "./auth/AuthContext.js";
import { LoginPage } from "./pages/LoginPage.js";
import { AdminLayout } from "./components/AdminLayout.js";
import { DashboardPage } from "./pages/DashboardPage.js";
import { ProfilePage } from "./pages/ProfilePage.js";
import { TimelinePage } from "./pages/TimelinePage.js";
import { VenturesPage } from "./pages/VenturesPage.js";
import { PhilanthropyPage } from "./pages/PhilanthropyPage.js";
import { AchievementsPage } from "./pages/AchievementsPage.js";
import { QuotesPage } from "./pages/QuotesPage.js";
import { NewsPage } from "./pages/NewsPage.js";
import { EventsPage } from "./pages/EventsPage.js";
import { MessagesPage } from "./pages/MessagesPage.js";
import { SubscribersPage } from "./pages/SubscribersPage.js";
import { MediaPage } from "./pages/MediaPage.js";
import { SettingsPage } from "./pages/SettingsPage.js";
import { UsersPage } from "./pages/UsersPage.js";
import { AiPage } from "./pages/AiPage.js";
import { AvailabilityPage } from "./pages/AvailabilityPage.js";
import { BookingsPage } from "./pages/BookingsPage.js";
import { AuditLogPage } from "./pages/AuditLogPage.js";
import { EmailEventsPage } from "./pages/EmailEventsPage.js";

export function App() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route element={user ? <AdminLayout /> : <Navigate to="/login" replace />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/ventures" element={<VenturesPage />} />
        <Route path="/philanthropy" element={<PhilanthropyPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/quotes" element={<QuotesPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/subscribers" element={<SubscribersPage />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/ai" element={<AiPage />} />
        <Route path="/availability" element={<AvailabilityPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/audit-log" element={<AuditLogPage />} />
        <Route path="/email-events" element={<EmailEventsPage />} />
      </Route>
    </Routes>
  );
}
