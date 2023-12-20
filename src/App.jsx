// App.js
import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Camera from './Camera';
import Home from './Home';
import ScanHistory from './ScanHistory';
import EventHistory from './EventHistory';
import Report from './Report';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path="home" Component={Home} />
          <Route path="login" Component={Login} />
          <Route path="camera" Component={Camera} />
          <Route path="lapor" Component={Report} />
        </Route>
        <Route path='/history'>
          <Route path="scan" Component={ScanHistory} />
          <Route path="kejadian" Component={EventHistory} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
