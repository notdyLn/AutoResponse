const { PermissionFlagsBits, SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType } = require("discord.js");
const { ErrorEmbed, LoadingEmbed, SuccessEmbed } = require("../../utils/embeds");
const { Error } = require("../../utils/logging");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rename")
        .setDescription("Rename AutoResponse in this server")
        .addStringOption((option) => option
            .setName("name")
            .setDescription("The name of AutoResponse")
            .setRequired(true)
        )
        .setContexts(InteractionContextType.Guild, InteractionContextType.PrivateChannel)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        try {
            const userName = interaction.options.getString("name");

            const loadingEmbed = LoadingEmbed(`Renaming...`);
            await interaction.reply({ embeds: [loadingEmbed], ephemeral: true });

            const botMember = interaction.guild.members.me;
            await botMember.setNickname(userName);


            const successEmbed = SuccessEmbed(`Renamed`, `Changed name to \` ${userName} \``);
            await interaction.editReply({ embeds: [successEmbed], ephemeral: true });
        } catch (error) {
            Error(`Error executing ${interaction.commandName}: ${error.stack}`);

            const errorEmbed = ErrorEmbed(`Error executing ${interaction.commandName}:\n${error.message}`);
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },
};
