import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import PCReception from './PCReception';
import PathNavigation from './PathNavigation';

const ClientDashboard = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">クライアントダッシュボード</h1>
      <nav className="mb-4">
        <ul className="space-y-2">
          <li>
            <Link to="/client/pc-reception" className="text-blue-500 hover:underline">PC受付</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="pc-reception" element={<PCReception />} />
        <Route path="path-navigation/:level" element={<PathNavigation />} />
      </Routes>
    </div>
  );
};

export default ClientDashboard;