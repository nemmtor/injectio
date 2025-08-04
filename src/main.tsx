import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from '@/components/ui/sonner';

import './styles.css';
import { App } from './app';
import { Injectio } from './injectio/injectio';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <StrictMode>
    <App />
    <Injectio />
    <Toaster richColors />
  </StrictMode>,
);
