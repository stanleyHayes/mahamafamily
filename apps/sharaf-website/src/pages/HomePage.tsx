import { SUBJECT } from "../config.js";
import { IbrahimHome } from "./home/IbrahimHome.js";
import { JohnHome } from "./home/JohnHome.js";
import { SharafHome } from "./home/SharafHome.js";
import { LordinaHome } from "./home/LordinaHome.js";

export function HomePage() {
  if (SUBJECT === "lordina") return <LordinaHome />;
  if (SUBJECT === "john") return <JohnHome />;
  if (SUBJECT === "sharaf") return <SharafHome />;
  return <IbrahimHome />;
}
