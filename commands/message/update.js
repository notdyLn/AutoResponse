const { DoneEmbed } = require('../../utils/embeds');
const { Error } = require('../../utils/logging');
const { fetchCommandCount, registerCommands } = require('../../utils/registerCommands');
const { updateLibraries } = require('../../utils/updateLibraries');

module.exports = {
    name: 'update',
    async execute(message) {
        const { client } = message;

        try {
            client.commands.clear();

            await registerCommands(client);
            const commandCount = await fetchCommandCount(client);

            const commandUpdatesEmbed = DoneEmbed(`Pushed commands to the client\n-# ${commandCount} total commands`);
            const updateMessage = await message.reply({ embeds: [commandUpdatesEmbed], allowedMentions: { repliedUser: false }});

            const updatedLibraries = await updateLibraries();
            const libraryUpdatesEmbed = DoneEmbed(`Finished library updates to the host\n${updatedLibraries}`);

            await updateMessage.edit({ embeds: [commandUpdatesEmbed, libraryUpdatesEmbed], allowedMentions: { repliedUser: false }});
        } catch (error) {
            message.react('❌');
            return Error(`Error executing ${module.exports.name}:\n${error.stack}`);
        }
    }
};
