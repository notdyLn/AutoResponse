const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { ErrorEmbed, LoadingEmbed, SuccessEmbed } = require("../utils/embeds");
const { Error } = require("../utils/logging");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("me")
        .setDescription("Send a message as AutoResponse")
        .addStringOption((option) => option
            .setName("message")
            .setDescription("The message to send")
            .setRequired(true)
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        try {
            const allowedUserId = process.env.OWNERID;
            const userMessage = interaction.options.getString("message");
            const loadingEmbed = LoadingEmbed(`Loading`, `Sending message...`);

            await interaction.reply({ embeds: [loadingEmbed], ephemeral: true });

            if (interaction.user.id !== allowedUserId) {
                const errorEmbed = ErrorEmbed('Error', 'You do not have permission to use this command.');
                return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.channel.send(userMessage);
                await interaction.deleteReply();
            }
        } catch (error) {
            const errorEmbed = ErrorEmbed(`Error executing ${interaction.commandName}`, error.message);
            Error(`Error executing ${interaction.commandName}: ${error.message}`);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },
};
