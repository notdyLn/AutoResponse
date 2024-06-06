const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { LoadingEmbed, ErrorEmbed, SuccessEmbed } = require('../utils/embeds');
const { End, Error, Info, Warn } = require('../utils/logging');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearmessages')
        .setDescription('Delete all messages in the channel')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {    
        try {
            const loadingEmbed = LoadingEmbed('Clearing messages...');
            await interaction.reply({ embeds: [loadingEmbed], ephemeral: true });

            const channel = interaction.channel;

            if (!channel) {
                const errorEmbed = ErrorEmbed('Error clearing messages', 'Channel not found.');
                await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
                return;
            }

            let fetched;
            do {
                fetched = await channel.messages.fetch({ limit: 100 });
                await channel.bulkDelete(fetched, true);
            } while (fetched.size >= 2);

            const successEmbed = SuccessEmbed('Cleared Messages', 'All messages cleared successfully.');
            await interaction.editReply({ embeds: [successEmbed], ephemeral: true });
        } catch (error) {
            const errorEmbed = ErrorEmbed('Error executing /clearmessages', error);
            Error(`Error executing /clearmessages: ${error}`);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
};
