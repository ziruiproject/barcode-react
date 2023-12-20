// App.js
import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Camera from './Camera';
import Home from './Home';
import ScanHistory from './ScanHistory';
import EventHistory from './EventHistory';
import Report from './Report';
import { GuardProvider, GuardedRoute } from 'react-router-guards'; import { GuardProvider, GuardedRoute } from 'react-router-guards';
import { auth } from "./firebase";

const App = () => {

  const isAuthenticated = () => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log(user);
      if (!user) {
        window.location.replace('/login');
      }
    });

    return () => unsubscribe;
  }

  return (
    <BrowserRouter>
      <GuardProvider>
        <Route path="/">
          <Route path="" Component={Home} />
          <Route path="login" Component={Login} />
          <Route path="camera" Component={Camera} />
          <Route path="lapor" Component={Report} />
        </Route>
        <Route path='/history'>
          <Route path="scan" Component={ScanHistory} />
          <Route path="kejadian" Component={EventHistory} />
        </Route>
      </GuardProvider>
    </BrowserRouter>
  );
};

export default App;
