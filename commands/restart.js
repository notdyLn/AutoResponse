const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { ErrorEmbed, RestartEmbed } = require("../utils/embeds");
const { End, Error, Info } = require("../utils/logging");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("restart")
        .setDescription("Restart AutoResponse")
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        try {
            const restartEmbed = RestartEmbed("Restarting");
            await interaction.reply({
                embeds: [restartEmbed],
                ephemeral: true,
            });

            const allowedUserId = process.env.OWNER_ID;
            if (interaction.user.id !== allowedUserId) {
                const errorEmbed = ErrorEmbed(
                    "Error",
                    "You do not have permission to use this command."
                );
                await interaction.reply({
                    embeds: [errorEmbed],
                    ephemeral: true,
                });
                return;
            } else {
                const restartEmbed = RestartEmbed("Restarted");
                await interaction.editReply({
                    embeds: [restartEmbed],
                    ephemeral: true,
                });

                await interaction.client.destroy();
                await new Promise((resolve) => setTimeout(resolve, 0));
                process.exit();
            }
        } catch (error) {
            const errorEmbed = ErrorEmbed(
                "Error executing /restart",
                error.message
            );
            Error(`Error executing /restart: ${error.message}`);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({
                    embeds: [errorEmbed],
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    embeds: [errorEmbed],
                    ephemeral: true,
                });
            }

            process.exit();
        }
    },
};
