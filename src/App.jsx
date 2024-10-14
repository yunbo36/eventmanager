import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, LogOut, Home, ArrowLeft } from 'lucide-react';
import TopPage from './components/TopPage';
import Setup from './components/Setup';
import FileUpload from './components/FileUpload';
import SharedFolder from './components/SharedFolder';
import UserRegistration from './components/UserRegistration';
import GeneratedPaths from './components/GeneratedPaths';
import PCReception from './components/PCReception';
import PathNavigation from './components/PathNavigation';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dummyUser = { username: 'user', password: 'password' };

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    if (username === dummyUser.username && password === dummyUser.password) {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      alert('ユーザー名またはパスワードが間違っています。');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex-shrink-0 flex items-center text-blue-500 hover:text-blue-700 mr-4">
                  <Home className="mr-2" size={20} />
                  ホーム
                </Link>
                <BackButton />
              </div>
              <div className="flex items-center">
                {isLoggedIn && (
                  <button
                    onClick={handleLogout}
                    className="text-sm bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center"
                  >
                    <LogOut className="mr-2" size={16} />
                    ログアウト
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<TopPage />} />
            <Route path="/pc-reception" element={<PCReception />} />
            <Route
              path="/setup"
              element={isLoggedIn ? <Setup /> : <Navigate to="/login" />}
            />
            <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} />
            <Route path="/file-upload" element={<FileUpload />} />
            <Route path="/shared-folder" element={<SharedFolder />} />
            <Route path="/user-registration" element={<UserRegistration />} />
            <Route path="/generated-paths" element={<GeneratedPaths />} />
            <Route path="/path-navigation/:level" element={<PathNavigation />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const LoginPage = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">ログイン</h1>
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
          onClick={() => handleLogin(username, password)}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <LogIn className="inline mr-2" size={20} />
          ログイン
        </button>
      </div>
    </div>
  );
};

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/') {
    return null;
  }

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center text-gray-500 hover:text-gray-700"
    >
      <ArrowLeft className="mr-2" size={20} />
      戻る
    </button>
  );
};

export default App;