import { ApiClient } from "@mahama/api-client";
import type { FlattenLocalized, EventDTO } from "@mahama/shared-types";

const api = new ApiClient({ baseUrl: "" });
const p = api.listEvents("en");
type Inferred = Awaited<typeof p>;
const x: Inferred = {} as FlattenLocalized<EventDTO>[];
