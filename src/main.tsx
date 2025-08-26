import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import './index.css';
import App from './App.tsx';
import './i18n';

WebApp.ready();
WebApp.expand();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
