import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

const rootElement = document.getElementById('root');

if (rootElement) {
  if (rootElement.hasChildNodes()) {
    hydrateRoot(
      rootElement,
      <StrictMode>
        <HashRouter>
          <App />
        </HashRouter>
      </StrictMode>
    );
  } else {
    createRoot(rootElement).render(
      <StrictMode>
        <HashRouter>
          <App />
        </HashRouter>
      </StrictMode>
    );
  }
}
