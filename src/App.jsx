// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Camera from './Camera';
import Home from './Home';
import ScanHistory from './ScanHistory';
import EventHistory from './EventHistory';
import Report from './Report';
import { auth } from './firebase';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="login" element={<Login />} />

        {/* General Route for protected routes */}
        <Route
          path="/*"
          element={isAuthenticated ? (
            <>
              <Route index element={<Home />} />
              <Route path="camera" element={<Camera />} />
              <Route path="lapor" element={<Report />} />
              <Route path="history/scan" element={<ScanHistory />} />
              <Route path="history/kejadian" element={<EventHistory />} />
            </>
          ) : (
            <Navigate to="/login" />
          )}
        />
      </Routes>
    </Router>
  );
};

export default App;
