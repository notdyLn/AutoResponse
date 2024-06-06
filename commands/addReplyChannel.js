const { ChannelType, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { ErrorEmbed, SuccessEmbed } = require("../utils/embeds");
const { Error, Info } = require("../utils/logging");
const getSettings = require("../utils/getSettings");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

function initializeDatabase(serverId) {
    const dbFilePath = path.join(__dirname, "..", "data", `${serverId}.db`);
    const db = new sqlite3.Database(dbFilePath);

    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS replyChannels (
      id TEXT PRIMARY KEY,
      chance INTEGER
    )`);
        db.run(`CREATE TABLE IF NOT EXISTS trustedRoles (
      id TEXT PRIMARY KEY
    )`);
        db.run(`CREATE TABLE IF NOT EXISTS phrases (
      phrase TEXT PRIMARY KEY
    )`);
    });

    return db;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addreplychannel")
        .setDescription("Add a reply channel")
        .addChannelOption((option) =>
            option
                .setName("channel")
                .setDescription("The channel to add")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        try {
            const serverId = interaction.guild.id;
            const serverSettings = await getSettings(serverId);
            const selectedChannel = interaction.options.getChannel("channel");
            const selectedChannelId = selectedChannel.id;

            const db = initializeDatabase(serverId);

            if (
                !serverSettings.replyChannels.some(
                    (channel) => channel.id === selectedChannelId
                )
            ) {
                serverSettings.replyChannels.push({
                    id: selectedChannelId,
                    chance: 6,
                });

                db.run(
                    `INSERT INTO replyChannels (id, chance) VALUES (?, ?)`,
                    [selectedChannelId, 6],
                    function (err) {
                        if (err) {
                            const errorEmbed = ErrorEmbed(
                                "Error",
                                "Failed to update the database."
                            );
                            Error(
                                `Error updating database for server ${serverId}: ${err.message}`
                            );
                            interaction.reply({
                                embeds: [errorEmbed],
                                ephemeral: true,
                            });
                            return;
                        }

                        const successEmbed = SuccessEmbed(
                            "Added Reply Channel Successfully",
                            `<#${selectedChannel.id}> has been added as a reply channel.`
                        );
                        interaction.reply({
                            embeds: [successEmbed],
                            ephemeral: true,
                        });
                    }
                );
            } else {
                const errorEmbed = ErrorEmbed(
                    "Error",
                    `<#${selectedChannel.id}> is already a reply channel.`
                );
                await interaction.reply({
                    embeds: [errorEmbed],
                    ephemeral: true,
                });
            }
        } catch (error) {
            const errorEmbed = ErrorEmbed(
                "Error executing /addReplyChannel: ",
                error.message
            );
            Error(`Error executing /addReplyChannel: ${error.message}`);

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
