/* eslint-disable import/default, import/no-named-as-default-member */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/App';
import './index.css';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, unicorn/prefer-query-selector
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
