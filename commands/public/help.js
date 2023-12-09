const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { logToConsole } = require('../../output/console');
const fs = require('fs');
const path = require('path');

const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get information about available commands');

module.exports = { data, execute };

async function execute(interaction) {
    const commandDirectory = ['public'];
    const commands = [];

    for (const directory of commandDirectory) {
        const commandFiles = fs.readdirSync(path.join(__dirname, '..', directory)).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const commandPath = path.join(__dirname, '..', directory, file);
            logToConsole(`${commandDirectory} command found: ${commandPath}`, 'info');
            
            const command = require(commandPath);
            commands.push({ name: command.data.name, description: command.data.description });
        }
    }

    const embed = new EmbedBuilder()
        .setColor(0x6969FF)
        .setTitle('AutoResponse Commands')
        .setDescription('Here is a list of available commands:')
        .addFields({ name: ' ', value: ' ', inline: false })
        .setTimestamp();

    embed.addFields(commands.map(command => ({ name: `/${command.name}`, value: command.description, inline: false })));

    await interaction.reply({ embeds: [embed], ephemeral: true });
}