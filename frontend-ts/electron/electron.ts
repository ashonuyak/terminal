import { join } from 'path';

import { app, BrowserWindow } from 'electron';

const width = 800;
const height = 600;

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    height,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
    width,
    autoHideMenuBar: true,
  });

  mainWindow.loadFile(
    'D:/3degree/1semester/trpz/terminal/frontend-ts/build/index.html',
  );

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (!mainWindow) createWindow();
});
