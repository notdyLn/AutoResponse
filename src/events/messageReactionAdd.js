const { messageReactionAdd } = require('../../utils/logging');
const getSettings = require("../../utils/getSettings");

module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user) {
        const username = user.username || 'Unknown user';

        const guildName = reaction.message.guild.name;
        const serverId = reaction.message.guild.id;
        const channelName = reaction.message.channel.name;

        const messageAuthor = reaction.message.author.username || 'Unknown user';
        const messageContent = reaction.message.content;

        const emojiName = reaction.emoji.name;
        const emojiId = reaction.emoji.id;
        const emoji = `<:${emojiName}:${emojiId}>`;
        
        const settings = await getSettings(serverId);
        const replyChannels = settings.replyChannels || [];
        const replyChannel = replyChannels.find(
            (channel) => channel.id === reaction.message.channel.id
        );
        let chance = replyChannel.chance || 0;

        messageReactionAdd(`${(chance + "%").yellow} - ${guildName.cyan} - ${('#' + channelName).cyan} - ${username.cyan} - ${(`Added a reaction to ${(messageAuthor + `'s`).cyan}`).green}` + (` message ("`).green + messageContent.cyan + `${(`") with ` + emoji.cyan).green}`);
    }
};