import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import MemberProvider from './context/MemberProvider';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MemberProvider>
      <App />
    </MemberProvider>
  </StrictMode>
);
