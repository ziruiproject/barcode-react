// App.js
import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Camera from './Camera';
import Home from './Home';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path="home" Component={Home} />
          <Route path="login" Component={Login} />
          <Route path="camera" Component={Camera} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
