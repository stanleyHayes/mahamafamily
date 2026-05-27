import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Container, Box, Typography, Stack, Chip, Divider } from "@mui/material";
import { subjectTokens } from "@mahama/ui-theme";
import { useTranslation } from "@mahama/i18n";

import { api, SUBJECT, SUBJECT_LABELS } from "../config.js";
import { normalizeLang } from "@mahama/shared-types";
import { OptimizedImage } from "@mahama/website-core";

const NEWSROOM_LABEL: Record<string, string> = {
  ibrahim: "Dispatches",
  john: "From the Office of the President",
  sharaf: "Newsroom",
  lordina: "From the First Lady's Office",
};

export function NewsPostPage() {
  const { slug } = useParams<{ slug: string} >();
  const { i18n } = useTranslation();
    const post = useQuery({ queryKey: ["news", slug, i18n.language], queryFn: () => api.getNewsPost(slug!, normalizeLang(i18n.language)), enabled: !!slug });
  const tokens = subjectTokens[SUBJECT];
  const eyebrow = NEWSROOM_LABEL[SUBJECT] ?? "Newsroom";

  if (post.isLoading) return <Container sx={{ py: 16 }}>Loading…</Container>;
  if (!post.data) return <Container sx={{ py: 16 }}>Post not found.</Container>;
  const p = post.data;

  return (
    <Container maxWidth="md" sx={{ py: 14 }}>
      <Typography
        sx={{
          color: "secondary.main",
          fontSize: 12,
          letterSpacing: tokens.eyebrowLetterSpacing,
          textTransform: "uppercase",
          mb: 1.5,
        }}
      >
        {eyebrow} · {SUBJECT_LABELS[SUBJECT].name}
      </Typography>
      <Typography variant="h2" sx={{ fontSize: { xs: 38, md: 60 }, lineHeight: 1.05 }}>
        {p.title}
      </Typography>
      <Typography sx={{ color: "text.secondary", fontSize: 13, mt: 2 }}>
        {p.publishedAt && new Date(p.publishedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
        {" · "}by {p.author}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ mt: 2, mb: 4 }} flexWrap="wrap" useFlexGap>
        {p.tags.map((t) => <Chip key={t} size="small" label={t} />)}
      </Stack>
      {p.coverImageUrl && (
        <OptimizedImage
  src={p.coverImageUrl}
  alt={p.title}
  sx={{ width: "100%", borderRadius: 3, mb: 4 }}
/>
      )}
      <Divider sx={{ borderColor: "secondary.main", opacity: 0.4, mb: 4, width: 64, borderBottomWidth: 2 }} />
      <Box sx={{ "& p": { mb: 2.5, fontSize: 19, lineHeight: 1.75 } }}>
        {p.body.split(/\n\n+/).map((para, i) => (
          <Typography component="p" key={i} >{para}</Typography>
        ))}
      </Box>
    </Container>
  );
}
