
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import ViewPage from './pages/ViewPage';

const App: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-red-600 via-red-800 to-black min-h-screen text-white font-sans selection:bg-red-400 selection:text-white">
      <HashRouter>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/view/:id" element={<ViewPage />} />
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;
