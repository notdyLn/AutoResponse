const colors = require('colors');
const output = require('../../console/output');
const getSettings = require('../../verifyFiles/getSettings');

module.exports = (oldMessage, newMessage) => {
    try {
        if (newMessage.author.bot || newMessage.webhookId) {
            return;
        }

        const userTag = newMessage.author.tag;
        const channelName = newMessage.channel.name || 'DM';
        const serverName = newMessage.guild ? newMessage.guild.name : 'Unknown Server';

        const cleanedOldContent = oldMessage.content.replace(/[\r\n]+/g, ' ');
        const cleanedNewContent = newMessage.content.replace(/[\r\n]+/g, ' ');

        let markedContent = '';

        for (let i = 0; i < Math.max(cleanedOldContent.length, cleanedNewContent.length); i++) {
            const oldChar = cleanedOldContent[i] || '';
            const newChar = cleanedNewContent[i] || '';

            if (oldChar !== newChar) {
                markedContent += colors.red(newChar);
            } else {
                markedContent += colors.white(newChar);
            }
        }

        const settings = getSettings(serverName);
        const replyChannels = settings.replyChannels || [];
        const replyChannel = replyChannels.find(channel => channel.id === newMessage.channel.id);
        const channelChance = replyChannel ? replyChannel.chance : 0;

        output.update(`${colors.white(`${channelChance}%`)} - ${colors.cyan(serverName)} - ${colors.cyan(`#${channelName}`)} - ${colors.cyan(userTag)}: ${markedContent}`);
    } catch (error) {
        output.error(`Error handling messageUpdate: ${error.message}`);
    }
};
