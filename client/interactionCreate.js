const { EmbedBuilder } = require('discord.js');
const { logToConsole } = require('../output/console');

const fs = require('fs');
const path = require('path');

const handleInteraction = async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, user } = interaction;

    logToConsole(`${user.tag} used /${commandName}`, 'info');

    try {
        const publicCommandPath = path.join(__dirname, '..', 'commands', 'public', `${commandName}.js`);
        const privateCommandPath = path.join(__dirname, '..', 'commands', 'private', `${commandName}.js`);
        const ownerCommandPath = path.join(__dirname, '..', 'commands', 'owner', `${commandName}.js`);

        const commandPath = fs.existsSync(publicCommandPath) ? publicCommandPath : fs.existsSync(privateCommandPath) ? privateCommandPath : ownerCommandPath;

        const command = require(commandPath);
        await command.execute(interaction);
    } catch (error) {
        const errorEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('An Error Occured:')
            .setDescription(`${error}`)
            .setTimestamp();

        console.error(error);
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
};

module.exports = { handleInteraction };
