const { updatePresence } = require('./presence');
const { logToConsole } = require('../output/console');

const refreshCommands = require('../commands/refreshCommands');

module.exports = (client) => {
    refreshCommands(client);
    logToConsole(`Commands Updated`, `success`);
    updatePresence(client);
    logToConsole(`Logged in as ${client.user.tag}`, `success`);
};
