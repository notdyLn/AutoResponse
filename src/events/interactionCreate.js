const { Error, interactionCreate } = require('../../utils/logging');
const { ErrorEmbed } = require('../../utils/embeds');
const path = require('path');

module.exports = {
    name: 'interactionCreate',
    execute(interaction) {
        const server = interaction.guild.name;
        const channel = interaction.channel.name;
        const globalUsername = interaction.member.displayName;

        const commandName = interaction.commandName;
        const commandContent = interaction.options
            ? interaction.options.data.map(option => `${option.name}: ${option.value}`).join(', ')
            : '';
        const commandFilePath = path.join(__dirname, '..', '..', 'commands', `${commandName}.js`);

        try {
            const command = require(commandFilePath);
            interactionCreate(`${server.cyan} - ${('#' + channel).cyan} - ${globalUsername.cyan} - /${commandName} ${commandContent}`);
            command.execute(interaction);
        } catch (e) {
            Error(`Error executing /${commandName}: ${e.message}`);
            const errorEmbed = ErrorEmbed(`Error executing /${commandName}`, e.message);
            interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};