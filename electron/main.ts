import * as electron from 'electron';
const { app, BrowserWindow, dialog } = electron;

import pkg from 'electron-updater';
const autoUpdater = (pkg as any).autoUpdater || (pkg as any).default?.autoUpdater || pkg;

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow: electron.BrowserWindow | null = null;

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

  if (!mainWindow) return;

  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
};

// Auto-updater configuration
if (autoUpdater) {
  autoUpdater.autoDownload = false;

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
}

app.on('ready', () => {
  createWindow();
  if (app.isPackaged && autoUpdater) {
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
