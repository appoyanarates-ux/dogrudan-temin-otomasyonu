const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        send: (channel, data) => ipcRenderer.send(channel, data),
        on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    },
    onDownloadProgress: (callback) => {
        ipcRenderer.on('download-progress', (_event, progress) => callback(progress));
    }
});
export {};
//# sourceMappingURL=preload.js.map