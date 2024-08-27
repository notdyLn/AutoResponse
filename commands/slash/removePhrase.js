const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { ErrorEmbed, SuccessEmbed } = require("../../utils/embeds");
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
        .setName("removephrase")
        .setDescription("Remove a phrase")
        .addStringOption(option => option
            .setName("phrase")
            .setDescription("The phrase to remove")
            .setRequired(true)
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        try {
            const phraseToRemove = interaction.options.getString("phrase");
            const serverId = interaction.guild.id;
            const db = initializeDatabase(serverId);

            const deletePhraseQuery = `DELETE FROM phrases WHERE phrase = ?`;

            db.run(deletePhraseQuery, [phraseToRemove], function (err) {
                if (err) {
                    Error(`Error removing phrase for server ${serverId}: ${err.message}`);
                    const errorEmbed = ErrorEmbed("Failed to remove the phrase from the database.");
                    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                }

                Info(`${interaction.user.username.cyan} removed the phrase "${phraseToRemove.cyan}"`);
                const successEmbed = SuccessEmbed("Removed Phrase Successfully", `\`\`\`"${phraseToRemove}" has been removed as a phrase.\`\`\``);
                interaction.reply({ embeds: [successEmbed], ephemeral: true });
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
