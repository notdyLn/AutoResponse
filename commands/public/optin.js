const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { logToConsole } = require('../../output/console');
const fs = require('fs');
const path = require('path');

const optedInUsersFilePath = path.join(__dirname, '../../data/servers/optedInUsers.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('optin')
        .setDescription('Opt in to receive responses'),

    async execute(interaction) {
        let optedInUsers = loadOptedInUsers();

        if (optedInUsers.some(user => user.id === interaction.user.id)) {
            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('You are already opted in.')
                .setTimestamp();

            logToConsole(`${interaction.user.tag} is already added`, 'info');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        optedInUsers.push({
            id: interaction.user.id,
            username: interaction.user.username,
        });

        saveOptedInUsers(optedInUsers);

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('You have opted in!')
            .setDescription('Use **/optout** to opt out.')
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
        logToConsole(`Added ${interaction.user.tag}`, 'info');
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
