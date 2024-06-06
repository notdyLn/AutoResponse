const { PermissionFlagsBits, SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { SuccessEmbed, ErrorEmbed } = require('../utils/embeds');
const { Info, Error } = require('../utils/logging');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('feedback')
        .setDescription('Submit feedback')
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    async execute(interaction) {
        try {
            const modal = new ModalBuilder()
                .setCustomId('feedbackModal')
                .setTitle('Feedback Form');

            const feedbackInput = new TextInputBuilder()
                .setCustomId('feedbackInput')
                .setLabel('Your Feedback')
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('Enter your feedback here...')
                .setRequired(true);

            const actionRow = new ActionRowBuilder().addComponents(feedbackInput);

            modal.addComponents(actionRow);

            await interaction.showModal(modal);
        } catch (error) {
            const errorEmbed = ErrorEmbed('Error executing /feedback', error);
            Error(`Error executing /feedback: ${error.message}`);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
};