import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));

const path = window.location.pathname;
if (path.startsWith('/amazon')) window.history.replaceState(null, '', '/sheet');   // old bookmark

if (path.startsWith('/sheet') || path.startsWith('/amazon')) {
  import('./StriverSheet.jsx').then(({ default: StriverSheet }) => {
    root.render(
      <React.StrictMode>
        <StriverSheet />
      </React.StrictMode>
    );
  }).catch((err) => {
    console.error('Failed to load StriverSheet module:', err);
  });
} else {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
