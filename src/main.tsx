import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css';
import 'swiper/css/navigation';
import App from '@/app/App';
import '@/styles/index.css';
import { tw } from '@/shared/lib/tailwind';

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .catch((error: unknown) => console.error('Service worker registration failed:', error));
  });
}

const globalTailwindClasses = tw('appBody').split(' ').filter(Boolean);
document.documentElement.classList.add(...globalTailwindClasses);
document.body.classList.add(...globalTailwindClasses);

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('The application root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
