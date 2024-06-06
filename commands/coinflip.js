const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { ErrorEmbed, CoinflipEmbed, LoadingEmbed } = require('../utils/embeds');
const { Error } = require('../utils/logging');
const { TEXT } = require('../utils/constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription(`Flip a coin`)
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    async execute(interaction) {
        try {
            const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
            const resultEmbed = CoinflipEmbed(result);

            await interaction.reply({ embeds: [resultEmbed], ephemeral: true });
        } catch (error) {
            const errorEmbed = ErrorEmbed('Error executing /coinflip', error.message);
            Error(`Error executing /coinflip: ${error.message}`);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
};
