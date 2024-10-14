import React from 'react';
import { Link } from 'react-router-dom';

const TopPage = () => {
  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <button
          className="bg-green-500 hover:bg-green-600 text-white text-3xl py-4 px-8 rounded-lg shadow-md transition"
          onClick={() => window.location.href = '/pc-reception'}>
          PC受付
        </button>
      </div>
      <div className="fixed bottom-5 right-5 text-sm text-gray-500 underline cursor-pointer hover:text-gray-700">
        <Link to="/setup">管理設定</Link>
      </div>
    </div>
  );
};

export default TopPage;