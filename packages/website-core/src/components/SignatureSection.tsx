import { Box, Container, Grid, Typography, Stack } from "@mui/material";
import type { VentureDTO, EventDTO, AchievementDTO, PhilanthropyDTO, SubjectKey } from "@mahama/shared-types";
import { resolveLocalized } from "@mahama/shared-types";

/**
 * Subject-specific anchor section on the home page:
 *   - Ibrahim → "The Industrial Ledger" (mining annual-report aesthetic)
 *   - John → "Public Service" (chronological roll of offices held)
 *   - Sharaf → "The Bukom Card" (fight-night poster ledger)
 */
export function SignatureSection(props: {
  subject: SubjectKey;
  ventures?: VentureDTO[];
  events?: EventDTO[];
  achievements?: AchievementDTO[];
  philanthropy?: PhilanthropyDTO[];
}) {
  const { subject } = props;
  if (subject === "ibrahim") return <IndustrialLedger ventures={props.ventures ?? []} philanthropy={props.philanthropy ?? []} />;
  if (subject === "john") return <PublicService achievements={props.achievements ?? []} />;
  return <BukomCard events={props.events ?? []} />;
}

function IndustrialLedger({ ventures, philanthropy }: { ventures: VentureDTO[]; philanthropy: PhilanthropyDTO[] }) {
  // Pull every metric from every venture into a single ledger
  const rows = ventures.flatMap((v) => v.metrics.map((m) => ({ venture: v.name, sector: v.sector, label: m.label, value: m.value })));
  const philThisDecade = philanthropy.filter((p) => /^20[12]/.test(p.year));

  return (
    <Box sx={{ background: "#08090C", color: "#F2EDE2", py: { xs: 10, md: 16 }, position: "relative" }}>
      <Container maxWidth="lg">
        <Stack direction="row" spacing={3} alignItems="baseline" sx={{ mb: 8 }}>
          <Typography sx={{ fontFamily: '"Playfair Display", serif', color: "#C9A227", fontSize: { xs: 60, md: 96 }, lineHeight: 1, fontWeight: 600 }}>
            01
          </Typography>
          <Box>
            <Typography sx={{ fontSize: 12, letterSpacing: "0.32em", color: "#C9A227", textTransform: "uppercase", mb: 1 }}>
              The Industrial Ledger
            </Typography>
            <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 32, md: 48 }, lineHeight: 1.05, maxWidth: 680 }}>
              From a single yard in 1997 to West Africa's largest indigenous mining-services group.
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={0} sx={{ borderTop: "1px solid rgba(242,237,226,0.12)", borderBottom: "1px solid rgba(242,237,226,0.12)" }}>
          {rows.slice(0, 8).map((r, i) => (
            <Grid
              item
              xs={6}
              md={3}
              key={`${r.venture}-${r.label}-${i}`}
              sx={{
                p: { xs: 2, md: 4 },
                borderRight: { md: i % 4 < 3 ? "1px solid rgba(242,237,226,0.10)" : "none" },
                borderBottom: { xs: i < rows.slice(0, 8).length - 2 ? "1px solid rgba(242,237,226,0.10)" : "none", md: i < 4 ? "1px solid rgba(242,237,226,0.10)" : "none" },
              }}
            >
              <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 36, md: 56 }, lineHeight: 1, color: "#F2EDE2", mb: 1 }}>
                {r.value}
              </Typography>
              <Typography sx={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C9A227", mb: 0.5 }}>
                {r.label}
              </Typography>
              <Typography sx={{ fontSize: 12, opacity: 0.6, fontFamily: '"Inter", sans-serif' }}>{r.venture}</Typography>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={6} sx={{ mt: 6 }}>
          <Grid item xs={12} md={5} >
            <Typography sx={{ fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: "#C9A227", mb: 2 }}>
              Standing operations
            </Typography>
            {ventures.slice(0, 5).map((v) => (
              <Box key={v.id} sx={{ py: 2, borderBottom: "1px solid rgba(242,237,226,0.08)" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                  <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: 22 }}>{v.name}</Typography>
                  <Typography sx={{ fontSize: 11, opacity: 0.55, letterSpacing: "0.16em", textTransform: "uppercase" }}>
                    {v.founded ?? "—"}
                  </Typography>
                </Stack>
                <Typography sx={{ fontSize: 13, opacity: 0.6, mt: 0.5 }}>{v.sector}</Typography>
              </Box>
            ))}
          </Grid>
          <Grid item xs={12} md={6} sx={{ ml: { md: "auto" } }}>
            <Typography sx={{ fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: "#C9A227", mb: 2 }}>
              Recent giving
            </Typography>
            {philThisDecade.slice(0, 4).map((p) => (
              <Box key={p.id} sx={{ py: 2, borderBottom: "1px solid rgba(242,237,226,0.08)" }}>
                <Stack direction="row" spacing={3} alignItems="baseline">
                  <Typography sx={{ fontSize: 13, opacity: 0.55, fontFamily: '"Inter", sans-serif', minWidth: 56 }}>{p.year}</Typography>
                  <Box>
                    <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: 20, lineHeight: 1.3 }}>{p.title}</Typography>
                    <Typography sx={{ fontSize: 13, opacity: 0.62, mt: 0.5 }}>{p.beneficiary}</Typography>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function PublicService({ achievements }: { achievements: AchievementDTO[] }) {
  // Build a chronological roll-call out of achievements
  const sorted = [...achievements].sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <Box sx={{ background: "#FBF8F1", color: "#0F1A14", py: { xs: 10, md: 16 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} >
          <Grid item xs={12} md={4} >
            <Typography sx={{ fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: "#0B4F2C", mb: 2 }}>
              Public Service
            </Typography>
            <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 36, md: 52 }, lineHeight: 1.1, color: "#0B4F2C" }}>
              Three decades in the service of the Republic.
            </Typography>
            <Box sx={{ mt: 4, pl: 3, borderLeft: "3px solid #D4AF37" }}>
              <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 22, lineHeight: 1.5 }}>
                "The work begins immediately."
              </Typography>
              <Typography sx={{ mt: 1, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "#0B4F2C" }}>
                Acceptance speech, 9 December 2024
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={8} >
            <Box sx={{ borderTop: "2px solid #0B4F2C" }}>
              {sorted.map((a) => (
                <Stack
                  key={a.id}
                  direction="row"
                  spacing={4}
                  sx={{
                    py: 3,
                    borderBottom: "1px solid rgba(11,79,44,0.18)",
                    alignItems: "baseline",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      fontSize: 32,
                      color: "#0B4F2C",
                      minWidth: 84,
                    }}
                  >
                    {a.year}
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 20, md: 24 }, lineHeight: 1.3 }}>
                      {a.title}
                    </Typography>
                    {a.awarder && (
                      <Typography sx={{ mt: 0.5, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "#0B4F2C", opacity: 0.72 }}>
                        {a.awarder}
                      </Typography>
                    )}
                    <Typography sx={{ mt: 1, fontSize: 14, opacity: 0.78 }}>{a.description}</Typography>
                  </Box>
                </Stack>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function BukomCard({ events }: { events: EventDTO[] }) {
  const card = [...events].sort((a, b) => +new Date(b.startsAt) - +new Date(a.startsAt));

  return (
    <Box sx={{ background: "#0B0B0B", color: "#F4F1ED", py: { xs: 10, md: 14 }, position: "relative", overflow: "hidden" }}>
      <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: "linear-gradient(90deg, #D62828 0%, #E0B73A 50%, #0B4F2C 100%)" }} />
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "baseline" }} spacing={4} sx={{ mb: 8 }}>
          <Box>
            <Typography sx={{ fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: "#E0B73A", mb: 1 }}>
              The Bukom Card
            </Typography>
            <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 44, md: 72 }, lineHeight: 0.95, fontWeight: 600 }}>
              Fight nights, on the record.
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }} />
          <Box sx={{ borderLeft: "1px solid rgba(244,241,237,0.16)", pl: 3, maxWidth: 280 }}>
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic", fontSize: 18, lineHeight: 1.5 }}>
              "Our mission is to build a platform where African fighters shine globally — and Ghana is ready."
            </Typography>
          </Box>
        </Stack>

        <Stack divider={<Box sx={{ borderTop: "1px solid rgba(244,241,237,0.1)" }} />} spacing={0} >
          {card.map((e) => (
            <Grid container spacing={2} key={e.id} sx={{ py: 5, alignItems: "center" }}>
              <Grid item xs={12} md={2} >
                <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: 14, color: "#E0B73A", letterSpacing: "0.1em" }}>
                  {new Date(e.startsAt).toLocaleDateString("en-GB", { month: "short", day: "2-digit" }).toUpperCase()}
                </Typography>
                <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: 64, lineHeight: 1, fontWeight: 600 }}>
                  {new Date(e.startsAt).getFullYear()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6} >
                <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: 30, md: 42 }, lineHeight: 1.05, fontWeight: 600 }}>
                  {resolveLocalized(e.title)}
                </Typography>
                <Typography sx={{ fontSize: 13, opacity: 0.7, mt: 1 }}>{resolveLocalized(e.description)}</Typography>
              </Grid>
              <Grid item xs={12} md={4} >
                <Typography sx={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#E0B73A" }}>
                  {resolveLocalized(e.venue)}
                </Typography>
                <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: 24, mt: 0.5 }}>
                  {resolveLocalized(e.city)}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
