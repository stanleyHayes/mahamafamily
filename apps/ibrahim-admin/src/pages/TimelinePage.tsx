import { CrudPage } from "../components/CrudPage.js";
import { api } from "../config.js";

export function TimelinePage() {
  return (
    <CrudPage
      resourceKey="timeline"
      resourceLabel="entry"
      api={api.admin.timeline}
      columns={[
        { field: "year", headerName: "Year", width: 100 },
        { field: "title", headerName: "Title", flex: 1 },
        { field: "category", headerName: "Category", width: 140 },
        { field: "order", headerName: "Order", width: 90 },
      ]}
      fields={[
        { name: "year", label: "Year", required: true },
        { name: "date", label: "Date (YYYY-MM-DD)", required: true },
        { name: "title", label: "Title", required: true },
        { name: "description", label: "Description", type: "longtext", required: true },
        { name: "category", label: "Category", type: "select", options: ["education", "career", "political", "philanthropy", "personal", "award", "other"], required: true },
        { name: "imageUrl", label: "Image URL", type: "url" },
        { name: "order", label: "Order", type: "number", defaultValue: 100 },
      ]}
    />
  );
}
