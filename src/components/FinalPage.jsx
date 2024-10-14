import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Folder, Save } from 'lucide-react';

const FinalPage = () => {
  const [sharedFolderPath, setSharedFolderPath] = useState('');
  const [fullPath, setFullPath] = useState('');
  const [formData, setFormData] = useState({
    receptionist: '',
    coi: '',
    video: '',
    audio: '',
    pcBrought: false,
    adapterBrought: false,
    adapterBorrowed: false,
    pcOnStage: false,
    os: '',
    memo: ''
  });
  const [isDataSaved, setIsDataSaved] = useState(false);
  const [receptionists, setReceptionists] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedPath = localStorage.getItem('sharedFolderPath');
    if (savedPath) {
      setSharedFolderPath(savedPath);
    }
    loadReceptionists();
    loadFormData();
  }, []);

  useEffect(() => {
    if (sharedFolderPath) {
      const searchParams = new URLSearchParams(location.search);
      const values = Array.from({ length: searchParams.size }, (_, i) => searchParams.get(`value${i + 1}`)).filter(Boolean);
      const pathSeparator = navigator.platform.startsWith('Win') ? '\\' : '/';
      const generatedPath = values.join(pathSeparator);
      setFullPath(`${sharedFolderPath}${pathSeparator}${generatedPath}`);
    }
  }, [sharedFolderPath, location.search]);

  const loadReceptionists = () => {
    const savedNames = localStorage.getItem('userNames');
    if (savedNames) {
      setReceptionists(savedNames.split('\n').filter(name => name.trim() !== ''));
    }
  };

  const loadFormData = () => {
    const savedData = localStorage.getItem(`formData_${fullPath}`);
    if (savedData) {
      setFormData(JSON.parse(savedData));
      setIsDataSaved(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    // LocalStorage に保存
    localStorage.setItem(`formData_${fullPath}`, JSON.stringify(formData));

    // ファイルに保存
    if (window.electronAPI) {
      try {
        const content = Object.entries(formData).map(([key, value]) => `${key}: ${value}`).join('\n');
        const fileName = `${fullPath}/data.txt`;
        await window.electronAPI.saveFile(content, fileName);
        setIsDataSaved(true);
        alert('データが保存されました。');
      } catch (error) {
        console.error('ファイル保存エラー:', error);
        alert('データの保存中にエラーが発生しました。');
      }
    } else {
      alert('この機能はElectronアプリでのみ利用可能です。');
    }
  };

  const handleOpenFolder = async () => {
    if (window.electronAPI) {
      try {
        const normalizedPath = fullPath.replace(/[①-⑳]/g, (match) => {
          const weekdays = ['㈰', '㈪', '㈫', '㈬', '㈭', '㈮', '㈯'];
          const index = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳'.indexOf(match);
          return index !== -1 ? weekdays[index % 7] : match;
        });
        await window.electronAPI.openFolder(normalizedPath);
      } catch (error) {
        console.error('フォルダを開く際にエラーが発生しました:', error);
        alert('フォルダを開けませんでした。パスが正しいか確認してください。');
      }
    } else {
      alert('この機能はElectronアプリでのみ利用可能です。');
    }
  };

  const handleBack = () => {
    const searchParams = new URLSearchParams(location.search);
    const values = Array.from({ length: searchParams.size }, (_, i) => searchParams.get(`value${i + 1}`)).filter(Boolean);
    const level = values.length;
    if (level > 1) {
      searchParams.delete(`value${level}`);
      navigate(`/path-navigation/${level - 1}?${searchParams.toString()}`);
    } else {
      navigate('/pc-reception');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">最終ページ</h1>
      <button
        onClick={handleBack}
        className="mb-4 bg-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        戻る
      </button>
      <p className="mb-4">生成されたパス: {fullPath}</p>
      <button
        onClick={handleOpenFolder}
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center mb-6"
      >
        <Folder className="mr-2" size={20} />
        フォルダーを開く
      </button>

      <h2 className="text-xl font-semibold mb-4">PC受付情報</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="receptionist" className="block font-medium mb-1">受付担当者</label>
          <select
            id="receptionist"
            name="receptionist"
            value={formData.receptionist}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">選択してください</option>
            {receptionists.map((name, index) => (
              <option key={index} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <div>
          <p className="font-medium">COI</p>
          <label className="inline-flex items-center mr-4">
            <input type="radio" name="coi" value="あり" checked={formData.coi === 'あり'} onChange={handleInputChange} className="form-radio" />
            <span className="ml-2">あり</span>
          </label>
          <label className="inline-flex items-center">
            <input type="radio" name="coi" value="なし" checked={formData.coi === 'なし'} onChange={handleInputChange} className="form-radio" />
            <span className="ml-2">なし</span>
          </label>
        </div>

        <div>
          <p className="font-medium">動画</p>
          <label className="inline-flex items-center mr-4">
            <input type="radio" name="video" value="あり" checked={formData.video === 'あり'} onChange={handleInputChange} className="form-radio" />
            <span className="ml-2">あり</span>
          </label>
          <label className="inline-flex items-center">
            <input type="radio" name="video" value="なし" checked={formData.video === 'なし'} onChange={handleInputChange} className="form-radio" />
            <span className="ml-2">なし</span>
          </label>
        </div>

        <div>
          <p className="font-medium">音声</p>
          <label className="inline-flex items-center mr-4">
            <input type="radio" name="audio" value="あり" checked={formData.audio === 'あり'} onChange={handleInputChange} className="form-radio" />
            <span className="ml-2">あり</span>
          </label>
          <label className="inline-flex items-center">
            <input type="radio" name="audio" value="なし" checked={formData.audio === 'なし'} onChange={handleInputChange} className="form-radio" />
            <span className="ml-2">なし</span>
          </label>
        </div>

        <div>
          <p className="font-medium">その他</p>
          <label className="inline-flex items-center">
            <input type="checkbox" name="pcBrought" checked={formData.pcBrought} onChange={handleInputChange} className="form-checkbox" />
            <span className="ml-2">PC持ち込み</span>
          </label>
          <label className="inline-flex items-center ml-4">
            <input type="checkbox" name="adapterBrought" checked={formData.adapterBrought} onChange={handleInputChange} className="form-checkbox" />
            <span className="ml-2">変換アダプター持参</span>
          </label>
          <label className="inline-flex items-center ml-4">
            <input type="checkbox" name="adapterBorrowed" checked={formData.adapterBorrowed} onChange={handleInputChange} className="form-checkbox" />
            <span className="ml-2">変換アダプター貸出</span>
          </label>
          <label className="inline-flex items-center ml-4">
            <input type="checkbox" name="pcOnStage" checked={formData.pcOnStage} onChange={handleInputChange} className="form-checkbox" />
            <span className="ml-2">PC演題上げ</span>
          </label>
        </div>

        <div>
          <p className="font-medium">OS</p>
          <label className="inline-flex items-center mr-4">
            <input type="radio" name="os" value="Win" checked={formData.os === 'Win'} onChange={handleInputChange} className="form-radio" />
            <span className="ml-2">Win</span>
          </label>
          <label className="inline-flex items-center">
            <input type="radio" name="os" value="Mac" checked={formData.os === 'Mac'} onChange={handleInputChange} className="form-radio" />
            <span className="ml-2">Mac</span>
          </label>
        </div>

        <div>
          <label htmlFor="memo" className="block font-medium mb-1">メモ</label>
          <textarea
            id="memo"
            name="memo"
            value={formData.memo}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="4"
          ></textarea>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
        >
          <Save className="mr-2" size={20} />
          {isDataSaved ? '更新' : '保存'}
        </button>
      </form>
    </div>
  );
};

export default FinalPage;