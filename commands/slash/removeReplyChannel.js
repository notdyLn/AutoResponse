const { ChannelType, SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, ApplicationIntegrationType } = require("discord.js");
const { ErrorEmbed, SuccessEmbed } = require("../../utils/embeds");
const { Error, Info } = require("../../utils/logging");
const getSettings = require("../../utils/getSettings");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

function initializeDatabase(serverId) {
    const dbFilePath = path.join(__dirname, "..", "..", "data", `${serverId}.db`);
    const db = new sqlite3.Database(dbFilePath);

    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS replyChannels ( id TEXT PRIMARY KEY, chance INTEGER )`);
        db.run(`CREATE TABLE IF NOT EXISTS trustedRoles ( id TEXT PRIMARY KEY )`);
        db.run(`CREATE TABLE IF NOT EXISTS phrases ( phrase TEXT PRIMARY KEY )`);
    });

    return db;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removereplychannel")
        .setDescription("Remove a reply channel")
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("The channel to remove")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
        .setContexts(InteractionContextType.Guild, InteractionContextType.PrivateChannel)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        try {
            const serverId = interaction.guild.id;
            const serverSettings = await getSettings(serverId);
            const selectedChannel = interaction.options.getChannel("channel");
            const selectedChannelId = selectedChannel.id;

            const db = initializeDatabase(serverId);

            const indexToRemove = serverSettings.replyChannels.findIndex(
                (channel) => channel.id === selectedChannelId
            );

            if (indexToRemove !== -1) {
                serverSettings.replyChannels.splice(indexToRemove, 1);

                db.run(
                    `DELETE FROM replyChannels WHERE id = ?`,
                    [selectedChannelId],
                    function (err) {
                        if (err) {
                            const errorEmbed = ErrorEmbed("Failed to update the database.");
                            Error(`Error updating database for server ${serverId}: ${err.message}`);
                            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                        }

                        const successEmbed = SuccessEmbed("Removed Reply Channel Successfully", `<#${selectedChannel.id}> has been removed as a reply channel.`);
                        interaction.reply({ embeds: [successEmbed], ephemeral: true });
                    }
                );
            } else {
                const errorEmbed = ErrorEmbed(`<#${selectedChannel.id}> is not a reply channel.`);
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
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
