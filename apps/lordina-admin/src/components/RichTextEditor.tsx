import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Box, ToggleButton, ToggleButtonGroup, Stack, IconButton, Tooltip } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import { useEffect } from "react";

interface Props {
  value?: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        bulletList: {},
        orderedList: {},
      }),
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer" } }),
      Placeholder.configure({ placeholder: placeholder ?? "Write the body…" }),
    ],
    content: value ?? "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    if (value && value !== editor.getHTML()) editor.commands.setContent(value);
  }, [value, editor]);

  if (!editor) return null;

  const heading = editor.isActive("heading", { level: 2 }) ? "h2" : editor.isActive("heading", { level: 3 }) ? "h3" : "p";

  return (
    <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
      <Stack direction="row" spacing={0.5} sx={{ p: 1, borderBottom: "1px solid", borderColor: "divider", flexWrap: "wrap", gap: 0.5 }}>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={heading}
          onChange={(_, v) => {
            if (!v) return;
            if (v === "p") editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level: v === "h2" ? 2 : 3 }).run();
          }}
        >
          <ToggleButton value="p">P</ToggleButton>
          <ToggleButton value="h2">H2</ToggleButton>
          <ToggleButton value="h3">H3</ToggleButton>
        </ToggleButtonGroup>
        <Box sx={{ width: 1, alignSelf: "stretch", bgcolor: "divider", mx: 0.5 }} />
        <Tooltip title="Bold"><IconButton size="small" color={editor.isActive("bold") ? "primary" : "default"} onClick={() => editor.chain().focus().toggleBold().run()}><FormatBoldIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Italic"><IconButton size="small" color={editor.isActive("italic") ? "primary" : "default"} onClick={() => editor.chain().focus().toggleItalic().run()}><FormatItalicIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Quote"><IconButton size="small" color={editor.isActive("blockquote") ? "primary" : "default"} onClick={() => editor.chain().focus().toggleBlockquote().run()}><FormatQuoteIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Bulleted list"><IconButton size="small" color={editor.isActive("bulletList") ? "primary" : "default"} onClick={() => editor.chain().focus().toggleBulletList().run()}><FormatListBulletedIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Numbered list"><IconButton size="small" color={editor.isActive("orderedList") ? "primary" : "default"} onClick={() => editor.chain().focus().toggleOrderedList().run()}><FormatListNumberedIcon fontSize="small" /></IconButton></Tooltip>
        <Box sx={{ width: 1, alignSelf: "stretch", bgcolor: "divider", mx: 0.5 }} />
        <Tooltip title="Link">
          <IconButton size="small" color={editor.isActive("link") ? "primary" : "default"} onClick={() => {
            const url = prompt("URL");
            if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}><LinkIcon fontSize="small" /></IconButton>
        </Tooltip>
        <Tooltip title="Unlink"><IconButton size="small" onClick={() => editor.chain().focus().unsetLink().run()}><LinkOffIcon fontSize="small" /></IconButton></Tooltip>
        <Box sx={{ flex: 1 }} />
        <Tooltip title="Undo"><IconButton size="small" onClick={() => editor.chain().focus().undo().run()}><UndoIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Redo"><IconButton size="small" onClick={() => editor.chain().focus().redo().run()}><RedoIcon fontSize="small" /></IconButton></Tooltip>
      </Stack>
      <Box
        sx={{
          p: 2,
          minHeight: 240,
          "& .ProseMirror": {
            outline: "none",
            "& p": { mb: 1.5, lineHeight: 1.7 },
            "& h2": { fontFamily: '"Playfair Display", serif', fontSize: 28, mt: 2, mb: 1 },
            "& h3": { fontFamily: '"Playfair Display", serif', fontSize: 22, mt: 2, mb: 1 },
            "& blockquote": { borderLeft: "3px solid", borderColor: "secondary.main", pl: 2, fontStyle: "italic", color: "text.secondary" },
            "& a": { color: "primary.main" },
            "& ul, & ol": { pl: 3 },
            "& p.is-editor-empty:first-of-type::before": {
              content: "attr(data-placeholder)",
              color: "text.disabled",
              float: "left",
              height: 0,
              pointerEvents: "none",
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}
