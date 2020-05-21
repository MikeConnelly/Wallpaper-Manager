const { app, BrowserWindow } = require('electron');
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const wallpaper = require('wallpaper');
var { dialog } = require('electron');
/*
(async () => {
  await wallpaper.set(__dirname + '/img/neon_cityscape.jpg');

  await wallpaper.get().then(val => console.log(val));
})();
*/

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

var upload = multer({ storage: storage }).single('file')



var api = express();
api.use(cors());

api.post('/file', (req, res) => {
  dialog.showOpenDialog({properties: ['openFile']})
    .then(res => console.log(res));
})

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
});

api.listen(8000, () => {});

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
