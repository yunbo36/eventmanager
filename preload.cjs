const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFolderDialog: () => ipcRenderer.invoke('open-folder-dialog'),
  readExcelFile: (filePath) => ipcRenderer.invoke('read-excel-file', filePath),
  saveFile: (content, filePath) => ipcRenderer.invoke('save-file', content, filePath),
  openFolder: (path) => ipcRenderer.invoke('open-folder', path)
});