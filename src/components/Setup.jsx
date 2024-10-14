import React from 'react';
import { Link } from 'react-router-dom';

const Setup = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">セットアップ</h1>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link to="/file-upload" className="text-blue-500 hover:underline">リスト送信</Link>
          </li>
          <li>
            <Link to="/shared-folder" className="text-blue-500 hover:underline">共有フォルダー設定</Link>
          </li>
          <li>
            <Link to="/user-registration" className="text-blue-500 hover:underline">ユーザー登録</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Setup;