const debug = require('debug')('dugoutService')
const axios = require('axios');
const moment = require('moment');
const util = require('util');
const gameStatusTypes = require('../models/gameStatusTypes');

const setTimeoutPromise = util.promisify(setTimeout);

const baseUrl = process.env.DUGOUT_WEBAPI_BASE_URL;
const delayInMilliseconds = 300000;

var intervalId;

async function getInitialBoxscores() {
  debug('getInitialBoxscores');
  const date = moment().format('L');
  const response = await axios.post(`${baseUrl}/UpdateBoxscores?date=${date}`);
  const boxscores = response.data;
  const earliestGame = boxscores[0];
  const earliestGameTimeInMilliseconds = moment(earliestGame.gameDate).valueOf();
  const nowInMilliseconds = moment().valueOf();
  const timeDiffInMilliSecs = earliestGameTimeInMilliseconds - nowInMilliseconds;
  if(timeDiffInMilliSecs > 0){
    setTimeoutPromise(timeDiffInMilliSecs, date)
    .then(startUpdatingBoxscores);
  } else {
    startUpdatingBoxscores(date)
  }
}

async function updateBoxscores(date){
  debug('updateBoxscores');
  var allGamesFinal = false
  const response = await axios.get(`${baseUrl}/boxscores?date=${date}`);
  const boxscores = response.data.boxscores;
  for (const boxscore of boxscores) {
    if (boxscore.status.statusCode !== gameStatusTypes.final) {
      break;
    }
    allGamesFinal = true;
  }
  if(allGamesFinal){
    clearInterval(intervalId);
  }
}

async function startUpdatingBoxscores(date) {
  debug('startUpdatingBoxscores');
  updateBoxscores(date);
  intervalId = setInterval(() => updateBoxscores(date), delayInMilliseconds);
}

module.exports = {
  getInitialBoxscores
}