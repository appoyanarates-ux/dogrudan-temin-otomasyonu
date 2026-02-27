import { app, BrowserWindow, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// electron-squirrel-startup is not needed for NSIS, and causes issues with ESM
let mainWindow = null;
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
};
// Auto-updater configuration
autoUpdater.autoDownload = false; // Don't download automatically, ask the user first
autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
        type: 'info',
        title: 'Yeni Sürüm Mevcut',
        message: 'Yeni bir sürüm bulundu. Şimdi indirmek ister misiniz?',
        buttons: ['Evet', 'Hayır'],
    }).then((result) => {
        if (result.response === 0) {
            autoUpdater.downloadUpdate();
        }
    });
});
autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
        type: 'info',
        title: 'Güncelleme Hazır',
        message: 'Güncelleme indirildi. Uygulamayı şimdi yeniden başlatıp güncellemek ister misiniz?',
        buttons: ['Evet', 'Sonra'],
    }).then((result) => {
        if (result.response === 0) {
            autoUpdater.quitAndInstall();
        }
    });
});
app.on('ready', () => {
    createWindow();
    if (app.isPackaged) {
        autoUpdater.checkForUpdatesAndNotify();
    }
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
//# sourceMappingURL=main.js.map