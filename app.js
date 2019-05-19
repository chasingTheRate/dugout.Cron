const CronJob = require('cron').CronJob;
const moment = require('moment');
const dugout = require('./services/dugoutService');

console.log(`Starting Cron Jobs, time: ${moment().format('MMMM Do YYYY, h:mm:ss a')}`);

//  Daily Cron

new CronJob('0 0 3 * * *', () => {
  console.log(`Cron Fired - Time: ${moment().format('MMMM Do YYYY, h:mm:ss a')}`)
  dugout.getInitialBoxscores();
  dugout.updateLeagueLeaders();
}, null, true, 'America/Winnipeg');

dugout.getInitialBoxscores();
dugout.updateLeagueLeaders();

