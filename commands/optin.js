const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { ErrorEmbed, SuccessEmbed } = require("../utils/embeds");
const { Error, Debug } = require("../utils/logging");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "..", "data", "optoutlist.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        Error(`Error connecting to SQLite database: ${err.message}`);
    }
});

db.run(
    `CREATE TABLE IF NOT EXISTS optOutList (userId TEXT PRIMARY KEY, userTag TEXT UNIQUE)`,
    (err) => {
        if (err) {
            Error(`Error creating table: ${err.message}`);
        }
    }
);

function getOptOutList(callback) {
    db.all(`SELECT userTag FROM optOutList`, (err, rows) => {
        if (err) {
            Error(`Error getting opt-out list: ${err.message}`);
            callback([]);
        } else {
            callback(rows.map((row) => row.userTag));
        }
    });
}

function updateOptOutList(userTag, callback) {
    db.run(
        `INSERT OR IGNORE INTO optOutList (userTag) VALUES (?)`,
        [userTag],
        (err) => {
            if (err) {
                Error(`Error updating opt-out list: ${err.message}`);
                callback(false);
            } else {
                callback(true);
            }
        }
    );
}

function removeUserFromOptOutList(userTag, callback) {
    db.run(
        `DELETE FROM optOutList WHERE userTag = ?`,
        [userTag],
        (err) => {
            if (err) {
                Error(`Error removing user from opt-out list: ${err.message}`);
                callback(false);
            } else {
                callback(true);
            }
        }
    );
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("optin")
        .setDescription("Opt in to receive replies")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    async execute(interaction) {
        try {
            const userTag = interaction.user.tag;
            const globalName = interaction.user.tag;

            getOptOutList((optOutList) => {
                if (!optOutList.includes(userTag)) {
                    const errorEmbed = ErrorEmbed(
                        "Error",
                        `You are already opted in to receive replies.\nUse **/optout** to stop receiving replies.`
                    );
                    return interaction.reply({
                        embeds: [errorEmbed],
                        ephemeral: true,
                    });
                }

                removeUserFromOptOutList(userTag, (success) => {
                    if (success) {
                        const successEmbed = SuccessEmbed(
                            "Opted In Successfully",
                            `You have opted in to receive replies.\nUse **/optout** to stop receiving replies.`
                        );
                        interaction.reply({
                            embeds: [successEmbed],
                            ephemeral: true,
                        });
                    } else {
                        const errorEmbed = ErrorEmbed(
                            "Error",
                            `Failed to opt in. Please try again later.`
                        );
                        interaction.reply({
                            embeds: [errorEmbed],
                            ephemeral: true,
                        });
                    }
                });
            });
        } catch (error) {
            const errorEmbed = ErrorEmbed(
                "Error executing /optin:",
                error.message
            );
            Error(`Error executing /optin: ${error.message}`);

            if (interaction.deferred || interaction.replied) {
                interaction.editReply({
                    embeds: [errorEmbed],
                    ephemeral: true,
                });
            } else {
                interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },
};
