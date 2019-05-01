require('dotenv').config();
const CronJob = require('cron').CronJob;
const dugout = require('./services/dugoutWebApi');

console.log(`Starting Cron Jobs...`);

//  Daily Cron

new CronJob('* * 3 * * *', () => {
  dugout.getInitialBoxscores();
}, null, true, 'America/Winnipeg');