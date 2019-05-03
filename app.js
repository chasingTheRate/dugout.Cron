const CronJob = require('cron').CronJob;
const dugout = require('./services/dugoutService');

console.log(`Starting Cron Jobs...`);

//  Daily Cron

new CronJob('0 20 8 * * *', () => {
  console.log('cron fired');
  //dugout.getInitialBoxscores();
}, null, true, 'America/Winnipeg');

dugout.getInitialBoxscores();
