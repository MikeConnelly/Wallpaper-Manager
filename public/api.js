const { dialog } = require('electron');
const path = require('path');

function routes(api, store) {

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

  api.post('/default', (req, res) => {
    dialog.showOpenDialog({
      properties: ['openFile'],
      filters: { name: 'Images', extension: ['jpg', 'png'] }
    }).then(fileData => {
      if (!fileData.canceled) {
        const filePath = fileData.filePaths[0];
        store.addDefaultWallpaper(filePath);
        res.status(200).send(path.basename(filePath));
      }
    }).catch(err => {
      if (err) throw err;
    })
  });

  // craete blank filtered wallpaper and send a new id and blank filter in response
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

  api.delete('/wallpaper/:id', (req, res) => {
    const id = parseInt(req.params.id);
    store.deleteWallpaper(id);
    res.status(200).send('item deleted');
  });
}

module.exports = routes;
