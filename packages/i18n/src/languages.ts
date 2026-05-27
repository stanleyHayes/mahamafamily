export interface LanguageDef {
  code: string;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const LANGUAGES: LanguageDef[] = [
  { code: "en", label: "English", nativeLabel: "English", flag: "GB" },
  { code: "tw", label: "Twi", nativeLabel: "Twi", flag: "GH" },
  { code: "ha", label: "Hausa", nativeLabel: "Hausa", flag: "NG" },
  { code: "ee", label: "Ewe", nativeLabel: "Eʋegbe", flag: "GH" },
  { code: "fr", label: "French", nativeLabel: "Français", flag: "FR" },
];

export const DEFAULT_LANG = "en";
