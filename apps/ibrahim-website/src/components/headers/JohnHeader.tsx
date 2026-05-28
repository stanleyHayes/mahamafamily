import { useState, useEffect, type MouseEvent } from "react";
import {
  AppBar, Toolbar, Box, Container, Typography, Drawer, IconButton, List, ListItemButton,
  ListItemText, Button, Menu, MenuItem, Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Link as RouterLink, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "@mahama/i18n";
import { LanguagePicker } from "@mahama/website-core";
import { DarkModeToggle } from "@mahama/website-core";
import { BlackStar, KenteStripe } from "@mahama/website-core";

interface Group {
  label: string;
  items: Array<{ to: string; label: string; description?: string} >;
}

export function JohnHeader() {
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<{ label: string; el: HTMLElement } | null>(null);
  const loc = useLocation();
  const onHome = loc.pathname === "/";

  const GROUPS: Group[] = [
    {
      label: t("nav.thePresident"),
      items: [
        { to: "/about", label: t("nav.biography"), description: "Damongo, 1958 — Jubilee House, today" },
        { to: "/timeline", label: t("nav.chronicle"), description: "Three decades in public life" },
      ],
    },
    {
      label: t("nav.theAgenda"),
      items: [
        { to: "/ventures", label: "Reset Ghana", description: "The flagship 2025 programme" },
        { to: "/ventures", label: "24-Hour Economy", description: "A nation that does not sleep" },
        { to: "/ventures", label: "Accra Reset", description: "African-led debt, trade and climate reform" },
      ],
    },
    {
      label: t("nav.publicService"),
      items: [
        { to: "/impact", label: t("nav.serviceRecord"), description: "Schools, hospitals, infrastructure" },
        { to: "/events", label: t("nav.engagements"), description: "Speeches and state functions" },
      ],
    },
  ];

  const FLAT = [{ to: "/news", label: t("nav.press") }];

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const open = (label: string) => (e: MouseEvent<HTMLElement>) => setOpenGroup({ label, el: e.currentTarget });
  const close = () => setOpenGroup(null);

  return (
    <Box>
      {/* Kente stripe — flag colours */}
      <KenteStripe height={5} />
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: scrolled ? "rgba(251, 248, 241, 0.96)" : "#FBF8F1",
          backdropFilter: "saturate(180%) blur(10px)",
          color: "#0F1A14",
          borderBottom: "1px solid rgba(11, 79, 44, 0.12)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 70, md: 96 }, gap: 4 }}>
            {/* Presidential lockup: star emblem + serif name */}
            <Box component={RouterLink} to="/" sx={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 2.5 }}>
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  background: "#0B4F2C",
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "50%",
                  border: "2px solid #D4AF37",
                  boxShadow: "0 0 0 4px #FBF8F1, 0 0 0 5px rgba(11,79,44,0.16)",
                }}
              >
                <BlackStar size={22} color="#D4AF37" />
              </Box>
              <Box>
                <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: { xs: 18, md: 22 }, lineHeight: 1, letterSpacing: "0.02em", color: "#0B4F2C" }}>
                  John Dramani Mahama
                </Typography>
                <Typography sx={{ fontSize: 10, color: "#8E1B25", letterSpacing: "0.32em", textTransform: "uppercase", mt: 0.4, fontWeight: 600 }}>
                  {t("nav.officeOfPresident")}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flex: 1 }} />

            {/* Desktop nav */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.25 }}>
              {GROUPS.map((g, i) => (
                <Box key={g.label} sx={{ display: "flex", alignItems: "center" }}>
                  <Button
                    onClick={open(g.label)}
                    endIcon={<KeyboardArrowDownIcon sx={{ fontSize: "16px !important" }} />}
                    sx={{
                      color: "#0F1A14",
                      fontFamily: '"DM Serif Display", "Playfair Display", serif',
                      fontSize: 16,
                      textTransform: "none",
                      px: 2,
                      borderRadius: 0,
                      "&:hover": { color: "#0B4F2C", background: "transparent" },
                    }}
                  >
                    {g.label}
                  </Button>
                  {i < GROUPS.length - 1 && <Box sx={{ width: 4, height: 4, background: "#D4AF37", borderRadius: "50%" }} />}
                </Box>
              ))}
              <Box sx={{ width: 4, height: 4, background: "#D4AF37", borderRadius: "50%" }} />
              {FLAT.map((f) => (
                <Button
                  key={f.to}
                  component={NavLink}
                  to={f.to}
                  sx={{
                    color: "#0F1A14",
                    fontFamily: '"DM Serif Display", "Playfair Display", serif',
                    fontSize: 16,
                    textTransform: "none",
                    px: 2,
                    borderRadius: 0,
                    "&.active, &:hover": { color: "#0B4F2C", background: "transparent" },
                  }}
                >
                  {f.label}
                </Button>
              ))}
              <Button
                component={RouterLink}
                to="/book"
                variant="contained"
                sx={{
                  ml: 2,
                  background: "#0B4F2C",
                  color: "#FBF8F1",
                  fontFamily: '"Inter", sans-serif',
                  fontSize: 12,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  px: 2.5,
                  py: 1,
                  borderRadius: 0,
                  fontWeight: 600,
                  "&:hover": { background: "#063820" },
                }}
              >
                {t("nav.audience")}
              </Button>
              <DarkModeToggle />
              <LanguagePicker />
            </Box>

            <IconButton onClick={() => setDrawerOpen(true)} aria-label="Open menu" sx={{ display: { xs: "inline-flex", md: "none" }, color: "inherit" }}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>

        {/* Dropdown menus */}
        {GROUPS.map((g) => (
          <Menu
            key={g.label}
            open={openGroup?.label === g.label}
            anchorEl={openGroup?.el}
            onClose={close}
            MenuListProps={{ onMouseLeave: close }}
            slotProps={{
              paper: {
                sx: {
                  background: "#FBF8F1",
                  color: "#0F1A14",
                  border: "1px solid rgba(11,79,44,0.16)",
                  borderTop: "3px solid #0B4F2C",
                  borderRadius: 0,
                  minWidth: 320,
                  py: 1,
                  mt: 1,
                  boxShadow: "0 12px 36px rgba(11,79,44,0.12)",
                },
              },
            }}
          >
            <Box sx={{ px: 3, pb: 1.5, pt: 1, display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 4, height: 4, background: "#D4AF37", borderRadius: "50%" }} />
              <Typography sx={{ fontSize: 10, letterSpacing: "0.36em", color: "#0B4F2C", textTransform: "uppercase", fontWeight: 700 }}>
                {g.label}
              </Typography>
            </Box>
            {g.items.map((it) => (
              <MenuItem
                key={it.label}
                component={RouterLink}
                to={it.to}
                onClick={close}
                sx={{ py: 1.25, px: 3, "&:hover": { background: "rgba(11,79,44,0.06)" } }}
              >
                <Box>
                  <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: 19, color: "#0B4F2C" }}>{it.label}</Typography>
                  {it.description && (
                    <Typography sx={{ fontSize: 12, color: "rgba(15,26,20,0.62)", mt: 0.25, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic" }}>
                      {it.description}
                    </Typography>
                  )}
                </Box>
              </MenuItem>
            ))}
          </Menu>
        ))}

        {/* Mobile drawer */}
        <Drawer anchor="right" open={drawerOpen}
        aria-label="Navigation" onClose={() => setDrawerOpen(false)}
          slotProps={{ paper: { sx: { background: "#FBF8F1", color: "#0F1A14" } } }}
        >
          <Box sx={{ width: { xs: '100%', sm: 320 }, py: 4 }}>
            <KenteStripe height={4} />
            {GROUPS.map((g) => (
              <Box key={g.label} sx={{ mt: 3, mb: 1 }}>
                <Typography sx={{ px: 3, fontSize: 10, letterSpacing: "0.36em", color: "#0B4F2C", textTransform: "uppercase", fontWeight: 700, mb: 1 }}>
                  {g.label}
                </Typography>
                <List disablePadding>
                  {g.items.map((it) => (
                    <ListItemButton key={it.label} component={RouterLink} to={it.to} onClick={() => setDrawerOpen(false)} >
                      <ListItemText primary={it.label} primaryTypographyProps={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: 22, color: "#0B4F2C" }} />
                    </ListItemButton>
                  ))}
                </List>
                <Divider sx={{ borderColor: "rgba(11,79,44,0.12)", mx: 3, mt: 1.5 }} />
              </Box>
            ))}
            <List disablePadding>
              {FLAT.map((f) => (
                <ListItemButton key={f.to} component={RouterLink} to={f.to} onClick={() => setDrawerOpen(false)} >
                  <ListItemText primary={f.label} primaryTypographyProps={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, color: "#0B4F2C" }} />
                </ListItemButton>
              ))}
              <ListItemButton component={RouterLink} to="/book" onClick={() => setDrawerOpen(false)} sx={{ background: "#0B4F2C", color: "#FBF8F1", mx: 3, mt: 2 }}>
                <ListItemText primary={t("hero.requestAudience")} primaryTypographyProps={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", fontSize: 13, textAlign: "center" }} />
              </ListItemButton>
            </List>
            <Box sx={{ px: 3, mt: 3, display: "flex", alignItems: "center", gap: 1 }}>
              <DarkModeToggle />
              <LanguagePicker />
            </Box>
          </Box>
        </Drawer>
      </AppBar>
    </Box>
  );
}
