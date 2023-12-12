const { logToConsole } = require('../output/console');

const fs = require("fs");

const updatePresence = (client) => {
    let presenceData;

    try {
        logToConsole(`Reading presence config...`, `info`);
        presenceData = JSON.parse(fs.readFileSync("./settings/presence.json", "utf-8"));
        logToConsole(`presence.json:\n\n${JSON.stringify(presenceData, null, 2)}\n`, `info`);
    } catch (error) {
        logToConsole(`Reading presence config: ${error}`, `error`);
    }
    
    try {
        logToConsole(`Setting client presence...`, `info`);
        client.user.setPresence(presenceData);
        logToConsole(`Client presence set`, `success`);
    } catch (error) {
        logToConsole(`Setting presence: ${error}`, `error`);
    }
};

module.exports = { updatePresence };
