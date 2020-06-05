const electron = require('electron');
const path = require('path');
const fs = require('fs');

const IMGDIR = '/images';
const BLANK_FILTER_OBJECT = {
  time: {
    from: '',
    to: ''
  },
  weather: ''
};

// data format
/**
 * user-preferences
 *   windowBounds
 *     width: NUMBER
 *     height: NUMBER
 *   defaultWallpaper: STRING
 *   wallpapers [{
 *     id: NUMBER,
 *     filter:
 *       time: { from: STRING, to: STRING },
 *       weather: STRING
 *     path: STRING },
 *   ...]
 */

class Store {

  constructor (opts, logger) {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    this.path = path.join(userDataPath, opts.configName + '.json');
    this.data = parseDataFile(this.path, opts.defaults);
    this.logger = logger
  }

  get(key) {
    return this.data[key];
  }

  set(key, val) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  getMaxID() {
    if (!this.data['wallpapers']) {
      this.data.wallpapers = [];
    }
    return this.data.wallpapers.length > 0 ? this.data.wallpapers.reduce((max, w) => Math.max(max, w.id), -1) : -1;
  }

  getDefault() {
    return this.data.defaultWallpaper;
  }

  getWallpapers() {
    return this.data.wallpapers;
  }

  findWallpaperIndexByID(id) {
    // find wallpaper with id
    const index = this.data.wallpapers.findIndex(w => {
      return w.id === id
    });
    //throw error if id not found
    if (index === -1) {
      throw new Error('id does not exist');
    }
    return index;
  }

  addDefaultWallpaper(filePath) {
    // delete old default wallpaper from images
    // if (this.data.defaultWallpaper) {
    //   fs.unlinkSync(new URL('file:///' + this.data.defaultWallpaper));
    // }
    copyFileToAppData(filePath, newPath => {
      this.set('defaultWallpaper', newPath);

      this.logger.log({
        level: 'info',
        message: `default wallpaper set to ${newPath}`
      });
    });
  }

  createBlank(cb) {
    const newID = this.getMaxID() + 1;

    this.logger.log({
      level: 'info',
      message: `empty item created with id ${newID}`
    });

    this.data.wallpapers.push({
      id: newID,
      filter: BLANK_FILTER_OBJECT,
      path: ''
    });
    fs.writeFileSync(this.path, JSON.stringify(this.data));
    cb(newID, BLANK_FILTER_OBJECT);
  }

  updateFile(id, filePath) {
    copyFileToAppData(filePath, newPath => {
      const index = this.findWallpaperIndexByID(id);
      // const url = new URL('file:///' + this.data.wallpapers[index].path);
      // console.log(`${filePath}, ${newPath}, ${url}`);
      // delete old wallpaper image if it exists
      // if (this.data.wallpapers[index].path) {
      //   fs.unlinkSync(url);
      // }
      // write new wallpaper path
      this.data.wallpapers[index].path = newPath;
      fs.writeFileSync(this.path, JSON.stringify(this.data));

      this.logger.log({
        level: 'info',
        message: `wallpaper with id ${id} set to ${newPath}`
      });
    });
  }

  updateFilter(id, newFilter) {
    const index = this.findWallpaperIndexByID(id);
    this.data.wallpapers[index].filter = newFilter;
    fs.writeFileSync(this.path, JSON.stringify(this.data));

    this.logger.log({
      level: 'info',
      message: `filter with id ${id} set to ${JSON.stringify(newFilter)}`
    });
  }

  updatePriorities(idList) {
    const newWallpaperList = [];
    idList.forEach((id, index) => {
      newWallpaperList[index] = this.data.wallpapers[id];
      if (index === this.data.wallpapers.length - 1) {
        this.data.wallpapers = newWallpaperList;
        fs.writeFileSync(this.path, JSON.stringify(this.data));

        this.logger.log({
          level: 'info',
          message: `order of wallpapers updated with new priorities ${idList}`
        });
      }
    });
  }

  deleteWallpaper(id) {
    const index = this.findWallpaperIndexByID(id);
    this.data.wallpapers.splice(index, 1);
    fs.writeFileSync(this.path, JSON.stringify(this.data));

    this.logger.log({
      level: 'info',
      message: `entry with id ${id} deleted`
    });
  }
}

function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    return defaults;
  }
}

function copyFileToAppData(filePath, cb) {
  const filename = path.basename(filePath);
  const userDataPath = (electron.app || electron.remote.app).getPath('userData');
  const imgDirPath = path.join(userDataPath, IMGDIR);
  const newFile = path.join(imgDirPath, filename);

  if (!fs.existsSync(imgDirPath)) {
    fs.mkdirSync(imgDirPath);
  }

  fs.copyFile(filePath, newFile, err => {
    if (err) throw err;
    cb(newFile);
  });
}

module.exports = Store;
