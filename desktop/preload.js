const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('motorDesktop', {
  open: () => ipcRenderer.invoke('motor:open'),
  openPath: (filePath) => ipcRenderer.invoke('motor:open-path', filePath),
  save: (payload, currentPath, saveAs, projectName) => ipcRenderer.invoke('motor:save', { payload, currentPath, saveAs, projectName }),
  about: () => ipcRenderer.invoke('motor:about'),
  platform: process.platform
});
