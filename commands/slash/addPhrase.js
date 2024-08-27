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
        .setName("addphrase")
        .setDescription("Add a phrase")
        .addStringOption(option => option
            .setName("phrase")
            .setDescription("The phrase to add")
            .setRequired(true)
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        try {
            const phrase = interaction.options.getString("phrase");
            const serverId = interaction.guild.id;
            const db = initializeDatabase(serverId);

            const checkPhraseExistsQuery = `SELECT COUNT(*) AS count FROM phrases WHERE phrase = ?`;

            db.get(checkPhraseExistsQuery, [phrase], (err, row) => {
                if (err) {
                    Error(`Error checking if phrase exists for server ${serverId}: ${err.message}`);
                    const errorEmbed = ErrorEmbed("Error", "Failed to check the phrase in the database.");
                    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                }

                if (row.count > 0) {
                    Info(`"${phrase.cyan}" already exists`);
                    const alreadyAddedEmbed = ErrorEmbed(`"${phrase}" is already a phrase.`);
                    interaction.reply({ embeds: [alreadyAddedEmbed], ephemeral: true });
                } else {
                    const insertPhraseQuery = `INSERT INTO phrases (phrase) VALUES (?)`;

                    db.run(insertPhraseQuery, [phrase], function (err) {
                        if (err) {
                            Error(`Error adding phrase for server ${serverId}: ${err.message}`);
                            const errorEmbed = ErrorEmbed("Failed to add the phrase to the database.");
                            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                        }

                        Info(`${interaction.user.username.cyan} added the phrase "${phrase.cyan}"`);
                        const successEmbed = SuccessEmbed("Added Phrase Successfully", `\`\`\`"${phrase}" has been added as a phrase.\`\`\``);
                        interaction.reply({ embeds: [successEmbed], ephemeral: true });
                    });
                }
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
