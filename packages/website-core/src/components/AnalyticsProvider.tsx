import { useEffect, useRef, useState } from "react";

const CONSENT_KEY = "mahama_cookie_consent";

interface AnalyticsProviderProps {
  domain: string;
  apiHost?: string;
  children: React.ReactNode;
}

export function AnalyticsProvider({ domain, apiHost = "https://plausible.io", children }: AnalyticsProviderProps) {
  const [consent, setConsent] = useState<"accepted" | "rejected" | null>(() => {
    if (typeof window === "undefined") return null;
    return (localStorage.getItem(CONSENT_KEY) as "accepted" | "rejected" | null) ?? null;
  });
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === CONSENT_KEY) {
        setConsent((e.newValue as "accepted" | "rejected" | null) ?? null);
      }
    };
    const onConsentChange = () => {
      const value = (localStorage.getItem(CONSENT_KEY) as "accepted" | "rejected" | null) ?? null;
      setConsent(value);
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("mahama:consent-change", onConsentChange);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("mahama:consent-change", onConsentChange);
    };
  }, []);

  useEffect(() => {
    if (consent === "accepted" && !scriptRef.current && domain) {
      const script = document.createElement("script");
      script.defer = true;
      script.setAttribute("data-domain", domain);
      script.src = `${apiHost.replace(/\/$/, "")}/js/script.js`;
      document.head.appendChild(script);
      scriptRef.current = script;
    }
  }, [consent, domain, apiHost]);

  return <>{children}</>;
}
