// Import necessary dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css'

// Use createRoot to render your app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render your app within the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
