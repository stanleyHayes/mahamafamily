import { SUBJECT } from "../config.js";
import { IbrahimPortfolio } from "./ventures/IbrahimPortfolio.js";
import { JohnPortfolio } from "./ventures/JohnPortfolio.js";
import { SharafPortfolio } from "./ventures/SharafPortfolio.js";
import { LordinaPortfolio } from "./ventures/LordinaPortfolio.js";

export function VenturesPage() {
  if (SUBJECT === "lordina") return <LordinaPortfolio />;
  if (SUBJECT === "john") return <JohnPortfolio />;
  if (SUBJECT === "sharaf") return <SharafPortfolio />;
  return <IbrahimPortfolio />;
}
