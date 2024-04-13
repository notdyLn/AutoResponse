const { messageUpdate } = require('../../utils/logging');

module.exports = {
    name: 'messageUpdate',
    execute(oldMessage, newMessage) {
        const server = newMessage.guild.name;
        const channel = newMessage.channel.name;
        const globalUsername = newMessage.author.tag;
        const messageContent = newMessage.content.replace(/[\r\n]+/g, ' ');

        messageUpdate(`${server.cyan} - ${'#'.cyan + channel.cyan} - ${globalUsername.cyan} - ${messageContent.yellow} (Edited)`);
    }
};