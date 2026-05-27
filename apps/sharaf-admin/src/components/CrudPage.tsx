import { useState, useMemo } from "react";
import {
  Box, Card, CardContent, Stack, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Typography, Tooltip, Alert, Skeleton, useTheme, useMediaQuery,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import InboxIcon from "@mui/icons-material/Inbox";
import { DataGrid, type GridColDef, type GridRowParams, type GridColumnVisibilityModel } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LocalizedField } from "./LocalizedField.js";

export interface FieldSpec {
  name: string;
  label: string;
  type?: "text" | "longtext" | "number" | "boolean" | "date" | "select" | "tags" | "url" | "json" | "localized" | "localized-longtext";
  required?: boolean;
  options?: string[];
  helperText?: string;
  defaultValue?: unknown;
}

export interface CrudPageProps<T extends { id: string }> {
  resourceLabel: string;
  fields: FieldSpec[];
  columns: GridColDef[];
  api: {
    list: (q?: { page?: number; pageSize?: number; search?: string }) => Promise<{ items: T[]; total: number; page: number; pageSize: number }>;
    create: (data: Partial<T>) => Promise<T>;
    update: (id: string, data: Partial<T>) => Promise<T>;
    remove: (id: string) => Promise<unknown>;
  };
  resourceKey: string;
  defaults?: Partial<T>;
}

function defaultsFromFields(fields: FieldSpec[]): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  fields.forEach((f) => {
    obj[f.name] =
      f.defaultValue !== undefined
        ? f.defaultValue
        : f.type === "boolean"
          ? false
          : f.type === "number"
            ? 0
            : f.type === "tags"
              ? []
              : f.type === "json"
                ? []
                : f.type === "localized" || f.type === "localized-longtext"
                  ? { en: "" }
                  : "";
  });
  return obj;
}

