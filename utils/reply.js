const { Error, Warn } = require("../utils/logging");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const updateLeaderboard = require("./updateLeaderboard");

function initializeDatabase(serverId) {
    const dbFilePath = path.join(__dirname, "..", "data", `${serverId}.db`);
    const db = new sqlite3.Database(dbFilePath);
    return db;
}

function getPhrases(db) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT phrase FROM phrases`, [], (err, rows) => {
            if (err) {
                Error(`Error getting phrases: ${err.message}`);
                reject(err);
            } else {
                resolve(rows.map((row) => row.phrase));
            }
        });
    });
}

module.exports = async (message) => {
    const serverId = message.guild ? message.guild.id : "global";
    const userTag = message.author.tag;
    const userID = message.author.id;
    const serverName = message.guild ? message.guild.name : "Unknown Server";
    const db = initializeDatabase(serverId);

    try {
        const phrases = await getPhrases(db);

        if (phrases.length > 0) {
            const randomIndex = Math.floor(Math.random() * phrases.length);
            const randomPhrase = phrases[randomIndex];

            updateLeaderboard(userTag, userID);

            await message.reply({
                content: randomPhrase,
                allowedMentions: { repliedUser: false },
            });
        } else {
            Warn(
                `No reply phrases found in the database for server ${serverName}`
            );
        }
    } catch (error) {
        Error(`Error replying to user: ${error.message}`);
    } finally {
        db.close();
    }
};
