import React from 'react'; // Jangan lupa import React
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/Register.tsx";
import Dashboard from './pages/Dashboard.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Supaya kalau buka localhost:3000 langsung dilempar ke login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;