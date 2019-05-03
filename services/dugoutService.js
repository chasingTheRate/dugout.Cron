const debug = require('debug')('dugoutService')
const axios = require('axios');
const moment = require('moment');
const util = require('util');
const gameStatusTypes = require('../models/gameStatusTypes');

const setTimeoutPromise = util.promisify(setTimeout);

const baseUrl = process.env.DUGOUT_WEBAPI_BASE_URL;
const delayInMilliseconds = 3000; //  5min

var intervalId;

async function getInitialBoxscores() {
  try {
    debug('getInitialBoxscores');
    console.log('getInitialBoxscores');
    const date = moment().format('L');
    const response = await axios.post(`${baseUrl}/UpdateBoxscores?date=${date}`);
    const boxscores = response.data;
    const earliestGame = boxscores[0];
    const earliestGameTimeInMilliseconds = moment(earliestGame.gameDate).valueOf();
    const nowInMilliseconds = moment().valueOf();
    const timeDiffInMilliSecs = 5000 //earliestGameTimeInMilliseconds - nowInMilliseconds;
    if(timeDiffInMilliSecs > 0){
      //setTimeoutPromise(timeDiffInMilliSecs, date)
      //.then(startUpdatingBoxscores);
    } else {
      //startUpdatingBoxscores(date)
    }
  } catch {
    console.log('error');
  }
}

async function updateBoxscores(date){
  debug('updateBoxscores');
<<<<<<< HEAD
  console.log('updateBoxscores');
  var allGamesFinal = true
  try {
    const response = await axios.get(`${baseUrl}/boxscores?date=${date}`);
    const boxscores = response.data.boxscores;
    for (const boxscore of boxscores) {
      if (boxscore.status.statusCode !== gameStatusTypes.final) {
        console.log(boxscore.status.statusCode);
        //axios.post(`${baseUrl}/UpdateBoxscores?date=${date}`)
        allGamesFinal = false;
        break;
      }
    }
    if(allGamesFinal){
      debug('allGamesFinal');
      console.log('allGamesFinal');
      clearInterval(intervalId);
    }
  } catch {
    console.log(`Error Getting Boxscores`);
=======
  var allGamesFinal = true;
  const response = await axios.get(`${baseUrl}/boxscores?date=${date}`);
  const boxscores = response.data.boxscores;
  for (const boxscore of boxscores) {
    if (boxscore.status.statusCode != gameStatusTypes.final) {
      allGamesFinal = false;
      break;
    }
  }
  if(allGamesFinal){
    clearInterval(intervalId);
>>>>>>> 9bd73db7f65cd2c123a55b0fc0adba53a6cb48ba
  }
}

async function startUpdatingBoxscores(date) {
  debug('startUpdatingBoxscores');
  console.log('startUpdatingBoxscores');
  updateBoxscores(date);
  intervalId = setInterval(updateBoxscores, delayInMilliseconds, date);
}

module.exports = {
  getInitialBoxscores
}