import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { Folder } from 'lucide-react';

// ... (既存のコード)

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">
        パス選択: レベル {currentLevel}
      </h1>
      <button
        onClick={handleBack}
        className="mb-4 bg-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        戻る
      </button>
      {isFinalPage ? (
        <div>
          <p className="mb-4">生成されたパス: {fullPath}</p>
          <div className="flex space-x-4">
            <Link
              to={`/final-page?${location.search}`}
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 inline-block"
            >
              受付情報登録へ
            </Link>
            <button
              onClick={handleOpenFolder}
              className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
            >
              <Folder className="mr-2" size={20} />
              フォルダーを開く
            </button>
          </div>
        </div>
      ) : (
        <ul className="space-y-2">
          {uniqueValues.map((value, index) => (
            <li key={index}>
              <Link
                to={getNextUrl(value)}
                className="text-blue-500 hover:underline"
              >
                {value}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PathNavigation;