const { app, BrowserWindow, dialog } = require('electron');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { Store, copyFileToAppData } = require('./store');
const wallpaper = require('wallpaper');
const PORT = 8000;

let changes = [];

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

// data format
/**
 * user-preferences
 *   windowBounds
 *     width: NUMBER
 *     height: NUMBER
 *   defaultWallpaper: STRING
 *   wallpapers [{ filter: {from: TIME, to: TIME, weather: STRING}, path: STRING }, ...]
 */

api.get('/data', (req, res) => {
  res.json({
    defaultWallpaper: store.get('defaultWallpaper'),
    wallpapers: store.get('wallpapers')
  });
});

api.get('/data/default', (req, res) => {
  res.send(path.basename(store.get('defaultWallpaper')));
});

api.get('/data/wallpapers', (req, res) => {
  const wallpapers = store.get('wallpapers').map(elem => {
    elem.path = path.basename(elem.path);
    return elem;
  });
  res.json(wallpapers);
});

api.post('/file', (req, res) => {
  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: { name: 'Images', extension: ['jpg', 'png'] }
  }).then(data => {
    const change = {
      filePath: data.filePaths[0],
      fileName: path.basename(data.filePaths[0]),
      filters: req.body.filters,
      setDefault: req.body.setDefault,
      canceled: data.canceled
    };
    changes.push(change);
    res.status(200).send(change.fileName);
  }).catch(err => {
    if (err) throw err;
  })
});

api.post('/apply', (req, res) => {
  const applyChanges = new Promise((resolve, reject) => {
    for (let i = 0; i < changes.length; i++) {
      // eslint-disable-next-line no-loop-func
      copyFileToAppData(changes[i].filePath, newPath => {
        if (changes[i].setDefault) {
          store.set('defaultWallpaper', newPath);
        } else {
          // idk filter stuff
        }
      });
      if (i === changes.length) { resolve(); }
    }
  });
  applyChanges.then(() => changes = []);
});

api.listen(PORT, () => console.log(`listenting on port ${PORT}`));

/*
api.post('/upload', (req, res) => {
  upload(req, res, err => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    (async () => {
      await wallpaper.set(req.file);
    
      await wallpaper.get().then(val => console.log(val));

      return res.status(200).send(req.file);
    })();
  });
});*/



function createWindow() {
  let { width, height } = store.get('windowBounds');
  let win = new BrowserWindow({ width, height });
  
  win.on('resize', () => {
    let { width, height } = win.getBounds();
    store.set('windowBounds', { width, height });
  });

  win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
  // win.webContents.openDevTools();
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
