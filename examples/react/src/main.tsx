import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Injectio } from '@injectio/react';

import { Toaster } from '@/components/ui/sonner';

import './styles.css';
import { App } from './app';
import { RegistryProvider } from '@effect-atom/atom-react';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <StrictMode>
    <RegistryProvider>
      <App />
      <Injectio />
      <Toaster richColors />
    </RegistryProvider>
  </StrictMode>,
);
