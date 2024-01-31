const colors = require('colors');
const output = require('../console/output');
const getSettings = require('../../src/verifyFiles/getSettings');
const updateLeaderboard = require('../leaderboards/updateLeaderboard');

module.exports = async (message) => {
    try {
        const userTag = message.author.tag;
        const serverName = message.guild ? message.guild.name : 'Unknown Server';

        const settings = getSettings(serverName);
        const phrases = settings.phrases || [];

        if (phrases.length > 0) {
            const randomIndex = Math.floor(Math.random() * phrases.length);
            const randomPhrase = phrases[randomIndex];

            output.info(`Sent phrase ${colors.cyan(randomPhrase)} to ${colors.cyan(userTag)}`);

            updateLeaderboard(userTag);

            await message.reply({ content: randomPhrase, allowedMentions: { repliedUser: false } });
        } else {
            output.warn(`No reply phrases found in settings.json`);
        }

    } catch (error) {
        output.error(`Error replying to user: ${error.message}`);
    }
};
