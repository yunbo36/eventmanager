import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  openFolderDialog: () => ipcRenderer.invoke('open-folder-dialog'),
  readExcelFile: (filePath) => ipcRenderer.invoke('read-excel-file', filePath),
  saveFile: (content, defaultPath) => ipcRenderer.invoke('save-file', content, defaultPath),
  openFolder: (path) => ipcRenderer.invoke('open-folder', path)
});