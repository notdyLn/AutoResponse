const replyCooldownsDbPath = path.join(__dirname, "..", "..", "data", "ReplyCooldowns.db");

const replyCooldownsDb = new sqlite3.Database(replyCooldownsDbPath, (err) => {
    if (err) {
        Error(`Error connecting to SQLite database: ${err.message}`);
    }
});

function initializeReplyCooldownTable(serverId) {
    replyCooldownsDb.run(
        `CREATE TABLE IF NOT EXISTS ${serverId} (channelId TEXT PRIMARY KEY, timeRemaining INTEGER)`,
        (err) => {
            if (err) {
                Error(`Error creating table for server ${serverId}: ${err.message}`);
            }
        }
    );
}