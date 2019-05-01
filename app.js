require('dotenv').config();
const CronJob = require('cron').CronJob;
const dugout = require('./services/dugoutService');

console.log(`Starting Cron Jobs...`);

//  Daily Cron

new CronJob('0 3 * * *', () => {
  //dugout.getInitialBoxscores();
}, null, true, 'America/Winnipeg');

dugout.getInitialBoxscores();