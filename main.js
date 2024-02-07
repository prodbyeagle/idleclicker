const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 1000, 
    minHeight: 1000,
    maxWidth: 1920,
    maxHeight: 1080,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: path.join(__dirname, 'game', 'pictures', 'icon.ico'),
    autoHideMenuBar: true, // Verstecke die Menüleiste automatisch
  });
  
  const indexPath = path.join(__dirname, 'game', 'index.html');
  mainWindow.loadFile(indexPath);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});