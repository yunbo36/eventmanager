import React from 'react';
import { Link } from 'react-router-dom';

const TopPage = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">トップページ</h1>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link to="/setup" className="text-blue-500 hover:underline">セットアップ</Link>
          </li>
          <li>
            <Link to="/pc-reception" className="text-blue-500 hover:underline">PC受付</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default TopPage;