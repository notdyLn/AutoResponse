const colors = require("colors");
const sqlite3 = require("sqlite3").verbose();
const { Done, Error } = require("../utils/logging");
const path = require("path");

function getLeaderboards() {
    const leaderboardsFolderPath = path.join(__dirname, "..", "data");
    const dbPath = path.join(leaderboardsFolderPath, "leaderboards.db");

    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            return Error(`Error opening SQLite database: ${err.message}`);
        }

        db.serialize(() => {
            db.run(
                `CREATE TABLE IF NOT EXISTS current (
                    username TEXT,
                    userID INTEGER,
                    replies INTEGER,
                    groups TEXT
                )`,
                (err) => {
                    if (err) {
                        return Error(`Error creating table: ${err.message}`);
                    }
                }
            );

            db.all(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='current'",
                (err, tables) => {
                    if (err) {
                        return Error(`Error retrieving leaderboard tables: ${err.message}`);
                    }

                    if (tables.length > 0) {
                        Done(`Leaderboard ${colors.cyan(tables[0].name)} ${colors.green(`found`)}`);
                    } else {
                        Error("Leaderboard table not found");
                    }

                    db.close((err) => {
                        if (err) {
                            Error(`Error closing SQLite database: ${err.message}`);
                        }
                    });
                }
            );
        });
    });
}

module.exports = getLeaderboards;
