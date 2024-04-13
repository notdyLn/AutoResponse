const { SlashCommandBuilder } = require('discord.js');
const { StatsEmbed, ErrorEmbed } = require('../utils/embeds');
const { End, Error, Info } = require('../utils/logging');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Get information about AutoResponse')
        .setDMPermission(false),
    async execute(interaction) {
        try {
            const { client } = interaction;

            const serversCount = client.guilds.cache.size;
            const shardsCount = client.ws.shards.size;
            let uptimeSeconds = process.uptime();

            let uptimeFormatted = '';

            if (uptimeSeconds >= 86400) {
                const days = Math.floor(uptimeSeconds / 86400);
                uptimeFormatted += `${days}d `;
                uptimeSeconds %= 86400;
            }

            if (uptimeSeconds >= 3600) {
                const hours = Math.floor(uptimeSeconds / 3600);
                uptimeFormatted += `${hours}h `;
                uptimeSeconds %= 3600;
            }

            if (uptimeSeconds >= 60) {
                const minutes = Math.floor(uptimeSeconds / 60);
                uptimeFormatted += `${minutes}m `;
                uptimeSeconds %= 60;
            }

            if (uptimeSeconds > 0 || uptimeFormatted === '') {
                uptimeFormatted += `${uptimeSeconds.toFixed(0)}s`;
            }

            const botInfoEmbed = StatsEmbed( serversCount, shardsCount, uptimeFormatted );
            await interaction.reply({ embeds: [botInfoEmbed], ephemeral: true });
        } catch (error) {
            const errorEmbed = ErrorEmbed('Error retrieving bot info', error.message);
            Error(`Error retrieving bot info: ${error.message}`);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
};