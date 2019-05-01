
const baseUrl = process.env.DUGOUT_WEBAPI_BASE_URL;
const axios = require('axios');

async function getInitialBoxscores() {
  const response = await axios.post(`${baseUrl}/UpdateBoxscores?date=04/30/2019`);
  const boxscores = response.data;
  const earliestGame = boxscores[0];
  console.log(earliestGame.gameDate);
}

module.exports = {
  getInitialBoxscores
}