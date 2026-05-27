import { SUBJECT } from "../config.js";
import { IbrahimEvents } from "./events/IbrahimEvents.js";
import { JohnEvents } from "./events/JohnEvents.js";
import { SharafEvents } from "./events/SharafEvents.js";
import { LordinaEvents } from "./events/LordinaEvents.js";

export function EventsPage() {
  if (SUBJECT === "lordina") return <LordinaEvents />;
  if (SUBJECT === "john") return <JohnEvents />;
  if (SUBJECT === "sharaf") return <SharafEvents />;
  return <IbrahimEvents />;
}
