const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('motorDesktop', {
  open: () => ipcRenderer.invoke('motor:open'),
  save: (saveAs = false) => ipcRenderer.invoke('motor:save', saveAs),
  about: () => ipcRenderer.invoke('motor:about'),
  platform: process.platform
});
