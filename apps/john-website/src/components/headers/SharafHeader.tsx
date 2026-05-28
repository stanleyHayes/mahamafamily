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

interface Group {
  label: string;
  items: Array<{ to: string; label: string; meta?: string} >;
}

export function SharafHeader() {
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<{ label: string; el: HTMLElement } | null>(null);
  const loc = useLocation();

  const GROUPS: Group[] = [
    {
      label: "Sharaf",
      items: [
        { to: "/about", label: t("nav.profile"), meta: "B. Accra · 1996" },
        { to: "/timeline", label: t("nav.career"), meta: "Football to Bukom" },
        { to: "/news", label: t("nav.stories") },
      ],
    },
    {
      label: t("nav.legacyrise"),
      items: [
        { to: "/ventures", label: t("nav.about"), meta: "Inside the operation" },
        { to: "/events", label: t("nav.fightcard"), meta: "Upcoming nights" },
        { to: "/", label: "The Bukom Card", meta: "All-time ledger" },
      ],
    },
  ];

  const FLAT = [{ to: "/impact", label: t("nav.foundation") }];

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
      {/* Boxing card top: red / yellow / green stripes + scrolling marquee */}
      <Box sx={{ background: "#0B0B0B", overflow: "hidden", borderBottom: "2px solid #E0B73A" }}>
        <Box sx={{ display: "flex", height: 4 }}>
          <Box sx={{ flex: 1, background: "#D62828" }} />
          <Box sx={{ flex: 1, background: "#E0B73A" }} />
          <Box sx={{ flex: 1, background: "#0B4F2C" }} />
        </Box>
        <Box sx={{
          display: "flex", whiteSpace: "nowrap",
          animation: "marquee 32s linear infinite",
          py: 0.5,
          fontFamily: '"Bebas Neue", "Anton", sans-serif',
          fontSize: 11,
          letterSpacing: "0.32em",
          color: "#E0B73A",
          "& span": { px: 4 },
          "@keyframes marquee": {
            "0%": { transform: "translateX(0)" },
            "100%": { transform: "translateX(-50%)" },
          },
          '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        }}>
          {[..."BUKOM ARENA · ACCRA · GHANA · LEGACY RISE · WEST AFRICA RISING · BATTLE OF THE BEASTS · THE SHOWDOWN ".repeat(2)].join("")
            .split("·").map((t, i) => <span key={i} >· {t.trim()}</span>)}
        </Box>
      </Box>

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: scrolled ? "rgba(11, 11, 11, 0.97)" : "#0B0B0B",
          backdropFilter: "saturate(180%) blur(12px)",
          color: "#F4F1ED",
          borderBottom: "1px solid rgba(224, 183, 58, 0.18)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 70, md: 88 }, gap: 4 }}>
            {/* Brand: condensed display logotype */}
            <Box component={RouterLink} to="/" sx={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "baseline", gap: 1.25 }}>
              <Typography sx={{
                fontFamily: '"Bebas Neue", "Anton", "Arial Narrow", sans-serif',
                fontSize: { xs: 32, md: 44 },
                lineHeight: 1,
                letterSpacing: "0.02em",
                color: "#E0B73A",
              }}>
                SHARAF
              </Typography>
              <Typography sx={{
                fontFamily: '"Bebas Neue", sans-serif',
                fontSize: { xs: 22, md: 28 },
                lineHeight: 1,
                letterSpacing: "0.02em",
                color: "#F4F1ED",
                opacity: 0.92,
              }}>
                MAHAMA
              </Typography>
              <Box sx={{ display: { xs: "none", md: "block" }, ml: 1.5, fontSize: 9, color: "#D62828", letterSpacing: "0.32em", textTransform: "uppercase", fontFamily: '"Inter", sans-serif', fontWeight: 700, alignSelf: "center", borderLeft: "1px solid rgba(224,183,58,0.4)", pl: 1.5 }}>
                {t("nav.legacyRisePromoter")}
              </Box>
            </Box>

            <Box sx={{ flex: 1 }} />

            {/* Desktop nav */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.25 }}>
              {GROUPS.map((g) => (
                <Button
                  key={g.label}
                  onClick={open(g.label)}
                  endIcon={<KeyboardArrowDownIcon sx={{ fontSize: "16px !important" }} />}
                  sx={{
                    color: "inherit",
                    fontFamily: '"Bebas Neue", "Anton", sans-serif',
                    fontSize: 18,
                    letterSpacing: "0.16em",
                    px: 2,
                    borderRadius: 0,
                    "&:hover": { color: "#E0B73A", background: "rgba(224,183,58,0.08)" },
                  }}
                >
                  {g.label}
                </Button>
              ))}
              {FLAT.map((f) => (
                <Button
                  key={f.to}
                  component={NavLink}
                  to={f.to}
                  sx={{
                    color: "inherit",
                    fontFamily: '"Bebas Neue", "Anton", sans-serif',
                    fontSize: 18,
                    letterSpacing: "0.16em",
                    px: 2,
                    borderRadius: 0,
                    "&.active, &:hover": { color: "#E0B73A", background: "rgba(224,183,58,0.08)" },
                  }}
                >
                  {f.label}
                </Button>
              ))}
              <Button
                component={RouterLink}
                to="/book"
                sx={{
                  ml: 2,
                  background: "#E0B73A",
                  color: "#0B0B0B",
                  fontFamily: '"Bebas Neue", "Anton", sans-serif',
                  fontSize: 16,
                  letterSpacing: "0.18em",
                  px: 3,
                  py: 1,
                  borderRadius: 0,
                  border: "2px solid #E0B73A",
                  "&:hover": { background: "transparent", color: "#E0B73A" },
                }}
              >
                {t("nav.bookTime")}
              </Button>
              <DarkModeToggle light />
              <LanguagePicker light />
            </Box>

            <IconButton onClick={() => setDrawerOpen(true)} aria-label="Open menu" sx={{ display: { xs: "inline-flex", md: "none" }, color: "inherit" }}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>

        {/* Dropdowns */}
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
                  background: "#0B0B0B",
                  color: "#F4F1ED",
                  border: "2px solid #E0B73A",
                  borderRadius: 0,
                  minWidth: 300,
                  py: 1,
                  mt: 1,
                },
              },
            }}
          >
            <Box sx={{ px: 3, pb: 1, pt: 0.5, fontFamily: '"Bebas Neue", sans-serif', fontSize: 12, letterSpacing: "0.36em", color: "#D62828" }}>
              {g.label}
            </Box>
            {g.items.map((it) => (
              <MenuItem
                key={it.label}
                component={RouterLink}
                to={it.to}
                onClick={close}
                sx={{ py: 1.5, px: 3, alignItems: "flex-start", "&:hover": { background: "rgba(224,183,58,0.1)" } }}
              >
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, width: "100%" }}>
                  <Typography sx={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: 26, letterSpacing: "0.04em", lineHeight: 1, flex: 1 }}>
                    {it.label}
                  </Typography>
                  {it.meta && (
                    <Typography sx={{ fontSize: 10, color: "#E0B73A", letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: '"Inter", sans-serif' }}>
                      {it.meta}
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
          slotProps={{ paper: { sx: { background: "#0B0B0B", color: "#F4F1ED" } } }}
        >
          <Box sx={{ width: { xs: '100%', sm: 320 }, py: 3 }}>
            <Box sx={{ display: "flex", height: 4, mb: 3 }}>
              <Box sx={{ flex: 1, background: "#D62828" }} />
              <Box sx={{ flex: 1, background: "#E0B73A" }} />
              <Box sx={{ flex: 1, background: "#0B4F2C" }} />
            </Box>
            {GROUPS.map((g) => (
              <Box key={g.label} sx={{ mb: 2 }}>
                <Typography sx={{ px: 3, fontFamily: '"Bebas Neue", sans-serif', fontSize: 12, letterSpacing: "0.36em", color: "#D62828", mb: 0.5 }}>
                  {g.label}
                </Typography>
                <List disablePadding>
                  {g.items.map((it) => (
                    <ListItemButton key={it.label} component={RouterLink} to={it.to} onClick={() => setDrawerOpen(false)} >
                      <ListItemText primary={it.label} primaryTypographyProps={{ fontFamily: '"Bebas Neue", "Anton", sans-serif', fontSize: 28, letterSpacing: "0.04em" }} />
                    </ListItemButton>
                  ))}
                </List>
                <Divider sx={{ borderColor: "rgba(224,183,58,0.16)", mt: 1 }} />
              </Box>
            ))}
            <List disablePadding>
              {FLAT.map((f) => (
                <ListItemButton key={f.to} component={RouterLink} to={f.to} onClick={() => setDrawerOpen(false)} >
                  <ListItemText primary={f.label} primaryTypographyProps={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 28 }} />
                </ListItemButton>
              ))}
              <ListItemButton component={RouterLink} to="/book" onClick={() => setDrawerOpen(false)} sx={{ background: "#E0B73A", color: "#0B0B0B", mx: 3, mt: 2 }}>
                <ListItemText primary={t("nav.bookTime")} primaryTypographyProps={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 22, letterSpacing: "0.18em", textAlign: "center" }} />
              </ListItemButton>
            </List>
            <Box sx={{ px: 3, mt: 3, display: "flex", alignItems: "center", gap: 1 }}>
              <DarkModeToggle light />
              <LanguagePicker light />
            </Box>
          </Box>
        </Drawer>
      </AppBar>
    </Box>
  );
}
