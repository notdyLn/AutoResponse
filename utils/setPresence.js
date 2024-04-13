const { Error } = require('./logging');
const fs = require('fs');
const path = require('path');

let activityIndex = 0;

module.exports = async (client) => {
    try {
        const leaderboardFilePath = path.join(__dirname, '..', 'data', 'leaderboards', 'current.json');
        const leaderboardData = JSON.parse(fs.readFileSync(leaderboardFilePath, 'utf-8'));
        const totalReplies = Object.values(leaderboardData).reduce((acc, replies) => acc + replies, 0);
        const members = Object.keys(leaderboardData).length;

        const activities = [
            `${totalReplies} replies`,
            `${members} members`
        ]
        const presenceData = {
            "status": "online",
            "activities": [
                {
                    "name": activities[activityIndex],
                    "type": 4,
                    "url": `https://twitch.tv/not_dyLn`
                }
            ]
        };

        client.user.setPresence(presenceData);
        activityIndex = (activityIndex + 1) % activities.length;
    } catch (e) {
        Error(`Error updating presence: ${e.message}`);
    }
};