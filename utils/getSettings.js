const colors = require("colors");
const { debug, Error } = require("../utils/logging");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

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

function getSettings(serverId) {
    return new Promise((resolve, reject) => {
        const db = initializeDatabase(serverId);

        const settings = {
            replyChannels: [],
            trustedRoles: [],
            phrases: [],
        };

        db.all(`SELECT * FROM replyChannels`, [], (err, rows) => {
            if (err) {
                Error(
                    `Error retrieving replyChannels for server ${serverId}: ${err.message}`
                );
                reject(err);
                return;
            }
            settings.replyChannels = rows;
        });

        db.all(`SELECT * FROM trustedRoles`, [], (err, rows) => {
            if (err) {
                Error(
                    `Error retrieving trustedRoles for server ${serverId}: ${err.message}`
                );
                reject(err);
                return;
            }
            settings.trustedRoles = rows.map((row) => row.id);
        });

        db.all(`SELECT * FROM phrases`, [], (err, rows) => {
            if (err) {
                Error(
                    `Error retrieving phrases for server ${serverId}: ${err.message}`
                );
                reject(err);
                return;
            }
            settings.phrases = rows.map((row) => row.phrase);
        });

        db.close((err) => {
            if (err) {
                Error(
                    `Error closing database for server ${serverId}: ${err.message}`
                );
                reject(err);
                return;
            }
            resolve(settings);
        });
    });
}

module.exports = getSettings;
