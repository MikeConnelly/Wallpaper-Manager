const wallpaper = require('wallpaper');
const moment = require('moment');
const ipInfo = require('ipinfo');
const weather = require('weather-js');
const INTERVAL = 30 * 1000;
const FORMAT = 'hh:mm';
let store;
let location;
let prevWeather; // use if fetching weather fails

function startUpdateLoop(storeRef) {
  store = storeRef;
  ipInfo((err, cLoc) => {
    if (err) throw err;
    location = `${cLoc.city}, ${cLoc.region}`;
  });
  setInterval(() => {
    checkForUpdate();
  }, INTERVAL);
}

async function checkForUpdate() {
  const currentWallpaper = await wallpaper.get();
  const nextWallpaper = await timeCheck();
  weatherCheck();
  // console.log(`current: ${currentWallpaper}, next: ${nextWallpaper}`);
  if (currentWallpaper !== nextWallpaper) {
    wallpaper.set(nextWallpaper);
  }
}

function timeCheck() {
  const defaultWallpaper = store.getDefault();
  const wallpapers = store.getWallpapers();
  const time = moment();

  return new Promise((resolve, reject) => {
    if (wallpapers.length === 0) {
      resolve(defaultWallpaper);
    }
    wallpapers.forEach((w, index) => {
      if (w.filter.time.from && w.filter.time.to && w.path) {
        let fromTime = moment(w.filter.time.from, FORMAT);
        let toTime = moment(w.filter.time.to, FORMAT);
        // adjust days to account for overnight times
        if (toTime.isBefore(fromTime)) {
          if (time.isAfter(fromTime)) {
            toTime = toTime.add(1, 'd');
          }
          if (time.isBefore(toTime)) {
            fromTime = fromTime.subtract(1, 'd');
          }
        }
        // console.log(`time: ${time}, fromTime: ${fromTime}, toTime: ${toTime}`);
        if (time.isBetween(fromTime, toTime)) {
          resolve(w.path);
        }
      }
      if (index === wallpapers.length - 1) {
        resolve(defaultWallpaper);
      }
    });
  });
}

function weatherCheck() {
  weather.find({ search: location, degreeType: 'F' }, (err, result) => {
    if (err) {
      err.preventDefault();
      console.log(err);
      // use prevWeather if err
    }
    // idk... stuff
    prevWeather = result[0].current.skytext;
    // console.log(prevWeather);
  });
}

module.exports = startUpdateLoop;
