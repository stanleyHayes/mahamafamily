import { CrudPage } from "../components/CrudPage.js";
import { api } from "../config.js";

export function PhilanthropyPage() {
  return (
    <CrudPage
      resourceKey="philanthropy"
      resourceLabel="programme"
      api={api.admin.philanthropy}
      columns={[
        { field: "title", headerName: "Title", flex: 1 },
        { field: "category", headerName: "Category", width: 150 },
        { field: "year", headerName: "Year", width: 100 },
        { field: "featured", headerName: "Featured", width: 100, type: "boolean" },
      ]}
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "category", label: "Category", type: "select", required: true, options: ["health", "education", "youth", "disaster-relief", "religion", "sports", "other"] },
        { name: "year", label: "Year", required: true },
        { name: "beneficiary", label: "Beneficiary", required: true },
        { name: "summary", label: "Summary", type: "longtext", required: true },
        { name: "amount", label: "Amount" },
        { name: "imageUrl", label: "Image URL", type: "url" },
        { name: "order", label: "Order", type: "number" },
        { name: "featured", label: "Featured", type: "boolean" },
      ]}
    />
  );
}
