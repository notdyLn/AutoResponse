const { Error } = require('./logging');
const { DefaultWebSocketManagerOptions: { identifyProperties } } = require("@discordjs/ws");

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let activityIndex = 0;
let countingReplies = true;

// Discord iOS
// Discord Android
// null = Discord Desktop

identifyProperties.browser = 'Discord iOS';

module.exports = async (client) => {
    try {
        const dbPath = path.join(__dirname, "..", "data", "leaderboards.db");
        const db = new sqlite3.Database(dbPath);
        
        const queryReplies = `SELECT SUM(replies) AS totalReplies FROM current`;
        const queryRows = `SELECT COUNT(*) AS rowCount FROM current`;
        const query = countingReplies ? queryReplies : queryRows;
        
        db.get(query, [], (err, row) => {
            if (err) {
                return Error(`Error querying database: ${err.message}`);
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
    } catch (error) {
        Error(`Error updating presence: ${error.message}`);
    }
};
