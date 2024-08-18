const { messageReactionRemove, Error } = require('../../utils/logging');

module.exports = {
    name: 'messageReactionRemove',
    async execute(reaction, user) {
        try {
            if (reaction.partial) {
                await reaction.fetch();
            }
            if (user.partial) {
                await user.fetch();
            }

            const username = user.username || 'Unknown user';
            const guildName = reaction.message.guild.name;
            const channelName = reaction.message.channel.name;
            const messageAuthor = reaction.message.author.username || 'Unknown user';
            const emojiName = reaction.emoji.name;

            let messageContent = reaction.message.content.replace(/[\r\n]+/g, " ");

            if (reaction.message.embeds.length > 0) {
                messageContent += ' EMBED '.bgYellow.black;
            }

            messageReactionRemove(`${guildName.cyan} - ${('#' + channelName).cyan} - ${username.cyan} - ${(`Removed their reaction to ${(messageAuthor + `'s`).cyan}`).red}` + (` message `).red + messageContent.cyan + `${(` that was ${emojiName.cyan}`).red}`);
        } catch (error) {
            Error(`Error executing ${module.exports.name}: ${error.message}`);
        }
    }
};