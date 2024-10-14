import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

const UserRegistration = () => {
  const [names, setNames] = useState('');

  useEffect(() => {
    const savedNames = localStorage.getItem('userNames');
    if (savedNames) {
      setNames(savedNames);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('userNames', names);
    alert('ユーザー名が保存されました。');
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">ユーザー登録</h1>
      <p className="mb-2">受付担当者の名前を1行に1人ずつ入力してください。</p>
      <textarea
        value={names}
        onChange={(e) => setNames(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        rows="10"
        placeholder="例：
山田太郎
佐藤花子
鈴木一郎"
      />
      <button
        onClick={handleSave}
        className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
      >
        <Save className="mr-2" size={20} />
        保存
      </button>
    </div>
  );
};

export default UserRegistration;