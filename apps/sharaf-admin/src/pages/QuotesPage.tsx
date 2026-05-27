import { CrudPage } from "../components/CrudPage.js";
import { api } from "../config.js";

export function QuotesPage() {
  return (
    <CrudPage
      resourceKey="quotes"
      resourceLabel="quote"
      api={api.admin.quotes}
      columns={[
        { field: "text", headerName: "Quote", flex: 2 },
        { field: "context", headerName: "Context", flex: 1 },
        { field: "featured", headerName: "Featured", width: 100, type: "boolean" },
      ]}
      fields={[
        { name: "text", label: "Quote text", type: "longtext", required: true },
        { name: "context", label: "Context", required: true },
        { name: "date", label: "Date" },
        { name: "source", label: "Source" },
        { name: "featured", label: "Featured", type: "boolean" },
        { name: "order", label: "Order", type: "number" },
      ]}
    />
  );
}
