import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';

export const context = createContext(0)

const App = () => {
  const [data, setData] = useState(Array(8).fill(5));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    window.location.reload();
  };

  return (
    <context.Provider value={{data, setData}}>
      <Router>
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          {isAuthenticated ? (
            <Route path="/home" element={<Home onLogout={handleLogout} />} />
          ) : (
            <Route path="/home" element={<Navigate to="/" replace />} />
          )}
        </Routes>
      </Router>
    </context.Provider>
  );
};

export default App;
