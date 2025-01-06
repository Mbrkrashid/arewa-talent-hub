import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import { AppProviders } from './contexts/AppProviders';
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <Router>
    <AppProviders>
      <App />
    </AppProviders>
  </Router>
);