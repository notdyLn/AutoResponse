const { Error, Info, Presence } = require('./logging');
const colors = require('colors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let activityIndex = 0;
let countingReplies = true;

module.exports = async (client) => {
    try {
        const dbPath = path.join(__dirname, "..", "data", "leaderboards.db");
        const db = new sqlite3.Database(dbPath);
        
        const queryReplies = `SELECT SUM(replies) AS totalReplies FROM current`;
        const queryRows = `SELECT COUNT(*) AS rowCount FROM current`;
        const query = countingReplies ? queryReplies : queryRows;
        
        db.get(query, [], (err, row) => {
            if (err) {
                Error(`Error querying database: ${err.message}`);
                return;
            }
            
            if (row) {
                let count;
                if (countingReplies) {
                    count = row.totalReplies !== null ? row.totalReplies : 0;
                } else {
                    count = row.rowCount !== null ? row.rowCount : 0;
                }
                
                const activityLabels = countingReplies ? ["Replies", "Being worked on..."] : ["Members", "Other activity..."];
                
                const activities = [
                    `${count} ${activityLabels[activityIndex]}`
                ];
                
                client.user.setPresence({
                    activities: [
                        {
                            name: activities[activityIndex],
                            type: 4
                        }
                    ],
                    status: "online"
                });
                
                activityIndex = (activityIndex + 1) % activities.length;
                countingReplies = !countingReplies;
            } else {
                Error(`No rows returned from the database.`);
            }
            
            db.close();
        });
    } catch (e) {
        Error(`Error updating presence: ${e.message}`);
    }
};
