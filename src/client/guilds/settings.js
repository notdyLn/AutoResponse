const colors = require('colors');
const fs = require('fs');
const output = require('../../console/output');
const path = require('path');

function getGuildSettings(client) {
    client.guilds.cache.forEach(guild => {
        const settings = extractGuildSettings(guild);
        saveGuildSettingsToFile(guild, settings);
    });
}

function extractGuildSettings(guild) {
    const settings = {};
    for (const [key, value] of Object.entries(guild)) {
        if (typeof value !== 'function' && typeof value !== 'object') {
            settings[key] = value;
        }
    }
    return settings;
}

function saveGuildSettingsToFile(guild, settings) {
    try {
        const guildFolderPath = path.join(__dirname, '..', '..', '..', 'data', guild.name);
        if (!fs.existsSync(guildFolderPath)) {
            fs.mkdirSync(guildFolderPath, { recursive: true });
        }

        const settingsFilePath = path.join(guildFolderPath, 'information.json');

        const jsonSettings = JSON.stringify(settings, null, 2);
        fs.writeFileSync(settingsFilePath, jsonSettings);
        output.debug(`Guild settings updated for ${colors.cyan(guild.name)}`);
    } catch (error) {
        output.error(`Error handling guildSettings: ${error.message}`);
    }
}

module.exports = getGuildSettings;