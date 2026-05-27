import { SUBJECT } from "../config.js";
import { IbrahimNews } from "./news/IbrahimNews.js";
import { JohnNews } from "./news/JohnNews.js";
import { SharafNews } from "./news/SharafNews.js";
import { LordinaNews } from "./news/LordinaNews.js";

export function NewsPage() {
  if (SUBJECT === "lordina") return <LordinaNews />;
  if (SUBJECT === "john") return <JohnNews />;
  if (SUBJECT === "sharaf") return <SharafNews />;
  return <IbrahimNews />;
}
