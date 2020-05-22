const { app, BrowserWindow, dialog } = require('electron');
const express = require('express');
const multer = require('multer');
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
    defaultWallpaper: ''
  }
});

// multer handles file uploads - remove or use to show images on frontend
/*
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

var upload = multer({ storage: storage }).single('file');
*/

var api = express();
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());
api.use(cors());

api.get('/data', (req, res) => {
  // send all data
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
      if (i === changes.length) { resolve() }
    }
  });
  applyChanges.then(() => changes = []);
});

api.listen(PORT, () => console.log(`listenting on port ${PORT}`));



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