export function CrudPage<T extends { id: string }>({ resourceLabel, fields, columns, api, resourceKey, defaults }: CrudPageProps<T>) {
  const qc = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [editing, setEditing] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({});

  const list = useQuery({
    queryKey: [resourceKey, page, pageSize, search],
    queryFn: () => api.list({ page: page + 1, pageSize, search: search || undefined }),
  });

  const create = useMutation({
    mutationFn: (data: Partial<T>) => api.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [resourceKey] }); close(); },
    onError: (e: Error) => setError(e.message),
  });
  const update = useMutation({
    mutationFn: (data: { id: string; patch: Partial<T> }) => api.update(data.id, data.patch),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [resourceKey] }); close(); },
    onError: (e: Error) => setError(e.message),
  });
  const remove = useMutation({
    mutationFn: (id: string) => api.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [resourceKey] }),
  });

  const close = () => { setOpen(false); setEditing(null); setForm({}); setError(null); };
  const startCreate = () => { setForm({ ...defaultsFromFields(fields), ...defaults }); setEditing(null); setOpen(true); };
  const startEdit = (row: T) => { setForm({ ...row }); setEditing(row); setOpen(true); };

  const submit = () => {
    setError(null);
    const payload = serialize(form, fields);
    if (editing) update.mutate({ id: editing.id, patch: payload as Partial<T> });
    else create.mutate(payload as Partial<T>);
  };

  // On mobile, force-hide all but the first 2 data columns + actions
  const effectiveColumnVisibilityModel = useMemo(() => {
    if (!isMobile) return columnVisibilityModel;
    const model: GridColumnVisibilityModel = { ...columnVisibilityModel };
    columns.forEach((col, idx) => {
      if (idx >= 2) model[col.field] = false;
    });
    model.actions = true;
    return model;
  }, [isMobile, columns, columnVisibilityModel]);

  const cols: GridColDef[] = useMemo(() => ([
    ...columns.map((c) => ({ ...c, hideable: true })),
    {
      field: "actions",
      headerName: "",
      sortable: false,
      filterable: false,
      width: 110,
      hideable: false,
      renderCell: (params) => (
        <Stack direction="row">
          <Tooltip title="Edit"><IconButton size="small" onClick={() => startEdit(params.row as T)}><EditIcon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => {
              if (confirm("Delete?")) remove.mutate((params.row as T).id);
            }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ]), [columns]);

  const rows = list.data?.items ?? [];
  const isEmpty = !list.isLoading && rows.length === 0;

  return (
    <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
      <CardContent>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            sx={{ minWidth: { xs: "100%", sm: 240 } }}
          />
          <Box sx={{ flex: 1 }} />
          <Button startIcon={<AddIcon />} variant="contained" onClick={startCreate} sx={{ width: { xs: "100%", sm: "auto" } }}>
            New {resourceLabel}
          </Button>
        </Stack>

        <Box sx={{ position: "relative" }}>
          <DataGrid
            autoHeight
            rows={rows}
            columns={cols}
            rowCount={list.data?.total ?? 0}
            paginationMode="server"
            paginationModel={{ page, pageSize }}
            pageSizeOptions={[10, 20, 50]}
            onPaginationModelChange={(m) => { setPage(m.page); setPageSize(m.pageSize); }}
            getRowId={(r) => (r as T).id}
            loading={list.isLoading}
            disableRowSelectionOnClick
            onRowDoubleClick={(p: GridRowParams) => startEdit(p.row as T)}
            columnVisibilityModel={effectiveColumnVisibilityModel}
            onColumnVisibilityModelChange={setColumnVisibilityModel}
            sx={{
              "& .MuiDataGrid-overlayWrapper": {
                minHeight: 200,
              },
            }}
          />

          {list.isLoading && (
            <Box
              sx={{
                position: "absolute",
                top: 55,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 2,
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(2px)",
                display: "flex",
                flexDirection: "column",
                gap: 1,
                p: 2,
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={42} sx={{ borderRadius: 1 }} />
              ))}
            </Box>
          )}

          {isEmpty && (
            <Box
              sx={{
                position: "absolute",
                top: 55,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                p: 4,
                minHeight: 280,
              }}
            >
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: theme.palette.action.hover,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <InboxIcon sx={{ fontSize: 36, color: "text.secondary" }} />
              </Box>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                No {resourceLabel.toLowerCase()} found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get started by creating a new {resourceLabel.toLowerCase()}.
              </Typography>
              <Button startIcon={<AddIcon />} variant="contained" onClick={startCreate} sx={{ mt: 1 }}>
                New {resourceLabel}
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>

      <Dialog open={open} onClose={close} maxWidth="md" fullWidth fullScreen={isMobile}>
        <DialogTitle sx={{ px: 3, pt: 3, pb: 1.5, fontWeight: 600 }}>
          {editing ? `Edit ${resourceLabel}` : `New ${resourceLabel}`}
        </DialogTitle>
        <DialogContent dividers sx={{ px: 3, py: 2.5 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Stack spacing={2.5}>
            {fields.map((f) => <FieldEditor key={f.name} field={f} value={form[f.name]} onChange={(v) => setForm((s) => ({ ...s, [f.name]: v }))} />)}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={close} variant="outlined" sx={{ borderRadius: 999 }}>
            Cancel
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button variant="contained" onClick={submit} disabled={create.isPending || update.isPending} sx={{ borderRadius: 999 }}>
            {editing ? "Save changes" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

function FieldEditor({ field, value, onChange }: { field: FieldSpec; value: unknown; onChange: (v: unknown) => void }) {
  switch (field.type) {
    case "localized":
      return (
        <LocalizedField
          label={field.label}
          value={value as never}
          onChange={onChange}
          required={field.required}
        />
      );
    case "localized-longtext":
      return (
        <LocalizedField
          label={field.label}
          value={value as never}
          onChange={onChange}
          multiline
          minRows={4}
          required={field.required}
        />
      );
    case "longtext":
      return <TextField label={field.label} fullWidth multiline minRows={4} required={field.required} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} helperText={field.helperText} />;
    case "boolean":
      return (
        <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} spacing={2}>
          <Typography sx={{ minWidth: 140, fontWeight: 500 }}>{field.label}</Typography>
          <Button variant={value ? "contained" : "outlined"} size="small" onClick={() => onChange(!value)}>
            {value ? "Yes" : "No"}
          </Button>
        </Stack>
      );
    case "number":
      return <TextField label={field.label} type="number" fullWidth required={field.required} value={(value as number) ?? 0} onChange={(e) => onChange(Number(e.target.value))} />;
    case "select":
      return (
        <TextField select SelectProps={{ native: true }} label={field.label} fullWidth value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)}>
          <option value="" />
          {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </TextField>
      );
    case "tags":
      return (
        <TextField
          label={`${field.label} (comma separated)`}
          fullWidth
          value={Array.isArray(value) ? (value as string[]).join(", ") : (value as string) ?? ""}
          onChange={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
          helperText={field.helperText}
        />
      );
    case "json":
      return (
        <TextField
          label={field.label}
          fullWidth
          multiline
          minRows={4}
          value={typeof value === "string" ? value : JSON.stringify(value ?? [], null, 2)}
          onChange={(e) => {
            try { onChange(JSON.parse(e.target.value)); } catch { onChange(e.target.value); }
          }}
          helperText={field.helperText ?? "Valid JSON"}
        />
      );
    default:
      return <TextField label={field.label} fullWidth required={field.required} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} helperText={field.helperText} />;
  }
}

function serialize(form: Record<string, unknown>, fields: FieldSpec[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  fields.forEach((f) => {
    const v = form[f.name];
    out[f.name] = v === "" ? undefined : v;
  });
  return out;
}
