const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { logToConsole } = require('../../output/console');
const fs = require('fs');
const path = require('path');

const optedInUsersFilePath = path.join(__dirname, '../../data/servers/optedInUsers.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('optout')
        .setDescription('Opt out to stop receiving responses'),

    async execute(interaction) {
        let optedInUsers = loadOptedInUsers();

        const userIndex = optedInUsers.findIndex(user => user.id === interaction.user.id);

        if (userIndex === -1) {
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('You are not opted in.')
                .setDescription('Use **/optin** to opt in.')
                .setTimestamp();

            logToConsole(`${interaction.user.tag} hasn't opted in`, 'info');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        optedInUsers.splice(userIndex, 1);

        saveOptedInUsers(optedInUsers);

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('You have opted out!')
            .setDescription('Use **/optin** to opt in.')
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
        logToConsole(`Removed ${interaction.user.tag}`, 'info');
    },
};

function loadOptedInUsers() {
    try {
        const data = fs.readFileSync(optedInUsersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function saveOptedInUsers(optedInUsers) {
    const data = JSON.stringify(optedInUsers, null, 2);
    fs.writeFileSync(optedInUsersFilePath, data, 'utf8');
}
