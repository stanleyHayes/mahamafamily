import { SUBJECT } from "../config.js";
import { IbrahimFooter } from "./footers/IbrahimFooter.js";
import { JohnFooter } from "./footers/JohnFooter.js";
import { SharafFooter } from "./footers/SharafFooter.js";
import { LordinaFooter } from "./footers/LordinaFooter.js";

export function SiteFooter() {
  if (SUBJECT === "lordina") return <LordinaFooter />;
  if (SUBJECT === "john") return <JohnFooter />;
  if (SUBJECT === "sharaf") return <SharafFooter />;
  return <IbrahimFooter />;
}
