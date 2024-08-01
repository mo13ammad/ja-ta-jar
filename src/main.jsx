import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { HelmetProvider } from 'react-helmet-async'; // Import HelmetProvider
import { logPageView } from './analytics';
import { useLocation } from 'react-router-dom';

// Main component to handle page view logging
const Main = () => {
  const location = useLocation();

  React.useEffect(() => {
    logPageView();
  }, [location.pathname]);

  return <App />;
};

// Create a root and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
    <HelmetProvider> {/* Wrap with HelmetProvider */}
      <Main />
    </HelmetProvider>
  </Router>
);
