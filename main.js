const { app, BrowserWindow } = require('electron');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 1280, 
    minHeight: 720,
    maxWidth: 1920,
    maxHeight: 1080,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
    },
    autoHideMenuBar: true, // Verstecke die Menüleiste automatisch
  });
  mainWindow.loadFile('index.html');


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