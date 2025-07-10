const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('node:fs/promises'); // Add fs for file operations

try {
  require('electron-reloader')(module)
} catch (_) {}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Project Taurus',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      zoomFactor: 0.75,
    },
  });

  const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:3000';

  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers for Data Management
ipcMain.handle('export-story', async (event, storyData) => {
  try {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Export Story',
      defaultPath: 'story.json',
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    if (canceled || !filePath) {
      return { success: false, error: 'Export cancelled' };
    }

    await fs.writeFile(filePath, JSON.stringify(storyData, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Failed to export story:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('import-story', async (event) => {
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Import Story',
      properties: ['openFile'],
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    if (canceled || filePaths.length === 0) {
      return { success: false, error: 'Import cancelled' };
    }

    const filePath = filePaths[0];
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const storyData = JSON.parse(fileContent);

    return { success: true, storyData };
  } catch (error) {
    console.error('Failed to import story:', error);
    return { success: false, error: error.message };
  }
});
