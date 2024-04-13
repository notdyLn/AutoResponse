const colors = require('colors');
const fs = require('fs');
const { Error, Valid } = require('../utils/logging');
const path = require('path');

function getLeaderboards() {
  const leaderboardsFolderPath = path.join(__dirname, '..', 'data', 'leaderboards');
  const leaderboardFiles = fs.readdirSync(leaderboardsFolderPath);

  for (const leaderboardFile of leaderboardFiles) {
    const leaderboardPath = path.join(leaderboardsFolderPath, leaderboardFile);

    try {
      fs.accessSync(leaderboardPath, fs.constants.F_OK);
      Valid(`Leaderboard ${colors.cyan(path.parse(leaderboardFile).name)} found`);
    } catch (error) {
      Error(`Error handling getLeaderboard: ${error.message}`);
    }
  }
}

module.exports = getLeaderboards;