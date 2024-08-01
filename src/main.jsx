import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import App from './App';
import { logPageView } from './analytics';

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
    <Main />
  </Router>
);
