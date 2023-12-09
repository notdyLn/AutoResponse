const { SlashCommandBuilder } = require('@discordjs/builders');
const { logToConsole } = require('../../output/console');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataFolderPath = path.join(__dirname, '../../data/servers');
const settingsFilePath = (serverId) => path.join(dataFolderPath, `${serverId}/settings.json`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removereplychannel')
        .setDescription('Remove a reply channel')
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('Select the reply channel to remove')
            .setRequired(true)),
    async execute(interaction) {
        const serverId = interaction.guildId;
        const memberId = interaction.user.id;
        const channelId = interaction.options.getChannel('channel');

        const allowedRoleId = loadSettings(serverId).allowedRoleId;
        const member = await interaction.guild.members.fetch(memberId);
        if (!member.roles.cache.has(allowedRoleId)) {
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle(`You do not have permission to use this command.`)
                .setTimestamp();

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (!channelId) {
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle(`Please provide a valid channel.`)
                .setTimestamp();

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {
            const settings = loadSettings(serverId);

            settings.replyChannels = settings.replyChannels || [];

            const channelIndex = settings.replyChannels.indexOf(channelId.id);

            if (channelIndex === -1) {
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle(`"${channelId.name}" is not a reply channel.`)
                    .setTimestamp();

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            settings.replyChannels.splice(channelIndex, 1);
            delete settings.channelChances[channelId.id];

            saveSettings(serverId, settings);

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle(`Reply channel removed: "${channelId.name}"`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
            logToConsole(`Reply channel removed for server ${serverId}: ${channelId.name}`, 'info');
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