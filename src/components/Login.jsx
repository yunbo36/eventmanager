import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const dummyUser = { username: 'admin', password: 'password' };

  const handleLogin = () => {
    console.log('ログイン処理開始'); // デバッグ用ログ
    if (username === dummyUser.username && password === dummyUser.password) {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/'); // トップページに遷移
    } else {
      alert('ユーザー名またはパスワードが間違っています。');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">管理者ログイン</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded-md"
          placeholder="ユーザー名"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          placeholder="パスワード"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <LogIn className="inline mr-2" size={20} />
          ログイン
        </button>
      </div>
    </div>
  );
};

export default Login;