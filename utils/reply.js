const { Error, Warn } = require('../utils/logging');
const getSettings = require('./getSettings');
const updateLeaderboard = require('./updateLeaderboard');

module.exports = async (message) => {
    try {
        const userTag = message.author.tag;
        const serverName = message.guild ? message.guild.name : 'Unknown Server';

        const settings = getSettings(serverName);
        const phrases = settings.phrases || [];

        if (phrases.length > 0) {
            const randomIndex = Math.floor(Math.random() * phrases.length);
            const randomPhrase = phrases[randomIndex];

            updateLeaderboard(userTag);

            await message.reply({ content: randomPhrase, allowedMentions: { repliedUser: false } });
        } else {
            Warn(`No reply phrases found in settings.json`);
        }

    } catch (error) {
        Error(`Error replying to user: ${error.message}`);
    }
};