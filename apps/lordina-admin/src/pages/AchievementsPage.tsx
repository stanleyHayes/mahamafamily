import { CrudPage } from "../components/CrudPage.js";
import { api } from "../config.js";

export function AchievementsPage() {
  return (
    <CrudPage
      resourceKey="achievements"
      resourceLabel="achievement"
      api={api.admin.achievements}
      columns={[
        { field: "title", headerName: "Title", flex: 1 },
        { field: "category", headerName: "Category", width: 130 },
        { field: "year", headerName: "Year", width: 100 },
        { field: "awarder", headerName: "Awarder", flex: 1 },
      ]}
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "category", label: "Category", type: "select", options: ["award", "honour", "milestone", "policy"], required: true },
        { name: "year", label: "Year", required: true },
        { name: "awarder", label: "Awarder" },
        { name: "description", label: "Description", type: "longtext", required: true },
        { name: "imageUrl", label: "Image URL", type: "url" },
        { name: "order", label: "Order", type: "number" },
      ]}
    />
  );
}
