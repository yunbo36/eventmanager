import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">管理者ダッシュボード</h1>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link to="/setup" className="text-blue-500 hover:underline">セットアップ</Link>
          </li>
          <li>
            <Link to="/file-upload" className="text-blue-500 hover:underline">ファイルアップロード</Link>
          </li>
          <li>
            <Link to="/shared-folder" className="text-blue-500 hover:underline">共有フォルダー設定</Link>
          </li>
          <li>
            <Link to="/user-registration" className="text-blue-500 hover:underline">ユーザー登録</Link>
          </li>
          <li>
            <Link to="/generated-paths" className="text-blue-500 hover:underline">生成されたパス</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminDashboard;