export type SubjectKey = "ibrahim" | "john" | "sharaf" | "lordina";

export interface SubjectIdentity {
  key: SubjectKey;
  fullName: string;
  title: string;
  tagline: string;
  hero: string;
  primaryColor: string;
  accentColor: string;
}
