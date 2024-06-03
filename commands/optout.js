const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { ErrorEmbed, SuccessEmbed } = require("../utils/embeds");
const { Error, Debug } = require("../utils/logging");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbFilePath = path.join(__dirname, "..", "data", "optoutlist.db");
const db = new sqlite3.Database(dbFilePath, (err) => {
    if (err) {
        Error(`Error connecting to SQLite database: ${err.message}`);
    } else {
        db.run(
            `CREATE TABLE IF NOT EXISTS optOutList (userId TEXT PRIMARY KEY, userTag TEXT UNIQUE)`,
            (err) => {
                if (err) {
                    Error(`Error creating table: ${err.message}`);
                }
            }
        );
    }
});

function getOptOutList() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT userId FROM optOutList`, [], (err, rows) => {
            if (err) {
                Error(`Error getting opt-out list: ${err.message}`);
                reject(err);
            } else {
                resolve(rows.map((row) => row.userId));
            }
        });
    });
}

function addToOptOutList(userId, userTag) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO optOutList (userId, userTag) VALUES (?, ?)`,
            [userId, userTag],
            (err) => {
                if (err) {
                    Error(`Error adding to opt-out list: ${err.message}`);
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("optout")
        .setDescription("Opt out of receiving replies")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    async execute(interaction) {
        try {
            const userId = interaction.user.id;
            const userTag = interaction.user.tag;
            const optOutList = await getOptOutList();

            if (!optOutList.includes(userId)) {
                await addToOptOutList(userId, userTag);

                const successEmbed = SuccessEmbed(
                    "Opted Out Successfully",
                    `You have opted out of receiving replies.\nUse **/optin** to start receiving replies again.`
                );
                await interaction.reply({
                    embeds: [successEmbed],
                    ephemeral: true,
                });
            } else {
                const errorEmbed = ErrorEmbed(
                    "Error",
                    `You are already opted out of receiving replies.\nUse **/optin** to start receiving replies again.`
                );
                await interaction.reply({
                    embeds: [errorEmbed],
                    ephemeral: true,
                });
            }
        } catch (error) {
            const errorEmbed = ErrorEmbed(
                "Error executing /optout: ",
                error.message
            );
            Error(`Error executing /optout: ${error.message}`);

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
