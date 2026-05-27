import { useState, useEffect, useRef } from "react";
import {
  AppBar, Toolbar, Box, Container, Typography, Drawer, IconButton, List, ListItemButton,
  ListItemText, Button, Divider, Grid,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LanguageIcon from "@mui/icons-material/Language";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { Link as RouterLink, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "@mahama/i18n";
import { LanguagePicker } from "@mahama/website-core";
import { DarkModeToggle } from "@mahama/website-core";

interface DropdownGroup {
  label: string;
  description: string;
  items: Array<{ to: string; label: string; description?: string} >;
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg width="9" height="9" viewBox="0 0 12 12" style={{ marginLeft: 6, transition: "transform 0.18s", transform: open ? "rotate(180deg)" : "none" }}>
      <path d="M2 4 L6 8 L10 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IbrahimHeader() {
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loc = useLocation();
  const onHome = loc.pathname === "/";

  const GROUPS: DropdownGroup[] = [
    {
      label: t("nav.theMan"),
      description: "From Damongo to London, then home to build.",
      items: [
        { to: "/about", label: t("nav.biography"), description: "The full account" },
        { to: "/timeline", label: t("nav.chronicle"), description: "Five decades, in milestones" },
      ],
    },
    {
      label: t("nav.theWork"),
      description: "West Africa's largest indigenous mining group.",
      items: [
        { to: "/ventures", label: t("nav.ventures"), description: "E&P · Dzata · Damang & more" },
        { to: "/", label: t("nav.industrialLedger"), description: "By the numbers" },
      ],
    },
    {
      label: t("nav.service"),
      description: "Health, education, faith, and disaster relief.",
      items: [
        { to: "/impact", label: t("nav.philanthropy"), description: "Programmes & beneficiaries" },
        { to: "/events", label: t("nav.publicEngagements"), description: "Speeches and ceremonies" },
      ],
    },
  ];

  const FLAT = [{ to: "/news", label: t("nav.press") }];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close any open menu on route change
  useEffect(() => { setActiveGroup(null); }, [loc.pathname]);

  const transparent = onHome && !scrolled && !activeGroup;

  const cancelClose = () => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  };
  const setGroup = (label: string | null) => {
    cancelClose();
    setActiveGroup(label);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setActiveGroup(null), 140);
  };

  const active = GROUPS.find((g) => g.label === activeGroup) ?? null;

  return (
    <Box onMouseLeave={scheduleClose} onMouseEnter={cancelClose} sx={{ position: onHome ? "fixed" : "sticky", top: 0, left: 0, right: 0, zIndex: (t) => t.zIndex.appBar }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: transparent ? "transparent" : "rgba(8, 9, 14, 0.97)",
          backdropFilter: transparent ? "none" : "saturate(180%) blur(14px)",
          color: "#F2EDE2",
          transition: "background 0.25s",
          boxShadow: "none",
        }}
      >
        <Box sx={{ background: "linear-gradient(90deg, transparent, rgba(201,162,39,0.45), transparent)", height: 1 }} />
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 86 }, gap: { md: 4 } }}>
            {/* Brand */}
            <Box component={RouterLink} to="/" sx={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 1.75, flexShrink: 0 }} onMouseEnter={() => setGroup(null)} >
              <Box sx={{
                width: 38, height: 38, border: "1.5px solid #C9A227",
                display: "grid", placeItems: "center", color: "#C9A227",
                fontFamily: '"Playfair Display", serif', fontSize: 20, fontWeight: 700,
              }}>IM</Box>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography sx={{ fontFamily: '"IBM Plex Serif", serif', fontSize: 13, letterSpacing: "0.32em", textTransform: "uppercase", lineHeight: 1.1, whiteSpace: "nowrap" }}>
                  Ibrahim Mahama
                </Typography>
                <Typography sx={{ fontSize: 9.5, color: "#C9A227", letterSpacing: "0.28em", textTransform: "uppercase", mt: 0.4, fontFamily: '"IBM Plex Mono", monospace' }}>
                  {t("nav.officeIndustrialist")}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flex: 1 }} />

            {/* Desktop nav */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "stretch" }}>
              {GROUPS.map((g) => {
                const isActive = activeGroup === g.label;
                return (
                  <Box
                    key={g.label}
                    onMouseEnter={() => setGroup(g.label)}
                    sx={{ display: "flex", alignItems: "stretch" }}
                  >
                    <Button
                      onClick={() => setGroup(isActive ? null : g.label)}
                      disableRipple
                      sx={{
                        color: isActive ? "#C9A227" : "inherit",
                        fontFamily: '"IBM Plex Serif", serif',
                        fontSize: 14,
                        textTransform: "none",
                        px: 2.25,
                        borderRadius: 0,
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        letterSpacing: "0.01em",
                        minWidth: 0,
                        height: "100%",
                        borderBottom: "2px solid",
                        borderColor: isActive ? "#C9A227" : "transparent",
                        transition: "color 0.18s ease, border-color 0.18s ease",
                        "&:hover": { background: "transparent", color: "#C9A227" },
                      }}
                    >
                      {g.label}
                      <ChevronDown open={isActive} />
                    </Button>
                  </Box>
                );
              })}
              {FLAT.map((f) => (
                <Box key={f.to} onMouseEnter={() => setGroup(null)} sx={{ display: "flex", alignItems: "stretch" }}>
                  <Button
                    component={NavLink}
                    to={f.to}
                    disableRipple
                    sx={{
                      color: "inherit",
                      fontFamily: '"IBM Plex Serif", serif',
                      fontSize: 14,
                      textTransform: "none",
                      px: 2.25,
                      borderRadius: 0,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      letterSpacing: "0.01em",
                      minWidth: 0,
                      height: "100%",
                      borderBottom: "2px solid transparent",
                      transition: "color 0.18s ease, border-color 0.18s ease",
                      "&.active": { color: "#C9A227", borderColor: "#C9A227" },
                      "&:hover": { background: "transparent", color: "#C9A227" },
                    }}
                  >
                    {f.label}
                  </Button>
                </Box>
              ))}

              <Box onMouseEnter={() => setGroup(null)} sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ width: "1px", height: 20, background: "rgba(255,255,255,0.16)", mx: 2 }} />
                <Button
                  component={RouterLink}
                  to="/book"
                  endIcon={<ArrowOutwardIcon sx={{ fontSize: "14px !important" }} />}
                  sx={{
                    background: "#C9A227",
                    color: "#08090C",
                    fontFamily: '"IBM Plex Sans", sans-serif',
                    fontSize: 12,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    px: 2.4,
                    py: 0.85,
                    borderRadius: 0,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    "&:hover": { background: "#F2EDE2", color: "#08090C" },
                  }}
                >
                  {t("nav.schedule")}
                </Button>
                <Box sx={{ ml: 1 }}>
                  <DarkModeToggle light />
                </Box>
                <Box sx={{ ml: 1 }}>
                  <LanguagePicker light />
                </Box>
              </Box>
            </Box>

            {/* Mobile */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: "inherit" }} aria-label="Open menu">
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>

        {/* Inline mega-panel — part of the AppBar flow, no gap, no portal */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            background: "#08090C",
            borderTop: active ? "1px solid rgba(201,162,39,0.18)" : "1px solid transparent",
            maxHeight: active ? 600 : 0,
            overflowY: "auto",
            overflow: "hidden",
            transition: "max-height 0.22s ease",
          }}
        >
          {active && (
            <Container maxWidth="xl">
              <Grid container spacing={6} sx={{ py: 4 }}>
                <Grid item xs={12} md={4} >
                  <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, letterSpacing: "0.32em", color: "#C9A227", textTransform: "uppercase", mb: 1.5 }}>
                    {active.label}
                  </Typography>
                  <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: 26, lineHeight: 1.25, color: "#F2EDE2", maxWidth: 360 }}>
                    {active.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8} >
                  <Grid container spacing={3} >
                    {active.items.map((it) => (
                      <Grid item xs={12} sm={6} key={it.to + it.label} >
                        <Box
                          component={RouterLink}
                          to={it.to}
                          onClick={() => setActiveGroup(null)}
                          sx={{
                            display: "block",
                            textDecoration: "none",
                            color: "inherit",
                            p: 2.5,
                            border: "1px solid rgba(201,162,39,0.18)",
                            transition: "background 0.16s, border-color 0.16s",
                            "&:hover": {
                              background: "rgba(201,162,39,0.08)",
                              borderColor: "#C9A227",
                              "& .arrow": { transform: "translate(2px,-2px)" },
                            },
                          }}
                        >
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                            <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: 22, color: "#F2EDE2" }}>
                              {it.label}
                            </Typography>
                            <Box className="arrow" sx={{ color: "#C9A227", transition: "transform 0.16s" }}>
                              <ArrowOutwardIcon sx={{ fontSize: 16 }} />
                            </Box>
                          </Box>
                          {it.description && (
                            <Typography sx={{ fontSize: 12, color: "rgba(242,237,226,0.6)", fontFamily: '"IBM Plex Sans", sans-serif' }}>
                              {it.description}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Container>
          )}
        </Box>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        aria-label="Navigation"
        onClose={() => setDrawerOpen(false)}
        slotProps={{ paper: { sx: { background: "#08090C", color: "#F2EDE2", width: { xs: '100%', sm: 320 } } } }}
      >
        <Box sx={{ py: 4 }}>
          <Box sx={{ px: 3, pb: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ width: 38, height: 38, border: "1.5px solid #C9A227", display: "grid", placeItems: "center", color: "#C9A227", fontFamily: '"Playfair Display", serif', fontSize: 20, fontWeight: 700 }}>IM</Box>
            <Typography sx={{ fontFamily: '"IBM Plex Serif", serif', fontSize: 13, letterSpacing: "0.32em", textTransform: "uppercase" }}>
              Ibrahim Mahama
            </Typography>
          </Box>
          <Divider sx={{ borderColor: "rgba(201,162,39,0.18)" }} />
          {GROUPS.map((g) => (
            <Box key={g.label} sx={{ mt: 2 }}>
              <Typography sx={{ px: 3, fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, letterSpacing: "0.32em", color: "#C9A227", textTransform: "uppercase", mb: 1 }}>
                {g.label}
              </Typography>
              <List disablePadding>
                {g.items.map((it) => (
                  <ListItemButton key={it.label} component={RouterLink} to={it.to} onClick={() => setDrawerOpen(false)} >
                    <ListItemText primary={it.label} primaryTypographyProps={{ fontFamily: '"Playfair Display", serif', fontSize: 22 }} />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          ))}
          <Divider sx={{ borderColor: "rgba(201,162,39,0.12)", my: 2 }} />
          <List disablePadding>
            {FLAT.map((f) => (
              <ListItemButton key={f.to} component={RouterLink} to={f.to} onClick={() => setDrawerOpen(false)} >
                <ListItemText primary={f.label} primaryTypographyProps={{ fontFamily: '"Playfair Display", serif', fontSize: 22 }} />
              </ListItemButton>
            ))}
          </List>
          <Box sx={{ px: 3, mt: 3 }}>
            <Button
              component={RouterLink}
              to="/book"
              fullWidth
              onClick={() => setDrawerOpen(false)}
              endIcon={<ArrowOutwardIcon sx={{ fontSize: "16px !important" }} />}
              sx={{
                background: "#C9A227", color: "#08090C",
                fontFamily: '"IBM Plex Sans", sans-serif',
                fontSize: 13, letterSpacing: "0.22em", textTransform: "uppercase",
                py: 1.4, borderRadius: 0, fontWeight: 600,
                "&:hover": { background: "#F2EDE2" },
              }}
            >
              {t("hero.scheduleMeeting")}
            </Button>
          </Box>
          <Box sx={{ px: 3, mt: 3, display: "flex", alignItems: "center", gap: 1.5, color: "rgba(242,237,226,0.6)" }}>
            <DarkModeToggle light />
            <LanguageIcon fontSize="small" />
            <LanguagePicker light />
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
