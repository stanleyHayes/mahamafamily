import { useState, useEffect, type MouseEvent } from "react";
import {
  AppBar, Toolbar, Box, Container, Typography, Drawer, IconButton, List, ListItemButton,
  ListItemText, Button, Menu, MenuItem, Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useTranslation } from "@mahama/i18n";
import { LanguagePicker } from "@mahama/website-core";
import { DarkModeToggle } from "@mahama/website-core";
import { LordinaLotus, RoseGoldStripe } from "@mahama/website-core";

interface Group {
  label: string;
  items: Array<{ to: string; label: string; description?: string} >;
}

export function LordinaHeader() {
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<{ label: string; el: HTMLElement } | null>(null);
  const loc = useLocation();
  void loc;

  const GROUPS: Group[] = [
    {
      label: t("nav.madam"),
      items: [
        { to: "/about", label: t("nav.biography"), description: "Bole, 1962 — a life in service" },
        { to: "/timeline", label: t("nav.journey"), description: "From classroom to Jubilee House" },
      ],
    },
    {
      label: t("nav.foundation"),
      items: [
        { to: "/ventures", label: t("nav.lordinaFoundation"), description: "Founded 2013 — mothers and children first" },
        { to: "/impact", label: t("nav.programmes"), description: "Maternal health · paediatric care · HIV awareness" },
      ],
    },
    {
      label: t("nav.publicLife"),
      items: [
        { to: "/events", label: t("nav.engagements"), description: "State functions and outreach" },
        { to: "/news", label: t("nav.press"), description: "Statements and features" },
      ],
    },
  ];

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
      <RoseGoldStripe height={4} />
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: scrolled ? "rgba(248, 242, 234, 0.96)" : "#F8F2EA",
          backdropFilter: "saturate(180%) blur(10px)",
          color: "#2A1418",
          borderBottom: "1px solid rgba(123, 35, 53, 0.14)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 70, md: 96 }, gap: 4 }}>
            {/* First Lady lockup: lotus crest + serif name */}
            <Box component={RouterLink} to="/" sx={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 2.5 }}>
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  background: "#7B2335",
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "50%",
                  border: "2px solid #C49B6C",
                  boxShadow: "0 0 0 4px #F8F2EA, 0 0 0 5px rgba(123,35,53,0.18)",
                }}
              >
                <LordinaLotus size={26} color="#E7C9A5" />
              </Box>
              <Box>
                <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: { xs: 18, md: 22 }, lineHeight: 1, letterSpacing: "0.02em", color: "#7B2335" }}>
                  Lordina Mahama
                </Typography>
                <Typography sx={{ fontSize: 10, color: "#C49B6C", letterSpacing: "0.32em", textTransform: "uppercase", mt: 0.4, fontWeight: 600 }}>
                  First Lady · Republic of Ghana
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
                      color: "#2A1418",
                      fontFamily: '"DM Serif Display", "Playfair Display", serif',
                      fontSize: 16,
                      textTransform: "none",
                      px: 2,
                      borderRadius: 0,
                      "&:hover": { color: "#7B2335", background: "transparent" },
                    }}
                  >
                    {g.label}
                  </Button>
                  {i < GROUPS.length - 1 && <Box sx={{ width: 5, height: 5, background: "#C49B6C", borderRadius: "50%" }} />}
                </Box>
              ))}
              <Button
                component={RouterLink}
                to="/book"
                variant="contained"
                sx={{
                  ml: 2,
                  background: "#7B2335",
                  color: "#F8F2EA",
                  fontFamily: '"Inter", sans-serif',
                  fontSize: 12,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  px: 2.5,
                  py: 1,
                  borderRadius: 0,
                  fontWeight: 600,
                  "&:hover": { background: "#5C1A28" },
                }}
              >
                {t("nav.connect")}
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
                  background: "#F8F2EA",
                  color: "#2A1418",
                  border: "1px solid rgba(123,35,53,0.18)",
                  borderTop: "3px solid #7B2335",
                  borderRadius: 0,
                  minWidth: 320,
                  py: 1,
                  mt: 1,
                  boxShadow: "0 12px 36px rgba(123,35,53,0.14)",
                },
              },
            }}
          >
            <Box sx={{ px: 3, pb: 1.5, pt: 1, display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 5, height: 5, background: "#C49B6C", borderRadius: "50%" }} />
              <Typography sx={{ fontSize: 10, letterSpacing: "0.36em", color: "#7B2335", textTransform: "uppercase", fontWeight: 700 }}>
                {g.label}
              </Typography>
            </Box>
            {g.items.map((it) => (
              <MenuItem
                key={it.label}
                component={RouterLink}
                to={it.to}
                onClick={close}
                sx={{ py: 1.25, px: 3, "&:hover": { background: "rgba(123,35,53,0.06)" } }}
              >
                <Box>
                  <Typography sx={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: 19, color: "#7B2335" }}>{it.label}</Typography>
                  {it.description && (
                    <Typography sx={{ fontSize: 12, color: "rgba(42,20,24,0.62)", mt: 0.25, fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic" }}>
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
          slotProps={{ paper: { sx: { background: "#F8F2EA", color: "#2A1418" } } }}
        >
          <Box sx={{ width: { xs: '100%', sm: 320 }, py: 4 }}>
            <RoseGoldStripe height={4} />
            {GROUPS.map((g) => (
              <Box key={g.label} sx={{ mt: 3, mb: 1 }}>
                <Typography sx={{ px: 3, fontSize: 10, letterSpacing: "0.36em", color: "#7B2335", textTransform: "uppercase", fontWeight: 700, mb: 1 }}>
                  {g.label}
                </Typography>
                <List disablePadding>
                  {g.items.map((it) => (
                    <ListItemButton key={it.label} component={RouterLink} to={it.to} onClick={() => setDrawerOpen(false)} >
                      <ListItemText primary={it.label} primaryTypographyProps={{ fontFamily: '"DM Serif Display", "Playfair Display", serif', fontSize: 22, color: "#7B2335" }} />
                    </ListItemButton>
                  ))}
                </List>
                <Divider sx={{ borderColor: "rgba(123,35,53,0.14)", mx: 3, mt: 1.5 }} />
              </Box>
            ))}
            <List disablePadding>
              <ListItemButton component={RouterLink} to="/book" onClick={() => setDrawerOpen(false)} sx={{ background: "#7B2335", color: "#F8F2EA", mx: 3, mt: 2 }}>
                <ListItemText primary={t("nav.connect")} primaryTypographyProps={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", fontSize: 13, textAlign: "center" }} />
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

export default LordinaHeader;
