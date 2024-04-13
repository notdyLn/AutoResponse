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
        try {
            const loadingEmbed = LoadingEmbed('Loading latency...');
            await interaction.reply({ embeds: [loadingEmbed], ephemeral: true });

            const wsping = interaction.client.ws.ping;

            if (wsping < 1) {
                const waitEmbed = ErrorEmbed('Error retrieving ping', 'A ping is being determined. Please wait a minute.');
                await interaction.editReply({ embeds: [waitEmbed], ephemeral: true });
            } else {
                let color;
                
                if (wsping < 60) {
                    color = BLOCK.green;
                } else {
                    color = BLOCK.red;
                }

                const pingEmbed = PingEmbed(`${wsping}ms`, color);
                await interaction.editReply({ embeds: [pingEmbed], ephemeral: true });
            }
        } catch (error) {
            const errorEmbed = ErrorEmbed('Error executing /ping', error.message);
            Error(`Error executing /ping: ${error.message}`);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
};