const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { LoadingEmbed, ErrorEmbed, SuccessEmbed } = require('../utils/embeds');
const { End, Error, Info, Warn, Debug } = require('../utils/logging');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearmessages')
        .setDescription('Delete all messages in the channel')
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {    
        try {
            const loadingEmbed = LoadingEmbed('Clearing messages...');
            await interaction.reply({ embeds: [loadingEmbed], ephemeral: true });

            Debug(interaction.channel.type);

            if (interaction.channel.type === 1) {
                const botMessages = await interaction.channel.messages.fetch({ limit: 100 });
                await Promise.all(botMessages.filter(msg => msg.author.id === interaction.client.user.id).map(msg => msg.delete()));
            } else {
                let fetched;
                do {
                    fetched = await interaction.channel.messages.fetch({ limit: 100 });
                    await interaction.channel.bulkDelete(fetched, true);
                } while (fetched.size >= 2);
            }

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
