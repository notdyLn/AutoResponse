const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { logToConsole } = require('../../output/console');
const { GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataFolderPath = path.join(__dirname, '../../data/servers');
const settingsFilePath = (serverId) => path.join(dataFolderPath, `${serverId}/settings.json`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setallowedrole')
        .setDescription('Set the allowed role for the bot')
        .addRoleOption(option => option
            .setName('role')
            .setDescription('Select the allowed role')
            .setRequired(true)),
    async execute(interaction) {
        const serverId = interaction.guildId;
        const roleId = interaction.options.getRole('role');

        if (!roleId) {
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle(`Please provide a valid role.`)
                .setTimestamp();

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {
            const guild = interaction.guild;
            const isServerOwner = guild && guild.ownerId === interaction.user.id;

            if (!isServerOwner) {
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle(`You must be the server owner to use this command.`)
                    .setTimestamp();

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (!fs.existsSync(dataFolderPath)) {
                fs.mkdirSync(dataFolderPath, { recursive: true });
            }

            const serverFolderPath = path.join(dataFolderPath, serverId);
            if (!fs.existsSync(serverFolderPath)) {
                fs.mkdirSync(serverFolderPath, { recursive: true });
            }

            if (!fs.existsSync(settingsFilePath(serverId))) {
                fs.writeFileSync(settingsFilePath(serverId), '{}', 'utf8');
            }

            const intents = interaction.client.options.intents;
            if (!(intents & GatewayIntentBits.GuildMembers) || !(intents & GatewayIntentBits.GuildMessages)) {
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle(`I need the "GUILD_MEMBERS" and "GUILD_MESSAGES" intents to set the allowed role.`)
                    .setTimestamp();

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const settings = loadSettings(serverId);

            settings.allowedRoleId = roleId.id;

            saveSettings(serverId, settings);

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle(`Allowed role set to "${roleId.name}"`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
            logToConsole(`Allowed role set for server ${serverId} to ${roleId.name}`, 'info');
        } catch (error) {
            const errorEmbed = createErrorEmbed(error);
            console.error(error);
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};

function loadSettings(serverId) {
    try {
        const settingsData = fs.readFileSync(settingsFilePath(serverId), 'utf8');
        return JSON.parse(settingsData);
    } catch (error) {
        return {};
    }
}

function saveSettings(serverId, settings) {
    const settingsData = JSON.stringify(settings, null, 2);
    fs.writeFileSync(settingsFilePath(serverId), settingsData, 'utf8');
}

function createErrorEmbed(error) {
    return new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('An Error Occurred:')
        .setDescription(`${error}`)
        .setTimestamp();
}