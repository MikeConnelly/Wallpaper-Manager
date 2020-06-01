const { app, BrowserWindow, dialog, Menu, Tray } = require('electron');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const Store = require('./store');
const startUpdateLoop = require('./wallpaper');
const setupRoutes = require('./api');
const PORT = 8000;

const store = new Store({
  configName: 'user-preferences',
  defaults: {
    windowBounds: { width: 800, height: 600 },
    defaultWallpaper: '',
    wallpapers: []
  }
});

var api = express();
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());
api.use(cors());

setupRoutes(api, store);

// binds to localhost so the routes are not accessable over the network... its an electron app
api.listen(PORT, 'localhost');

let tray = null;

function createWindow() {
  let { width, height } = store.get('windowBounds');
  let win = new BrowserWindow({ width, height });
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: function () {
        win.show();
      }
    }, {
      label: 'Quit', click: function () {
        win.destroy();
        app.quit();
      }
    }
  ]);

  dialog.showErrorBox = function(title, content) {
    console.log(`${title}\n${content}`);
  }

  if (app.isPackaged) {
    tray = new Tray(path.join(__dirname, 'cropped-icon-16x16.jpg'));
  } else {
    tray = new Tray('./public/cropped-icon-16x16.jpg');
  }
  tray.setContextMenu(contextMenu);

  // need this line to show icon in system tray
  win.on('show', function () {});

  win.on('resize', () => {
    let { width, height } = win.getBounds();
    store.set('windowBounds', { width, height });
  });
  
  win.on('close', event => {
    event.preventDefault();
    win.hide();
  });

  win.removeMenu();
  win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);

  startUpdateLoop(store);
}

app.whenReady().then(createWindow);

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

process.on('SIGINT', () => {
  process.exit();
});
