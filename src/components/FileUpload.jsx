import React, { useRef, useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';

const FileUpload = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedFile = localStorage.getItem('uploadedFile');
    if (savedFile) {
      setUploadedFile(JSON.parse(savedFile));
    }
  }, []);

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/vnd.ms-excel') {
        let data;
        if (window.electronAPI) {
          try {
            const fileContent = await window.electronAPI.readExcelFile(file.path);
            data = new Uint8Array(fileContent);
          } catch (error) {
            console.error('ファイル読み込みエラー:', error);
            alert('ファイルの読み込み中にエラーが発生しました。');
            return;
          }
        } else {
          const reader = new FileReader();
          data = await new Promise((resolve, reject) => {
            reader.onload = (e) => resolve(new Uint8Array(e.target.result));
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
          });
        }

        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const content = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const newFile = {
          name: file.name,
          size: file.size,
          type: file.type,
          content: content,
          lastModified: file.lastModified
        };

        setUploadedFile(newFile);
        localStorage.setItem('uploadedFile', JSON.stringify(newFile));
      } else {
        alert('Excelファイル (.xlsx, .xls) のみアップロードできます。');
      }
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    localStorage.removeItem('uploadedFile');
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">リスト送信</h1>
      <div className="mb-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept=".xlsx,.xls"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Upload className="inline mr-2" size={20} />
          Excelファイルを選択
        </button>
      </div>
      {uploadedFile && (
        <div className="bg-gray-50 p-4 rounded">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="text-sm font-semibold text-gray-700">{uploadedFile.name}</p>
              <p className="text-xs text-gray-500">
                {formatFileSize(uploadedFile.size)} - {uploadedFile.type}
              </p>
              <p className="text-xs text-gray-500">
                最終更新: {new Date(uploadedFile.lastModified).toLocaleString()}
              </p>
            </div>
            <button
              onClick={removeFile}
              className="text-red-500 hover:text-red-700 focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {uploadedFile.content[0].map((header, i) => (
                    <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {uploadedFile.content.slice(1).map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="mt-4">
        <Link
          to="/generated-paths"
          className="inline-block bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          生成されたパスを表示
        </Link>
      </div>
    </div>
  );
};

export default FileUpload;