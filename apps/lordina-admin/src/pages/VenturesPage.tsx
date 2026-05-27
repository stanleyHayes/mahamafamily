import { CrudPage } from "../components/CrudPage.js";
import { api } from "../config.js";

export function VenturesPage() {
  return (
    <CrudPage
      resourceKey="ventures"
      resourceLabel="venture"
      api={api.admin.ventures}
      columns={[
        { field: "name", headerName: "Name", flex: 1 },
        { field: "sector", headerName: "Sector", width: 180 },
        { field: "founded", headerName: "Founded", width: 110 },
        { field: "featured", headerName: "Featured", width: 100, type: "boolean" },
      ]}
      fields={[
        { name: "name", label: "Name", required: true },
        { name: "sector", label: "Sector", required: true },
        { name: "founded", label: "Founded (year)" },
        { name: "role", label: "Your role" },
        { name: "summary", label: "Summary", type: "longtext", required: true },
        { name: "highlights", label: "Highlights", type: "json", helperText: "JSON array of strings" },
        { name: "metrics", label: "Metrics", type: "json", helperText: 'JSON array of {"label","value"}' },
        { name: "logoUrl", label: "Logo URL", type: "url" },
        { name: "coverImageUrl", label: "Cover image URL", type: "url" },
        { name: "websiteUrl", label: "Website URL", type: "url" },
        { name: "order", label: "Order", type: "number" },
        { name: "featured", label: "Featured", type: "boolean" },
      ]}
    />
  );
}
