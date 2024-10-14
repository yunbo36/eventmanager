import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, Folder } from 'lucide-react';

const GeneratedPaths = () => {
  const [sharedFolderPath, setSharedFolderPath] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [generatedPaths, setGeneratedPaths] = useState([]);

  useEffect(() => {
    const savedPath = localStorage.getItem('sharedFolderPath');
    const savedFile = localStorage.getItem('uploadedFile');
    
    if (savedPath) {
      setSharedFolderPath(savedPath);
    }
    if (savedFile) {
      setUploadedFile(JSON.parse(savedFile));
    }
  }, []);

  useEffect(() => {
    if (sharedFolderPath && uploadedFile) {
      const paths = uploadedFile.content.slice(1).map(row => {
        const folderName = row.join('\\');
        return `${sharedFolderPath}\\${folderName}`;
      });
      setGeneratedPaths(paths);
    }
  }, [sharedFolderPath, uploadedFile]);

  const handleDownloadPaths = async () => {
    const content = generatedPaths.join('\n');
    if (window.electronAPI) {
      try {
        const success = await window.electronAPI.saveFile(content, 'generated_paths.txt');
        if (success) {
          alert('パスリストを保存しました。');
        }
      } catch (error) {
        console.error('ファイル保存エラー:', error);
        alert('パスリストの保存中にエラーが発生しました。');
      }
    } else {
      // ブラウザ環境でのダウンロード処理
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated_paths.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleOpenFolder = async (path) => {
    if (window.electronAPI) {
      try {
        const normalizedPath = path.replace(/[①-⑳]/g, (match) => {
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

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">生成されたパス</h1>
      {generatedPaths.length > 0 ? (
        <>
          <ul className="space-y-2 mb-4">
            {generatedPaths.map((path, index) => (
              <li key={index} className="bg-gray-50 p-2 rounded flex justify-between items-center">
                <p className="text-sm text-gray-700">{path}</p>
                <button
                  onClick={() => handleOpenFolder(path)}
                  className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                >
                  <Folder className="mr-2" size={16} />
                  フォルダーを開く
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={handleDownloadPaths}
            className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
          >
            <Download size={20} className="mr-2" />
            パスリストをダウンロード
          </button>
        </>
      ) : (
        <p>生成されたパスはありません。共有フォルダーの設定とファイルのアップロードを確認してください。</p>
      )}
      <div className="mt-4 space-x-4">
        <Link
          to="/shared-folder"
          className="inline-block bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          共有フォルダー設定に戻る
        </Link>
        <Link
          to="/file-upload"
          className="inline-block bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          ファイルアップロードに戻る
        </Link>
      </div>
    </div>
  );
};

export default GeneratedPaths;