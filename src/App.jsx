// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Use either BrowserRouter or Router, not both
import Login from './Login';
import Home from './Home';
import Camera from './Camera';
import ScanHistory from './ScanHistory';
import EventHistory from './EventHistory';
import Report from './Report';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/lapor" element={<Report />} />
        <Route path="/history/scan" element={<ScanHistory />} />
        <Route path="/kejadian" element={<EventHistory />} />
      </Routes>
    </BrowserRouter>
  );
}
