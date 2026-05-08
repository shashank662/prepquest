import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));

if (window.location.pathname.startsWith('/amazon')) {
  import('./AmazonSDE.jsx').then(({ default: AmazonSDE }) => {
    root.render(
      <React.StrictMode>
        <AmazonSDE />
      </React.StrictMode>
    );
  });
} else {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
