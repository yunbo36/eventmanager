import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PCReception = () => {
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    const savedFile = localStorage.getItem('uploadedFile');
    if (savedFile) {
      setUploadedFile(JSON.parse(savedFile));
    }
  }, []);

  if (!uploadedFile) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">PC受付</h1>
        <p>ファイルがアップロードされていません。</p>
        <Link to="/file-upload" className="text-blue-500 hover:underline">
          ファイルをアップロードする
        </Link>
      </div>
    );
  }

  const uniqueValues = [...new Set(uploadedFile.content.slice(1).map(row => row[0]))];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">PC受付</h1>
      <ul className="space-y-2">
        {uniqueValues.map((value, index) => (
          <li key={index}>
            <Link
              to={`/path-navigation/1?value1=${encodeURIComponent(value)}`}
              className="text-blue-500 hover:underline"
            >
              {value}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PCReception;