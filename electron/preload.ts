const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        send: (channel: string, data: any) => ipcRenderer.send(channel, data),
        on: (channel: string, func: (...args: any[]) => void) =>
            ipcRenderer.on(channel, (event: any, ...args: any[]) => func(...args)),
    },
    onDownloadProgress: (callback: (progress: any) => void) => {
        ipcRenderer.on('download-progress', (_event: any, progress: any) => callback(progress));
    }
});
