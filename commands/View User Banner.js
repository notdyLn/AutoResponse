const { ContextMenuCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { MediaEmbed, ErrorEmbed } = require("../utils/embeds");
const { Debug, Error } = require("../utils/logging");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("View User Banner")
        .setType(2)
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        try {
            const targetUser = await interaction.client.users.fetch(
                interaction.targetId,
                { force: true }
            );
            const bannerURL = targetUser.bannerURL({ size: 4096 });

            if (!bannerURL) {
                const errorEmbed = ErrorEmbed(
                    "Error",
                    `Could not retrieve ${targetUser}'s banner`
                );

                if (interaction.deferred || interaction.replied) {
                    return await interaction.editReply({
                        embeds: [errorEmbed],
                        ephemeral: true,
                    });
                } else {
                    return await interaction.reply({
                        embeds: [errorEmbed],
                        ephemeral: true,
                    });
                }
            }

            const mediaEmbed = MediaEmbed(bannerURL);
            await interaction.reply({ embeds: [mediaEmbed] });
        } catch (error) {
            const errorEmbed = ErrorEmbed(
                "Error executing View User Banner",
                error.message
            );
            Error(`Error executing View User Banner: ${error.message}`);

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
        }
    },
};
