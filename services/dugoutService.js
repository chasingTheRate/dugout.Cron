const axios = require('axios');
const moment = require('moment');
const util = require('util');

const setTimeoutPromise = util.promisify(setTimeout);

const baseUrl = process.env.DUGOUT_WEBAPI_BASE_URL;

function getDate() {
  
}

async function getInitialBoxscores() {
  const date = moment().format('L');
  const response = await axios.post(`${baseUrl}/UpdateBoxscores?date=${date}`);
  const boxscores = response.data;
  const earliestGame = boxscores[0];
  const earliestGameTimeInMilliseconds = moment(earliestGame.gameDate).valueOf();
  const nowInMilliseconds = moment().valueOf();
  const timeDifference = earliestGameTimeInMilliseconds - nowInMilliseconds;
  if(timeDifference > 0){
    setTimeoutPromise(100, date) // Replace with timeDifference
    .then(startUpdatingBoxscores);
  }
}

var count = 0;
var intervalId;

function updateBoxscores(date){
  count += 1;
  console.log(count);
  if(count >= 5){
    clearInterval(intervalId);
    count = 0;
    intervalId = setInterval((date) => updateBoxscores(date), 1000);
  }
}

async function startUpdatingBoxscores(date) {
  console.log('startUpdatingBoxscores')
  console.log(date);
  intervalId = setInterval((date) => updateBoxscores(date), 1000);
  console.log(intervalId);
  // var allGamesFinal = false
  // const response = await axios.get(`${baseUrl}/boxscores?date=${date}`);
  // const boxscores = response.data.boxscores;
  // for (const boxscore of boxscores) {
  //   console.log(boxscore.status.statusCode);
  //   if (boxscore.status.statusCode === 'F') {
  //     break;
  //   }
  // }
}

module.exports = {
  getInitialBoxscores
}