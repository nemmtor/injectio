import { Injectio } from '@injectio/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Toaster } from '@/components/ui/sonner';

import './styles.css';
import { RegistryProvider } from '@effect-atom/atom-react';
import { App } from './app';

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
