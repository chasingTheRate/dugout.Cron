const debug = require('debug')('dugoutService')
const axios = require('axios');
const moment = require('moment');
const util = require('util');
const gameAbstractGameCodes = require('../models/gameAbstractGameCodes');

const setTimeoutPromise = util.promisify(setTimeout);

const baseUrl = process.env.DUGOUT_WEBAPI_BASE_URL;
const delayInMilliseconds = 300000; //  5min

var intervalId;

function getEarliestGameTime(boxscores) {
  let earliestTime;
  boxscores.map( (boxscore, index) => {
    if (index === 0) {
      earliestTime = boxscore.gameDate;
    } else {
      if ( new Date(boxscore.gameDate) < new Date(earliestTime)) {
        earliestTime = boxscore.gameDate;
      }
    }
  })
  return earliestTime;
}

async function getInitialBoxscores() {
  try {
    debug('getInitialBoxscores');
    console.log('getInitialBoxscores');
    const date = moment().format('L');
    const response = await axios.post(`${baseUrl}/UpdateBoxscores?date=${date}`);
    const boxscores = response.data;
    const earliestGame = getEarliestGameTime(boxscores);
    console.log(`Earliest Time: ${moment(earliestGame).format('MMMM Do YYYY, h:mm:ss a')}`);
    const earliestGameTimeInMilliseconds = moment(earliestGame).valueOf();
    const nowInMilliseconds = moment().valueOf();
    const timeDiffInMilliSecs = earliestGameTimeInMilliseconds - nowInMilliseconds;
    console.log(`timeDiffInMilliSecs: ${timeDiffInMilliSecs}`);
    if(timeDiffInMilliSecs > 0){
      setTimeoutPromise(timeDiffInMilliSecs, date)
      .then(startUpdatingBoxscores);
    } else {
      startUpdatingBoxscores(date)
    }
  } catch {
    console.log('error: getInitialBoxscores');
  }
}

async function updateBoxscores(date){
  debug('updateBoxscores');
  console.log('updateBoxscores');
  var allGamesFinal = true
  try {
    const response = await axios.get(`${baseUrl}/boxscores?date=${date}`);
    const boxscores = response.data.boxscores;
    for (const boxscore of boxscores) {
      if (boxscore.status.abstractGameCode !== gameAbstractGameCodes.final) {
        console.log(boxscore.status.statusCode);
        allGamesFinal = false;
        try {
          axios.post(`${baseUrl}/UpdateBoxscores?date=${date}`)
        } catch (err) {
          console.log(`Error - UpdateBoxscores (POST)`);
          console.error(err);
        }
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
  }
}

async function startUpdatingBoxscores(date) {
  debug('startUpdatingBoxscores');
  console.log('startUpdatingBoxscores');
  updateBoxscores(date);
  intervalId = setInterval(updateBoxscores, delayInMilliseconds, date);
}

async function updateLeagueLeaders() {
  debug('updateLeagueLeaders');
  await axios.post(`${baseUrl}/UpdateLeagueLeaders`);
}

module.exports = {
  getInitialBoxscores,
  updateLeagueLeaders,
}