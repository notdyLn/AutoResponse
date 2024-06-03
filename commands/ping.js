const { SlashCommandBuilder } = require('discord.js');
const { PingEmbed, LoadingEmbed, ErrorEmbed } = require('../utils/embeds');
const { BLOCK } = require('../utils/constants');
const { End, Error, Info, Warn } = require('../utils/logging');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check latency')
        .setDMPermission(true),
    async execute(interaction) {    
        const start = Date.now();

        try {
            const loadingEmbed = LoadingEmbed('Loading latency...');
            await interaction.reply({ embeds: [loadingEmbed], ephemeral: true });

            const wsping = interaction.client.ws.ping;

            if (wsping < 1) {
                const waitEmbed = ErrorEmbed('Error retrieving ping', 'A ping is being determined. Please wait a minute.');
                await interaction.editReply({ embeds: [waitEmbed], ephemeral: true });
            } else {
                let color;
                
                if (wsping < 75) {
                    color = 'green';
                } else {
                    color = 'red';
                }

                const restPing = Date.now() - start;
                const pingEmbed = PingEmbed(wsping, restPing, color);
                await interaction.editReply({ embeds: [pingEmbed], ephemeral: true });
            }
        } catch (error) {
            const errorEmbed = ErrorEmbed('Error executing /ping', error);
            Error(`Error executing /ping: ${error}`);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
};