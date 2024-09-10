const { Error } = require("../../utils/logging");
const { registerCommands } = require('../../utils/registerCommands');

const getLeaderboards = require("../../utils/getLeaderboards");
const getSettings = require("../../utils/getSettings");

module.exports = {
    name: "ready",
    async execute(client) {
        try {
            await registerCommands(client);
            
            getLeaderboards();

            client.guilds.cache.forEach(async (guild) => {
                try {
                    await getSettings(guild.id, client);
                } catch (error) {
                    console.error(`Failed to get settings for guild ${guild.id}:`, error);
                }
            });

            return;
        } catch (error) {
            Error(`Error executing ${module.exports.name} event: ${error.message}`);
        }
    },
};
