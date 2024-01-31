const colors = require('colors');
const fs = require('fs');
const output = require('../console/output');
const path = require('path');

function getLeaderboards() {
  const leaderboardsFolderPath = path.join(__dirname, '..', '..', 'data', 'leaderboards');
  const leaderboardFiles = fs.readdirSync(leaderboardsFolderPath);

  for (const leaderboardFile of leaderboardFiles) {
    const leaderboardPath = path.join(leaderboardsFolderPath, leaderboardFile);

    try {
      fs.accessSync(leaderboardPath, fs.constants.F_OK);
      output.debug(`Leaderboard ${colors.cyan(path.parse(leaderboardFile).name)} found`);
    } catch (error) {
      output.error(`Error handling getLeaderboard: ${error.message}`);
    }
  }
}

module.exports = getLeaderboards;
