import { SUBJECT } from "../config.js";
import { IbrahimTimeline } from "./timeline/IbrahimTimeline.js";
import { JohnTimeline } from "./timeline/JohnTimeline.js";
import { SharafTimeline } from "./timeline/SharafTimeline.js";
import { LordinaTimeline } from "./timeline/LordinaTimeline.js";

export function TimelinePage() {
  if (SUBJECT === "lordina") return <LordinaTimeline />;
  if (SUBJECT === "john") return <JohnTimeline />;
  if (SUBJECT === "sharaf") return <SharafTimeline />;
  return <IbrahimTimeline />;
}
