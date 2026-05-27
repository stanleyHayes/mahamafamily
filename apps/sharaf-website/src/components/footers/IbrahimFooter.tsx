import { Box, Container, Grid, Typography, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@mahama/i18n";
import { api } from "../../config.js";
import { BlueprintGrid } from "@mahama/website-core";
import { NewsletterSignup, trackEvent } from "@mahama/website-core";

interface LedgerRow {
  value: string;
  label: string;
  hint?: string;
}

export function IbrahimFooter() {
  const { t } = useTranslation();
  const settings = useQuery({ queryKey: ["settings"], queryFn: () => api.getSettings() });
  const ventures = useQuery({ queryKey: ["ventures"], queryFn: () => api.listVentures() });
  const year = new Date().getFullYear();

  const LEDGER: LedgerRow[] = [
    { value: "3,000+", label: t("footer.ledgerEmployees"), hint: t("footer.ledgerEmployeesHint") },
    { value: "2M T", label: t("footer.ledgerCement"), hint: t("footer.ledgerCementHint") },
    { value: "3", label: t("footer.ledgerCountries"), hint: t("footer.ledgerCountriesHint") },
    { value: "1997", label: t("footer.ledgerFounded"), hint: t("footer.ledgerFoundedHint") },
  ];

  return (
    <Box component="footer" sx={{ background: "#08090C", color: "#F2EDE2", mt: 16, position: "relative", overflow: "hidden", pt: 8, pb: 4 }}>
      <BlueprintGrid />
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        {/* Document header — like an annual report */}
        <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "baseline" }} spacing={3} sx={{ mb: 6 }}>
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.4em", color: "#C9A227", textTransform: "uppercase" }}>
            {t("footer.annualStatement")}
          </Typography>
          <Box sx={{ flex: 1, height: "1px", background: "rgba(201,162,39,0.32)", display: { xs: "none", md: "block" } }} />
          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "rgba(242,237,226,0.55)", textTransform: "uppercase" }}>
            {t("footer.officeOfIbrahim")} · {year}
          </Typography>
        </Stack>

        {/* Ledger row — big numbers, no boxes */}
        <Grid container sx={{ borderTop: "1px solid rgba(201,162,39,0.22)", borderBottom: "1px solid rgba(201,162,39,0.22)", mb: 8 }}>
          {LEDGER.map((r, i) => (
            <Grid
              item
              xs={6}
              md={3}
              key={r.label}
              sx={{
                py: 5,
                px: 4,
                borderRight: { md: i < LEDGER.length - 1 ? "1px solid rgba(201,162,39,0.16)" : "none" },
                borderBottom: { xs: i < LEDGER.length - 2 ? "1px solid rgba(201,162,39,0.16)" : "none", md: "none" },
              }}
            >
              <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 44, md: 64 }, lineHeight: 0.95, color: "#F2EDE2", mb: 1 }}>
                {r.value}
              </Typography>
              <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.28em", color: "#C9A227", textTransform: "uppercase", mb: 0.5 }}>
                {r.label}
              </Typography>
              {r.hint && (
                <Typography sx={{ fontSize: 12, opacity: 0.5, fontFamily: '"IBM Plex Sans", sans-serif' }}>
                  {r.hint}
                </Typography>
              )}
            </Grid>
          ))}
        </Grid>

        {/* Statement body — serif column on left, listings on right */}
        <Grid container spacing={8} >
          <Grid item xs={12} md={6} >
            <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "#C9A227", textTransform: "uppercase", mb: 2 }}>
              {t("footer.noteFromOffice")}
            </Typography>
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 21, lineHeight: 1.55, fontStyle: "italic", color: "rgba(242,237,226,0.92)", maxWidth: 560 }}>
              {t("footer.ibrahimStatement")}
            </Typography>
            {settings.data?.contactEmail && (
              <Typography sx={{ mt: 3, fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 14 }}>
                <Box component="a" href={`mailto:${settings.data.contactEmail}`} sx={{ color: "#C9A227", textDecoration: "none", borderBottom: "1px solid rgba(201,162,39,0.4)", pb: 0.25 }}>
                  {settings.data.contactEmail}
                </Box>
              </Typography>
            )}
            <Box sx={{ mt: 3 }}>
              <NewsletterSignup
                onSubscribe={async (email) => {
                  await api.subscribeNewsletter({ email, source: window.location.hostname });
                  trackEvent("newsletter_subscribed");
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6} >
            <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: "0.32em", color: "#C9A227", textTransform: "uppercase", mb: 2 }}>
              {t("footer.operatingEntities")}
            </Typography>
            <Stack divider={<Box sx={{ borderTop: "1px solid rgba(201,162,39,0.16)" }} />}>
              {(ventures.data ?? []).slice(0, 4).map((v) => (
                <Stack key={v.id} direction="row" justifyContent="space-between" alignItems="baseline" sx={{ py: 1.6 }}>
                  <Box>
                    <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: 18 }}>{v.name}</Typography>
                    <Typography sx={{ fontSize: 12, opacity: 0.55, fontFamily: '"IBM Plex Sans", sans-serif' }}>{v.sector}</Typography>
                  </Box>
                  <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: "rgba(242,237,226,0.5)", letterSpacing: "0.16em" }}>
                    {v.founded ?? "—"}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            <Stack direction="row" spacing={3} sx={{ mt: 4, opacity: 0.62, fontSize: 12, fontFamily: '"IBM Plex Sans", sans-serif', flexWrap: "wrap", rowGap: 1 }}>
              {[
                { to: "/about", label: t("nav.biography") },
                { to: "/timeline", label: t("nav.chronicle") },
                { to: "/impact", label: t("nav.philanthropy") },
                { to: "/news", label: t("nav.press") },
                { to: "/book", label: t("nav.schedule") },
              ].map((l) => (
                <Box key={l.to} component={RouterLink} to={l.to} sx={{ color: "inherit", textDecoration: "none", "&:hover": { color: "#C9A227" } }}>
                  {l.label}
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Closing rule + signature mark */}
        <Box sx={{ mt: 10, pt: 4, borderTop: "1px solid rgba(201,162,39,0.32)" }}>
          <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }} spacing={2} >
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 22, color: "#C9A227", letterSpacing: "0.04em" }}>
              Ad astra per aspera.
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Stack direction="row" spacing={4} alignItems="center" sx={{ opacity: 0.45 }}>
              <Typography sx={{ fontSize: 11, fontFamily: '"IBM Plex Mono", monospace', letterSpacing: "0.28em", textTransform: "uppercase" }}>
                © {year} {settings.data?.footerText ?? t("footer.officeOfIbrahim")}
              </Typography>
              <Typography sx={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 28,
                color: "#C9A227",
                opacity: 0.9,
                fontStyle: "italic",
              }}>
                I.M.
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
