const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, ApplicationIntegrationType } = require("discord.js");
const { ErrorEmbed, SuccessEmbed, InfoEmbed } = require("../../utils/embeds");
const { Error, Info } = require("../../utils/logging");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

function initializeDatabase(serverId) {
    const dbFilePath = path.join(__dirname, "..", "..", "data", `${serverId}.db`);
    const db = new sqlite3.Database(dbFilePath);

    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS phrases ( phrase TEXT PRIMARY KEY )`);
    });

    return db;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("listphrases")
        .setDescription("List all phrases")
        .setContexts(InteractionContextType.Guild, InteractionContextType.PrivateChannel)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        try {
            const serverId = interaction.guild.id;
            const db = initializeDatabase(serverId);

            const getPhrasesQuery = `SELECT phrase FROM phrases`;

            db.all(getPhrasesQuery, [], (err, rows) => {
                if (err) {
                    Error(`Error retrieving phrases for server ${serverId}: ${err.message}`);
                    const errorEmbed = ErrorEmbed("Failed to retrieve phrases from the database.");
                    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                }

                if (rows.length === 0) {
                    Info(`No phrases found for server ${serverId}`);
                    const noPhrasesEmbed = ErrorEmbed("No phrases have been added yet.");
                    return interaction.reply({ embeds: [noPhrasesEmbed] });
                }

                const phrasesList = rows.map(row => row.phrase).join("\n- ");
                Info(`Retrieved phrases for server ${serverId}`);
                const infoEmbed = InfoEmbed(`- ${phrasesList}`);
                interaction.reply({ embeds: [infoEmbed] });
            });
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
