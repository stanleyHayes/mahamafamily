import { SUBJECT } from "../config.js";
import { IbrahimHeader } from "./headers/IbrahimHeader.js";
import { JohnHeader } from "./headers/JohnHeader.js";
import { SharafHeader } from "./headers/SharafHeader.js";
import { LordinaHeader } from "./headers/LordinaHeader.js";

export function SiteHeader() {
  if (SUBJECT === "lordina") return <LordinaHeader />;
  if (SUBJECT === "john") return <JohnHeader />;
  if (SUBJECT === "sharaf") return <SharafHeader />;
  return <IbrahimHeader />;
}
