const { Debug, Error, typingStart } = require('../../utils/logging');

const getSettings = require("../../utils/getSettings");

module.exports = {
    name: 'typingStart',
    async execute(typing) {
        if (typing.guild) {
            const guildName = typing.guild.name;
            const serverId = typing.guild.id;
            const typingChannel = typing.channel;
            const channelName = typing.channel.name;
            const userTag = typing.user.tag;
            const message = 'Typing...';

            const settings = await getSettings(serverId, message.client);
            const replyChannels = settings.replyChannels || [];
            const replyChannel = replyChannels.find(typingChannel => typingChannel.id === typingChannel.id);
            
            if (replyChannel) {
                let chance = replyChannel ? replyChannel.chance : 0;
                replyChannel.chance = chance;
                typingStart(`${(chance + '%').yellow} - ${guildName.cyan} - ${'#'.cyan + channelName.cyan} - ${userTag.cyan} - ${message.grey}`);
            } else {
                typingStart(`${('0%').red} - ${guildName.cyan} - ${'#'.cyan + channelName.cyan} - ${userTag.cyan} - ${message.grey}`);
            };
        } else {
            const userTag = typing.user.tag;
            const channelName = 'DM';
            const message = 'Typing...';

            typingStart(`${channelName.cyan} - ${userTag.cyan} - ${message.grey}`);
        }
    }
};