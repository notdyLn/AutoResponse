const { Error, typingStart } = require('../../utils/logging');
const getSettings = require("../../utils/getSettings");

module.exports = {
    name: 'typingStart',
    async execute(typing) {
        const serverId = typing.guild.id;
        const guildName = typing.guild.name;
        const channelName = typing.channel.name;
        const userTag = typing.user.tag;
        const message = 'Typing...';
        const settings = await getSettings(serverId);
        const replyChannels = settings.replyChannels || [];
        const replyChannel = replyChannels.find(
            (channel) => channel.id === typing.channel.id
        );
        let chance = replyChannel.chance || 0;

        try {
            typingStart(`${(chance + "%").yellow} - ${guildName.cyan} - ${'#'.cyan + channelName.cyan} - ${userTag.cyan} - ${message.grey}`);
        } catch (error) {
            Error(error.message);
        }
    }
};