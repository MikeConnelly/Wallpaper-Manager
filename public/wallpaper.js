const wallpaper = require('wallpaper');
const moment = require('moment');
const ipInfo = require('ipinfo');
const weather = require('weather-js');
const INTERVAL = 30 * 1000;
const FORMAT = 'hh:mm';
let store;
let logger;
let location;
let currWeather = -1; // use if fetching weather fails

function startUpdateLoop(storeRef, loggerRef) {
  store = storeRef;
  logger = loggerRef;
  ipInfo((err, cLoc) => {
    if (err) throw err;
    location = `${cLoc.city}, ${cLoc.region}`;
  });
  setInterval(() => {
    checkForUpdate();
  }, INTERVAL);
}

// checks need to return lists in priority order
// next wallpaper should be first to meet both checks || highest priority from either list || default
async function checkForUpdate() {
  const defaultWallpaper = store.getDefault();
  const wallpapers = store.getWallpapers();
  const currentWallpaper = await wallpaper.get();

  const validTimes = await timeCheck(wallpapers);
  const validWeathers = await weatherCheck(wallpapers);
  const nextWallpaper = await findNextWallpaper(wallpapers.length, validTimes, validWeathers) || defaultWallpaper;
  
  logger.log({
    level: 'info',
    message: `checkForUpdate: current: ${currentWallpaper}, next: ${nextWallpaper}`
  });
  if (nextWallpaper && currentWallpaper !== nextWallpaper) {
    wallpaper.set(nextWallpaper);
  }
}

function findNextWallpaper(startingPriority, timeList, weatherList) {
  return new Promise((resolve, reject) => {
    let bestPriority = startingPriority;
    let bestWallpaper = null;
    if (timeList.length > 0 && weatherList.length > 0) {
      timeList.forEach((t, tIndex) => {
        if (weatherList.some(w => w.path === t.path)) { // first wallpaper in both lists
          resolve(t.path);
        }
        if (t.priority < bestPriority) {
          bestPriority = t.priority;
          bestWallpaper = t.path;
        }
        if (tIndex === timeList.length - 1) {
          weatherList.forEach((w, wIndex) => {
            if (w.priority < bestPriority) {
              bestPriority = w.priority;
              bestWallpaper = w.path;
            }
            if (wIndex === weatherList.length - 1) { // I have to do this to end each loop because of async
              resolve(bestWallpaper);
            }
          });
        }
      });
    } else if (timeList.length === 0 && weatherList.length > 0) {
      weatherList.forEach((w, wIndex) => {
        if (w.priority < bestPriority) {
          bestPriority = w.priority;
          bestWallpaper = w.path;
        }
        if (wIndex === weatherList.length - 1) {
          resolve(bestWallpaper);
        }
      });
    } else if (timeList.length > 0 && weatherList.length === 0) {
      timeList.forEach((t, tIndex) => {
        if (t.priority < bestPriority) {
          bestPriority = t.priority;
          bestWallpaper = t.path;
        }
        if (tIndex === timeList.length - 1) {
          resolve(bestWallpaper);
        }
      });
    } else {
      resolve(bestWallpaper);
    }
  });
}

function timeCheck(wallpapers) {
  const time = moment();
  const valid = [];

  return new Promise((resolve, reject) => {

    if (wallpapers.length === 0) {
      resolve([]);
    }

    wallpapers.forEach((w, index) => {
      if (w.path && w.filter.time.from && w.filter.time.to) {
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
          valid.push({
            priority: index,
            path: w.path
          });
        }
      }
      if (index === wallpapers.length - 1) {
        resolve(valid);
      }
    });
  });
}

async function weatherCheck(wallpapers) {
  const valid = [];

  return new Promise((resolve, reject) => {
    weather.find({ search: location, degreeType: 'F' }, (err, result) => {
      if (err) {
        logger.log({
          level: 'error',
          message: `${err}`
        });
        if (currWeather < 0) {
          reject([]);
        }
      } else {
        currWeather = result[0].current.skycode;
      }

      logger.log({
        level: 'info',
        message: `weather code: ${currWeather}`
      });

      if (wallpapers.length === 0) {
        resolve([]);
      }
      wallpapers.forEach((w, index) => {
        if (w.path && w.filter.weather && matchWeather(w.filter.weather, currWeather)) {
          valid.push({
            priority: index,
            path: w.path
          });
        }
        if (index === wallpapers.length - 1) {
          resolve(valid);
        }
      });
    });
  });
}

function matchWeather(filterWeather, skycode) {
  // 0 => 'thunderstorm', 
  // 1 => 'thunderstorm',
  // 2 => 'thunderstorm',
  // 3 => 'thunderstorm',
  // 4 => 'thunderstorm',
  // 5 => 'rain_snow',
  // 6 => 'sleet',
  // 7 => 'rain_snow',
  // 8 => 'icy',
  // 9 => 'icy',  
  // 10 => 'rain_snow', 
  // 11 => 'showers',
  // 12 => 'rain',
  // 13 => 'flurries',
  // 14 => 'snow', 
  // 15 => 'snow', 
  // 16 => 'snow', 
  // 17 => 'thunderstorm',
  // 18 => 'showers',
  // 19 => 'dust',
  // 20 => 'fog',
  // 21 => 'haze',
  // 22 => 'haze',
  // 23 => 'windy',
  // 24 => 'windy',
  // 25 => 'icy',
  // 26 => 'cloudy',
  // 27 => 'mostly_cloudy',
  // 28 => 'mostly_cloudy',
  // 29 => 'partly_cloudy', 
  // 30 => 'partly_cloudy',
  // 31 => 'sunny',
  // 32 => 'sunny',
  // 33 => 'mostly_sunny',
  // 34 => 'mostly_sunny',
  // 35 => 'thunderstorm',
  // 36 => 'hot',
  // 37 => 'chance_of_tstorm',
  // 38 => 'chance_of_tstorm', 
  // 39 => 'chance_of_rain',
  // 40 => 'showers',
  // 41 - 'chance_of_snow',  
  // 42 => 'snow',
  // 43 => 'snow',
  // 44 => 'na',
  // 45 => 'chance_of_rain',
  // 46 => 'chance_of_snow',
  // 47 => 'chance_of_tstorm'
  if ([0,1,2,3,4,17,35,37,38,47].includes(skycode)) {
    return filterWeather === 'Thunderstorm';
  } else if ([5,6,7,8,9,10,13,14,15,16,25,41,42,43,46].includes(skycode)) {
    return filterWeather === 'Snowy';
  } else if ([11,12,18,39,40,45].includes(skycode)) {
    return filterWeather === 'Rainy';
  } else if ([19,20,21,22].includes(skycode)) {
    return filterWeather === 'Foggy';
  } else if ([26,27,28,29,30].includes(skycode)) {
    return filterWeather === 'Cloudy';
  } else if ([31,32,33,34,36].includes(skycode)) {
    return filterWeather === 'Sunny'
  } else if ([23,24].includes(skycode)) {
    return filterWeather === 'Windy';
  }
  return false;
}

module.exports = startUpdateLoop;
