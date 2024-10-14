import React, { useState, useEffect } from 'react';
import { Save, X, Folder } from 'lucide-react';

const SharedFolder = () => {
  const [folderPath, setFolderPath] = useState('');

  useEffect(() => {
    const savedPath = localStorage.getItem('sharedFolderPath');
    if (savedPath) {
      setFolderPath(savedPath);
    }
  }, []);

  const validatePath = (path) => {
    const regex = /^([a-zA-Z]:)?[\\\/]?([^\\\/\0]+(\\|\/))*[^\\\/\0]+$/;
    return regex.test(path);
  };

  const handleSave = () => {
    if (folderPath.trim() && validatePath(folderPath.trim())) {
      localStorage.setItem('sharedFolderPath', folderPath.trim());
      alert('共有フォルダーのパスが保存されました。');
    } else {
      alert('有効なパスを入力してください。');
    }
  };

  const handleClear = () => {
    setFolderPath('');
    localStorage.removeItem('sharedFolderPath');
  };

  const handleFolderSelect = async () => {
    if (window.electronAPI) {
      try {
        const selectedPath = await window.electronAPI.openFolderDialog();
        if (selectedPath) {
          setFolderPath(selectedPath);
        }
      } catch (error) {
        console.error('フォルダー選択エラー:', error);
        alert('フォルダーの選択中にエラーが発生しました。');
      }
    } else {
      alert('この機能はElectronアプリでのみ利用可能です。');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">共有フォルダー設定</h1>
      <div className="mb-4">
        <label htmlFor="folderPath" className="block text-sm font-medium text-gray-700">
          共有フォルダーのパス
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            id="folderPath"
            value={folderPath}
            onChange={(e) => setFolderPath(e.target.value)}
            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
            placeholder="例: C:\Users\YourName\SharedFolder"
          />
          <button
            onClick={handleFolderSelect}
            className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
          >
            <Folder className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Save className="mr-2 h-4 w-4" />
          保存
        </button>
        <button
          onClick={handleClear}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <X className="mr-2 h-4 w-4" />
          削除
        </button>
      </div>
      {folderPath && (
        <p className="mt-4 text-sm text-gray-600">
          現在の共有フォルダーパス: {folderPath}
        </p>
      )}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">パスの例</h2>
        <ul className="list-disc list-inside text-sm text-gray-600">
          <li>Windows: C:\Users\YourName\SharedFolder</li>
          <li>macOS: /Users/YourName/SharedFolder</li>
          <li>Linux: /home/YourName/SharedFolder</li>
        </ul>
      </div>
    </div>
  );
};

export default SharedFolder;