import { Injectio } from '@injectio/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles.css';
import { App } from './app';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Injectio />
  </StrictMode>
);
