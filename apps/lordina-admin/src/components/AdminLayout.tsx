import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import TimelineIcon from "@mui/icons-material/Timeline";
import BusinessIcon from "@mui/icons-material/Business";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import ArticleIcon from "@mui/icons-material/Article";
import EventIcon from "@mui/icons-material/Event";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import GroupIcon from "@mui/icons-material/Group";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import SettingsIcon from "@mui/icons-material/Settings";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventNoteIcon from "@mui/icons-material/EventNote";
import HistoryIcon from "@mui/icons-material/History";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext.js";
import { SUBJECT } from "../config.js";

const DRAWER_WIDTH = 260;
const DRAWER_COLLAPSED_WIDTH = 72;

const NAV = [
  { to: "/", label: "Dashboard", icon: <DashboardIcon /> },
  { to: "/profile", label: "Profile", icon: <PersonIcon /> },
  { to: "/timeline", label: "Timeline", icon: <TimelineIcon /> },
  { to: "/ventures", label: "Ventures", icon: <BusinessIcon /> },
  { to: "/philanthropy", label: "Philanthropy", icon: <VolunteerActivismIcon /> },
  { to: "/achievements", label: "Achievements", icon: <EmojiEventsIcon /> },
  { to: "/quotes", label: "Quotes", icon: <FormatQuoteIcon /> },
  { to: "/news", label: "News", icon: <ArticleIcon /> },
  { to: "/events", label: "Events", icon: <EventIcon /> },
  { to: "/media", label: "Media", icon: <PhotoLibraryIcon /> },
  { to: "/availability", label: "Availability", icon: <EventAvailableIcon /> },
  { to: "/bookings", label: "Bookings", icon: <EventNoteIcon /> },
  { to: "/messages", label: "Inbox", icon: <ContactMailIcon /> },
  { to: "/subscribers", label: "Subscribers", icon: <GroupIcon /> },
  { to: "/ai", label: "AI helper", icon: <AutoAwesomeIcon /> },
  { to: "/settings", label: "Site settings", icon: <SettingsIcon /> },
  { to: "/users", label: "Admin users", icon: <AdminPanelSettingsIcon />, ownerOnly: true },
  { to: "/audit-log", label: "Audit log", icon: <HistoryIcon />, ownerOnly: true },
  { to: "/email-events", label: "Email events", icon: <MarkEmailReadIcon /> },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const drawerWidth = collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  const visibleNav = NAV.filter((n) => !n.ownerOnly || user?.role === "owner");
  const current = visibleNav.find((n) => n.to === loc.pathname)?.label ?? "Admin";

  const handleDrawerToggle = () => {
    if (isMobile) setMobileOpen((p) => !p);
    else setCollapsed((p) => !p);
  };

  const drawerContent = (
    <>
      <Box
        sx={{
          p: collapsed ? 1.5 : 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          minHeight: 64,
        }}
      >
        {!collapsed && (
          <Box>
            <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: 20, fontWeight: 600, lineHeight: 1.2 }}>
              {SUBJECT[0]?.toUpperCase()}{SUBJECT.slice(1)} · Admin
            </Typography>
            <Chip label="🇬🇭 Ghana" size="small" sx={{ mt: 0.75, color: "#000", background: theme.palette.secondary.main, fontWeight: 600 }} />
          </Box>
        )}
        <Tooltip title={collapsed ? "Expand" : "Collapse"}>
          <IconButton onClick={handleDrawerToggle} sx={{ color: "inherit" }}>
            {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
      <List sx={{ flex: 1, px: 1, py: 1.5 }}>
        {visibleNav.map((item) => {
          const active = loc.pathname === item.to || (item.to !== "/" && loc.pathname.startsWith(item.to));
          return (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              end={item.to === "/"}
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{
                borderRadius: 1.5,
                mb: 0.5,
                justifyContent: collapsed ? "center" : "flex-start",
                px: collapsed ? 1.5 : 2,
                minHeight: 44,
                color: "rgba(255,255,255,0.78)",
                transition: theme.transitions.create(["background-color", "color", "border-left"], { duration: 250 }),
                ...(active && {
                  color: "#fff",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  borderLeft: `3px solid ${theme.palette.secondary.main}`,
                }),
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.12)",
                },
                "& .MuiListItemIcon-root": { color: "inherit", minWidth: collapsed ? 0 : 38, mr: collapsed ? 0 : 1.5 },
              }}
            >
              <ListItemIcon sx={{ justifyContent: "center" }}>{item.icon}</ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 600 : 400, noWrap: true }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>
    </>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Mobile temporary drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            background: theme.palette.primary.main,
            color: "#fff",
            borderRight: 0,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop permanent drawer */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          width: drawerWidth,
          flexShrink: 0,
          whiteSpace: "nowrap",
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            overflowX: "hidden",
            boxSizing: "border-box",
            background: theme.palette.primary.main,
            color: "#fff",
            borderRight: 0,
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: (t) => t.palette.background.default,
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <AppBar
          position="sticky"
          sx={{
            background: "#fff",
            color: "text.primary",
            borderBottom: "1px solid",
            borderColor: "divider",
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
            transition: theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
          elevation={0}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {current}
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, display: { xs: "none", sm: "block" } }}>
                {user?.name}
              </Typography>
              <Tooltip title="Account">
                <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} size="small">
                  <Avatar sx={{ width: 34, height: 34, background: theme.palette.secondary.main, color: "#000", fontWeight: 600 }}>
                    {user?.name?.[0] ?? "A"}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              open={!!menuAnchor}
              anchorEl={menuAnchor}
              onClose={() => setMenuAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{ sx: { minWidth: 180, mt: 1 } }}
            >
              <MenuItem disabled sx={{ opacity: 1 }}>
                <Box>
                  <Typography variant="body2" fontWeight={600}>{user?.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { setMenuAnchor(null); navigate("/profile"); }}>Profile</MenuItem>
              <MenuItem disabled>Role: {user?.role}</MenuItem>
              <Divider />
              <MenuItem onClick={() => { setMenuAnchor(null); logout(); }}>Sign out</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Box component="main" id="main" sx={{ p: { xs: 2, sm: 3, md: 4 }, flex: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
