import { CrudPage } from "../components/CrudPage.js";
import { api } from "../config.js";

export function EventsPage() {
  return (
    <CrudPage
      resourceKey="events"
      resourceLabel="event"
      api={api.admin.events}
      columns={[
        { field: "title", headerName: "Title", flex: 1, valueGetter: (v: unknown) => typeof v === "string" ? v : (v as { en?: string })?.en ?? "" },
        { field: "venue", headerName: "Venue", flex: 1, valueGetter: (v: unknown) => typeof v === "string" ? v : (v as { en?: string })?.en ?? "" },
        { field: "city", headerName: "City", width: 140, valueGetter: (v: unknown) => typeof v === "string" ? v : (v as { en?: string })?.en ?? "" },
        { field: "startsAt", headerName: "When", width: 160 },
      ]}
      fields={[
        { name: "title", label: "Title", type: "localized", required: true },
        { name: "description", label: "Description", type: "localized-longtext", required: true },
        { name: "startsAt", label: "Starts at (ISO date)", required: true },
        { name: "endsAt", label: "Ends at (ISO date)" },
        { name: "venue", label: "Venue", type: "localized", required: true },
        { name: "city", label: "City", type: "localized", required: true },
        { name: "country", label: "Country", required: true, defaultValue: "Ghana" },
        { name: "category", label: "Category", type: "select", options: ["speech", "philanthropy", "business", "sport", "political", "other"], required: true },
        { name: "imageUrl", label: "Image URL", type: "url" },
        { name: "url", label: "Public URL", type: "url" },
        { name: "featured", label: "Featured", type: "boolean" },
      ]}
    />
  );
}
