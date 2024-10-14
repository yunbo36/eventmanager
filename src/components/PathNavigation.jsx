import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { Folder, Save } from 'lucide-react';

const PathNavigation = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uniqueValues, setUniqueValues] = useState([]);
  const [isFinalPage, setIsFinalPage] = useState(false);
  const [fullPath, setFullPath] = useState('');
  const [sharedFolderPath, setSharedFolderPath] = useState('');
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
  const { level } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const currentLevel = parseInt(level, 10);

  useEffect(() => {
    const savedFile = localStorage.getItem('uploadedFile');
    const savedPath = localStorage.getItem('sharedFolderPath');
    if (savedFile) {
      setUploadedFile(JSON.parse(savedFile));
    }
    if (savedPath) {
      setSharedFolderPath(savedPath);
    }
    loadReceptionists();
  }, []);

  useEffect(() => {
    if (uploadedFile) {
      const searchParams = new URLSearchParams(location.search);
      const previousValues = Array.from({ length: currentLevel }, (_, i) =>
        searchParams.get(`value${i + 1}`)
      );

      const filteredRows = uploadedFile.content.slice(1).filter(row =>
        previousValues.every((value, index) => row[index] === value)
      );

      const uniqueValuesSet = new Set(filteredRows.map(row => row[currentLevel]));
      const newUniqueValues = Array.from(uniqueValuesSet).filter(value => value && value.trim() !== '');
      setUniqueValues(newUniqueValues);

      setIsFinalPage(newUniqueValues.length === 0 || currentLevel === uploadedFile.content[0].length - 1);

      // フルパスの生成
      const pathSeparator = navigator.platform.startsWith('Win') ? '\\' : '/';
      const generatedPath = previousValues.join(pathSeparator);
      setFullPath(`${sharedFolderPath}${pathSeparator}${generatedPath}`);
    }
  }, [uploadedFile, currentLevel, location.search, sharedFolderPath]);

  useEffect(() => {
    if (fullPath) {
      loadFormData();
    }
  }, [fullPath]);

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
    } else {
      setFormData({
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
      setIsDataSaved(false);
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
        const content = `受付担当者: ${formData.receptionist}
COI: ${formData.coi}
動画: ${formData.video}
音声: ${formData.audio}
PC持ち込み: ${formData.pcBrought ? 'はい' : 'いいえ'}
PC演題上げ: ${formData.pcOnStage ? 'はい' : 'いいえ'}
変換アダプター持参: ${formData.adapterBrought ? 'はい' : 'いいえ'}
変換アダプター貸出: ${formData.adapterBorrowed ? 'はい' : 'いいえ'}
OS: ${formData.os}
メモ: ${formData.memo}`;

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

  const handleBack = () => {
    if (currentLevel > 1) {
      const searchParams = new URLSearchParams(location.search);
      searchParams.delete(`value${currentLevel}`);
      navigate(`/path-navigation/${currentLevel - 1}?${searchParams.toString()}`);
    } else {
      navigate('/pc-reception');
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

  const getNextUrl = (value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(`value${currentLevel + 1}`, value);
    return `/path-navigation/${currentLevel + 1}?${searchParams.toString()}`;
  };

  const renderTitle = () => {
    const searchParams = new URLSearchParams(location.search);
    const values = Array.from({ length: currentLevel }, (_, i) => searchParams.get(`value${i + 1}`)).filter(Boolean);
    return values.join(' > ');
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">{renderTitle()}</h1>
      <button
        onClick={handleBack}
        className="mb-4 bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-150 ease-in-out"
      >
        戻る
      </button>
      {isFinalPage ? (
        <div>
          <p className="mb-4 text-gray-600">生成されたパス: <span className="font-semibold">{fullPath}</span></p>
          <button
            onClick={handleOpenFolder}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center mb-8 transition duration-150 ease-in-out"
          >
            <Folder className="mr-2" size={20} />
            フォルダーを開く
          </button>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-6 pb-2 border-b">PC受付情報</h2>
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-md shadow">
                  <label htmlFor="receptionist" className="block text-sm font-medium text-gray-700 mb-2">受付担当者</label>
                  <select
                    id="receptionist"
                    name="receptionist"
                    value={formData.receptionist}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">選択してください</option>
                    {receptionists.map((name, index) => (
                      <option key={index} value={name}>{name}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-white p-4 rounded-md shadow">
                  <p className="block text-sm font-medium text-gray-700 mb-2">OS</p>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input type="radio" name="os" value="Win" checked={formData.os === 'Win'} onChange={handleInputChange} className="form-radio text-blue-600" />
                      <span className="ml-2">Win</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" name="os" value="Mac" checked={formData.os === 'Mac'} onChange={handleInputChange} className="form-radio text-blue-600" />
                      <span className="ml-2">Mac</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-md shadow">
                <p className="block text-sm font-medium text-gray-700 mb-2">COI情報</p>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input type="radio" name="coi" value="あり" checked={formData.coi === 'あり'} onChange={handleInputChange} className="form-radio text-blue-600" />
                    <span className="ml-2">あり</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="coi" value="なし" checked={formData.coi === 'なし'} onChange={handleInputChange} className="form-radio text-blue-600" />
                    <span className="ml-2">なし</span>
                  </label>
                </div>
              </div>

              <div className="bg-white p-4 rounded-md shadow">
                <p className="block text-sm font-medium text-gray-700 mb-2">メディア情報</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">動画</p>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input type="radio" name="video" value="あり" checked={formData.video === 'あり'} onChange={handleInputChange} className="form-radio text-blue-600" />
                        <span className="ml-2">あり</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input type="radio" name="video" value="なし" checked={formData.video === 'なし'} onChange={handleInputChange} className="form-radio text-blue-600" />
                        <span className="ml-2">なし</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">音声</p>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input type="radio" name="audio" value="あり" checked={formData.audio === 'あり'} onChange={handleInputChange} className="form-radio text-blue-600" />
                        <span className="ml-2">あり</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input type="radio" name="audio" value="なし" checked={formData.audio === 'なし'} onChange={handleInputChange} className="form-radio text-blue-600" />
                        <span className="ml-2">なし</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-md shadow">
                <p className="block text-sm font-medium text-gray-700 mb-2">その他</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="inline-flex items-center">
                    <input type="checkbox" name="pcBrought" checked={formData.pcBrought} onChange={handleInputChange} className="form-checkbox text-blue-600 rounded" />
                    <span className="ml-2">PC持ち込み</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="checkbox" name="pcOnStage" checked={formData.pcOnStage} onChange={handleInputChange} className="form-checkbox text-blue-600 rounded" />
                    <span className="ml-2">PC演題上げ</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="checkbox" name="adapterBrought" checked={formData.adapterBrought} onChange={handleInputChange} className="form-checkbox text-blue-600 rounded" />
                    <span className="ml-2">変換アダプター持参</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="checkbox" name="adapterBorrowed" checked={formData.adapterBorrowed} onChange={handleInputChange} className="form-checkbox text-blue-600 rounded" />
                    <span className="ml-2">変換アダプター貸出</span>
                  </label>
                </div>
              </div>

              <div className="bg-white p-4 rounded-md shadow">
                <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-2">メモ</label>
                <textarea
                  id="memo"
                  name="memo"
                  value={formData.memo}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                ></textarea>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center transition duration-150 ease-in-out"
              >
                <Save className="mr-2" size={20} />
                {isDataSaved ? '更新' : '保存'}
              </button>
            </form>
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