const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { Error } = require("./logging");

function updateLeaderboard(userTag, userID) {
    try {
        const dbPath = path.join(__dirname, "..", "data", "leaderboards.db");
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                return Error(`Error opening SQLite database: ${err.message}`);
            }

            db.serialize(() => {
                db.run(
                    `CREATE TABLE IF NOT EXISTS current (
                        username TEXT,
                        userID TEXT PRIMARY KEY,
                        replies INTEGER DEFAULT 0,
                        groups TEXT
                    )`,
                    (createErr) => {
                        if (createErr) {
                            Error(`Error creating table: ${createErr.message}`);
                            db.close();
                            return;
                        }

                        db.get(
                            `SELECT userID FROM current WHERE userID = ?`,
                            [userID],
                            (selectErr, row) => {
                                if (selectErr) {
                                    Error(
                                        `Error selecting user from leaderboard: ${selectErr.message}`
                                    );
                                    db.close();
                                    return;
                                }

                                if (row) {
                                    db.run(
                                        `UPDATE current SET replies = replies + 1 WHERE userID = ?`,
                                        [userID],
                                        (updateErr) => {
                                            if (updateErr) {
                                                Error(
                                                    `Error updating leaderboard: ${updateErr.message}`
                                                );
                                            }
                                            db.close();
                                        }
                                    );
                                } else {
                                    db.run(
                                        `INSERT INTO current (username, userID, replies)
                                        VALUES (?, ?, 1)`,
                                        [userTag, userID],
                                        (insertErr) => {
                                            if (insertErr) {
                                                Error(
                                                    `Error inserting into leaderboard: ${insertErr.message}`
                                                );
                                            }
                                            db.close();
                                        }
                                    );
                                }
                            }
                        );
                    }
                );
            });
        });
    } catch (error) {
        Error(`Error updating leaderboard: ${error.message}`);
    }
}

module.exports = updateLeaderboard;
