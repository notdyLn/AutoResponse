const { SlashCommandBuilder } = require('discord.js');
const { ErrorEmbed, LoadingEmbed, SuccessEmbed } = require('../utils/embeds');
const config = require('../config/client.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('me')
        .setDescription('Send a message as AutoResponse')
        .addStringOption(option => option
            .setName('message')
            .setDescription('The message to send')
            .setRequired(true)
        )
        .setDMPermission(false),
    async execute(interaction) {
        try {
            const allowedUserId = config.ownerId;
            const userMessage = interaction.options.getString('message');
            const loadingEmbed = LoadingEmbed(`Loading`, `Sending message...`);
            const doneEmbed = SuccessEmbed(`Done`, `AutoResponse sent your message`);

            await interaction.reply({ embeds: [loadingEmbed], ephemeral: true });

            if (interaction.user.id !== allowedUserId) {
                const errorEmbed = ErrorEmbed('Error', `You do not have permission to use this command.`);
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.channel.send(userMessage);
                await interaction.editReply({ embeds: [doneEmbed], ephemeral: true });
            }
        } catch (error) {
            const errorEmbed = ErrorEmbed('Error executing /me', error.message);
            Error(`Error executing /me: ${error.message}`);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
};
