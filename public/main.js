const { app, BrowserWindow, dialog, Menu, Tray } = require('electron');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const winston = require('winston');
const Store = require('./store');
const startUpdateLoop = require('./wallpaper');
const setupRoutes = require('./api');
const PORT = 8000;
const ICOPATH = app.isPackaged ? path.join(__dirname, 'icon.ico') : './public/icon.ico';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'app.log' })
  ]
});

const store = new Store({
  configName: 'user-preferences',
  defaults: {
    windowBounds: { width: 800, height: 600 },
    defaultWallpaper: '',
    wallpapers: []
  }
}, logger);

var api = express();
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());
api.use(cors());
setupRoutes(api, store, logger);

// binds to localhost so the routes are not accessable over the network... its an electron app
api.listen(PORT, 'localhost');

let tray = null;

function createWindow() {
  let { width, height } = store.get('windowBounds');
  let win = new BrowserWindow({ width, height,
    backgroundColor: '#00428d',
    resizable: false,
    icon: ICOPATH
  });
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open App', click: function () {
        win.show();
      }
    }, {
      label: 'Quit', click: function () {
        logger.log({
          level: 'info',
          message: 'app quit'
        });

        win.destroy();
        app.quit();
      }
    }
  ]);

  tray = new Tray(ICOPATH);
  tray.setToolTip('wallpaper app');
  tray.setContextMenu(contextMenu);
  tray.on('click', tray.popUpContextMenu);

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
  
  if (!app.isPackaged) { // prod
    logger.add(new winston.transports.Console({
      format: winston.format.simple()
    }));
  }
  logger.log({
    level: 'info',
    message: 'app started'
  })
  startUpdateLoop(store, logger);
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

dialog.showErrorBox = function(title, content) {
  console.log(`${title}\n${content}`);
}

process.on('SIGINT', () => {
  process.exit();
});
