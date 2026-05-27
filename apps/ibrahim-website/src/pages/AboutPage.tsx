import { SUBJECT } from "../config.js";
import { IbrahimAbout } from "./about/IbrahimAbout.js";
import { JohnAbout } from "./about/JohnAbout.js";
import { SharafAbout } from "./about/SharafAbout.js";
import { LordinaAbout } from "./about/LordinaAbout.js";

export function AboutPage() {
  if (SUBJECT === "lordina") return <LordinaAbout />;
  if (SUBJECT === "john") return <JohnAbout />;
  if (SUBJECT === "sharaf") return <SharafAbout />;
  return <IbrahimAbout />;
}
