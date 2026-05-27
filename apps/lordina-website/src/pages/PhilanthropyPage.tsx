import { SUBJECT } from "../config.js";
import { IbrahimImpact } from "./impact/IbrahimImpact.js";
import { JohnImpact } from "./impact/JohnImpact.js";
import { SharafImpact } from "./impact/SharafImpact.js";
import { LordinaImpact } from "./impact/LordinaImpact.js";

export function PhilanthropyPage() {
  if (SUBJECT === "lordina") return <LordinaImpact />;
  if (SUBJECT === "john") return <JohnImpact />;
  if (SUBJECT === "sharaf") return <SharafImpact />;
  return <IbrahimImpact />;
}
