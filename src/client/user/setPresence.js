const fs = require('fs');
const path = require('path');
const output = require('../../console/output');

module.exports = (client) => {
    try {
        output.debug(`Updating presence...`);

        const leaderboardFilePath = path.join(__dirname, '../../../data/leaderboards/current.json');
        const leaderboardData = JSON.parse(fs.readFileSync(leaderboardFilePath, 'utf-8'));
        const totalReplies = Object.values(leaderboardData).reduce((acc, replies) => acc + replies, 0);

        const presenceData = {
            status: 'online',
            activities: [
                {
                "name": `${totalReplies} replies and counting`,
                "type": 4,
                "url": `https://twitch.tv/not_dyLn"`
                }
            ]
        };

        client.user.setPresence(presenceData);
        output.debug(`Presence updated`);
    } catch (error) {
        output.error(`Setting Presence: ${error.message}`);
    }
};
