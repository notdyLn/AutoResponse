const { messageDelete } = require('../../utils/logging');

module.exports = {
    name: 'messageDelete',
    execute(message) {
        const server = message.guild.name;
        const channel = message.channel.name;
        const globalUsername = message.author.tag;
        const messageContent = message.content.replace(/[\r\n]+/g, ' ');

        messageDelete(`${server.cyan} - ${'#'.cyan + channel.cyan} - ${globalUsername.cyan} - ${messageContent.red} (Deleted)`);
    }
};