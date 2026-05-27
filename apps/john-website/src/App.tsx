import { lazy, Suspense } from "react";
import type { ReactNode } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Box, LinearProgress } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import { ScheduleFab, Seo, CookieBanner, PageTransition, AnalyticsProvider, RouteFallback, ScrollToTop } from "@mahama/website-core";
import { SUBJECT, SUBJECT_LABELS, api } from "./config.js";
import { SiteHeader } from "./components/SiteHeader.js";
import { SiteFooter } from "./components/SiteFooter.js";
import { HomePage } from "./pages/HomePage.js";

const AboutPage = lazy(() => import("./pages/AboutPage.js").then((m) => ({ default: m.AboutPage })));
const TimelinePage = lazy(() => import("./pages/TimelinePage.js").then((m) => ({ default: m.TimelinePage })));
const VenturesPage = lazy(() => import("./pages/VenturesPage.js").then((m) => ({ default: m.VenturesPage })));
const PhilanthropyPage = lazy(() => import("./pages/PhilanthropyPage.js").then((m) => ({ default: m.PhilanthropyPage })));
const NewsPage = lazy(() => import("./pages/NewsPage.js").then((m) => ({ default: m.NewsPage })));
const NewsPostPage = lazy(() => import("./pages/NewsPostPage.js").then((m) => ({ default: m.NewsPostPage })));
const EventsPage = lazy(() => import("./pages/EventsPage.js").then((m) => ({ default: m.EventsPage })));
const ContactPage = lazy(() => import("./pages/ContactPage.js").then((m) => ({ default: m.ContactPage })));
const BookPage = lazy(() => import("./pages/BookPage.js").then((m) => ({ default: m.BookPage })));
const ReschedulePage = lazy(() => import("./pages/ReschedulePage.js").then((m) => ({ default: m.ReschedulePage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.js").then((m) => ({ default: m.NotFoundPage })));


function T({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}

export function App() {
  const location = useLocation();
  return (
    <AnalyticsProvider domain={import.meta.env.VITE_PLAUSIBLE_DOMAIN} apiHost={import.meta.env.VITE_PLAUSIBLE_API_HOST || "https://plausible.io"} >
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <ScrollToTop />
      <Seo subject={SUBJECT} labels={SUBJECT_LABELS} api={api} />
      <SiteHeader />
      <Box component="main" sx={{ flex: 1 }}>
        <Suspense fallback={<RouteFallback />}>
          <AnimatePresence mode="wait" initial={false} >
            <Routes location={location} key={location.pathname} >
              <Route path="/" element={<T><HomePage /></T>} />
              <Route path="/about" element={<T><AboutPage /></T>} />
              <Route path="/timeline" element={<T><TimelinePage /></T>} />
              <Route path="/ventures" element={<T><VenturesPage /></T>} />
              <Route path="/impact" element={<T><PhilanthropyPage /></T>} />
              <Route path="/news" element={<T><NewsPage /></T>} />
              <Route path="/news/:slug" element={<T><NewsPostPage /></T>} />
              <Route path="/events" element={<T><EventsPage /></T>} />
              <Route path="/contact" element={<T><ContactPage /></T>} />
              <Route path="/book" element={<T><BookPage /></T>} />
              <Route path="/book/:slug" element={<T><BookPage /></T>} />
              <Route path="/reschedule/:id" element={<T><ReschedulePage /></T>} />
              <Route path="*" element={<T><NotFoundPage /></T>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </Box>
      <SiteFooter />
      <ScheduleFab subject={SUBJECT} />
      <CookieBanner />
    </Box>
    </AnalyticsProvider>
  );
}
