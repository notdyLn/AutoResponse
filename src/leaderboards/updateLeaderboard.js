const colors = require('colors');
const fs = require('fs');
const path = require('path');
const output = require('../console/output');

function updateLeaderboard(userTag) {
    try {
        const leaderboardFilePath = path.join(__dirname, '..', '..', 'data', 'leaderboards', `current.json`);
        const leaderboardData = fs.existsSync(leaderboardFilePath)
            ? JSON.parse(fs.readFileSync(leaderboardFilePath, 'utf8'))
            : {};

        leaderboardData[userTag] = (leaderboardData[userTag] || 0) + 1;

        fs.writeFileSync(leaderboardFilePath, JSON.stringify(leaderboardData, null, 2));
        output.debug(`Leaderboard updated for ${colors.cyan(userTag)}`);
    } catch (error) {
        output.error(`Error updating leaderboard: ${error.message}`);
    }
}

module.exports = updateLeaderboard;