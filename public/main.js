const { app, BrowserWindow, dialog } = require('electron');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const Store = require('./store');
const wallpaper = require('wallpaper');
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

api.get('/nextid', (req, res) => {
  const id = store.getMaxID() + 1;
  res.status(200).send(`${id}`);
});

// req.body has filters, setDefault, and optional id - used when setDefault=false
api.post('/file', (req, res) => {
  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: { name: 'Images', extension: ['jpg', 'png'] }
  }).then(fileData => {
    if (!fileData.canceled) {
      const data = {
        filePath: fileData.filePaths[0],
        filters: req.body.filters,
        setDefault: req.body.setDefault
      };
      if (!data.setDefault) { data.id = req.body.id; }

      store.addWallpaper(data);
      res.status(200).send(path.basename(fileData.filePaths[0]));
    }
  }).catch(err => {
    if (err) throw err;
  })
});

// craete blank filtered wallpaper and send a new id and blankobject in response
api.post('/createblank', (req, res) => {
  store.createBlank((id, BLANK_FILTER) => {
    res.status(200).json({
      id: id,
      filter: BLANK_FILTER
    });
  });
});

api.put('/file/:id', (req, res) => {
  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: { name: 'Images', extension: ['jpg', 'png'] }
  }).then(fileData => {
    if (!fileData.canceled) {
      const id = parseInt(req.params.id);
      store.updateFile(id, fileData.filePaths[0]);
      res.status(200).send(path.basename(fileData.filePaths[0]));
    }
  }).catch(err => {
    if (err) throw err;
  })
});

api.put('/filter/:id', (req, res) => {
  const id = parseInt(req.params.id);
  try {
    store.updateFilter(id, req.body);
  } catch {
    res.status(400).send('id does not exist');
  }
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
