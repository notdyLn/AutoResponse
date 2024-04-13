const { Error, typingStart } = require('../../utils/logging');

module.exports = {
    name: 'typingStart',
    execute(typing) {
        const guild = typing.guild.name;
        const channel = typing.channel.name;
        const user = typing.user.tag;
        const message = 'Typing...'

        try {
            typingStart(`${guild.cyan} - ${'#'.cyan + channel.cyan} - ${user.cyan} - ${message.grey}`);
        } catch (error) {
            Error(error);
        }
    }
};