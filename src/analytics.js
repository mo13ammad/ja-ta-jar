// src/analytics.js
export const logPageView = () => {
    if (window.gtag) {
      gtag('config', 'G-RPDQBJSBH4', {
        page_path: window.location.pathname,
      });
    }
  };
  
  export const logEvent = (action, category, label) => {
    if (window.gtag) {
      gtag('event', action, {
        event_category: category,
        event_label: label,
      });
    }
  };
  