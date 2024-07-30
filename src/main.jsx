import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { HelmetProvider } from "react-helmet-async";
import './index.css';
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://a936d8b26a350d3e45639e28a0fbe407@debug.viraup.com/2",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
