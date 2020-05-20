const { app, BrowserWindow } = require('electron');
const path = require('path');
const wallpaper = require('wallpaper');
/*
(async () => {
  await wallpaper.set(__dirname + '/img/neon_cityscape.jpg');

  await wallpaper.get().then(val => console.log(val));
})();
*/

function createWindow() {
  let win = new BrowserWindow({
    width: 800,
    height: 600
  });

  win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);

  // win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
})
