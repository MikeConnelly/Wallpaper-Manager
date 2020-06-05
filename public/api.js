const { dialog } = require('electron');
const path = require('path');

function routes(api, store, logger) {

  // get default wallpaper entry
  api.get('/data/default', (req, res) => {
    logger.log({
      level: 'info',
      message: `GET /data/default`
    });

    res.status(200).send(path.basename(store.get('defaultWallpaper')));
  });

  // get filtered wallpaper entries
  api.get('/data/wallpapers', (req, res) => {
    logger.log({
      level: 'info',
      message: `GET /data/wallpapers`
    });

    const wallpapers = store.get('wallpapers').map(elem => {
      return {
        id: elem.id,
        filter: elem.filter,
        path: path.basename(elem.path)
      }
    });
    res.status(200).json(wallpapers);
  });

  // set default wallpaper
  api.post('/default', (req, res) => {
    logger.log({
      level: 'info',
      message: `POST /default`
    });

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
    logger.log({
      level: 'info',
      message: `POST /createblank`
    });

    store.createBlank((id, BLANK_FILTER) => {
      res.status(200).json({
        id: id,
        filter: BLANK_FILTER
      });
    });
  });

  // update wallpaper file
  api.put('/file/:id', (req, res) => {
    dialog.showOpenDialog({
      properties: ['openFile'],
      filters: { name: 'Images', extension: ['jpg', 'png'] }
    }).then(fileData => {
      if (!fileData.canceled) {
        const id = parseInt(req.params.id);

        logger.log({
          level: 'info',
          message: `PUT /file/${id} to update with file ${fileData.filePaths[0]}`
        });

        store.updateFile(id, fileData.filePaths[0]);
        res.status(200).send(path.basename(fileData.filePaths[0]));
      }
    }).catch(err => {
      if (err) throw err;
    })
  });

  // update wallpaper filter
  api.put('/filter/:id', (req, res) => {
    const id = parseInt(req.params.id);
    try {
      logger.log({
        level: 'info',
        message: `PUT /filter/${id} to update with filter ${JSON.stringify(req.body)}`
      });

      store.updateFilter(id, req.body);
      res.status(200);
    } catch {
      res.status(400).send('id does not exist');
    }
  });

  // update ids of all items to match priority
  api.put('/priority', (req, res) => {
    const idList = req.body;

    logger.log({
      level: 'info',
      message: `PUT /priority idList: ${idList}`
    });

    store.updatePriorities(idList);
    res.status(200);
  });

  // delete wallpaper entry
  api.delete('/wallpaper/:id', (req, res) => {
    const id = parseInt(req.params.id);

    logger.log({
      level: 'info',
      message: `DELETE /wallpaper/${id}`
    });

    store.deleteWallpaper(id);
    res.status(200);
  });
}

module.exports = routes;
