const { CommandError } = require('../../utils/logging');

module.exports = {
    name: 'me',
    async execute(message) {
        try {
            const botMessage = message.content.split(' ').slice(1).join(' ');
            const attachments = message.attachments;

            if (!botMessage && !attachments.size) {
                return message.reply('Please provide a message or attachment to send as the bot.');
            }

            message.delete();

            await message.channel.send({
                content: botMessage || null,
                files: attachments.map(attachment => attachment)
            });
        } catch (error) {
            CommandError('react', error.stack);
            return await message.react('❌');
        }
    }
};
