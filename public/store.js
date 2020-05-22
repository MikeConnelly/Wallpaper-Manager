const electron = require('electron');
const path = require('path');
const fs = require('fs');
const IMGDIR = '/images';

class Store {
  constructor (opts) {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    this.path = path.join(userDataPath, opts.configName + '.json');
    this.data = parseDataFile(this.path, opts.defaults);
  }

  get(key) {
    return this.data[key];
  }

  set(key, val) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
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

module.exports = {
  Store,
  copyFileToAppData
};
