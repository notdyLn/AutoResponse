const colors = require('colors');
const fs = require('fs');
const output = require('../../console/output');
const path = require('path');

function getGuildEmojis(client) {
    client.guilds.cache.forEach(guild => {
        const emojis = extractGuildEmojis(guild);
        saveGuildEmojisToFile(guild, emojis);
    });
}

function extractGuildEmojis(guild) {
    const emojis = guild.emojis.cache.map(emoji => {
        return {
            id: emoji.id,
            name: emoji.name,
            animated: emoji.animated,
            imageURL: emoji.imageURL(),
        };
    });

    return emojis;
}

function saveGuildEmojisToFile(guild, emojis) {
    try {
        const guildFolderPath = path.join(__dirname, '..', '..', '..', 'data', guild.name, 'emojis',);
        if (!fs.existsSync(guildFolderPath)) {
            fs.mkdirSync(guildFolderPath, { recursive: true });
        }

        const emojisFilePath = path.join(guildFolderPath, 'emojis.json');

        const jsonEmojis = JSON.stringify(emojis, null, 2);
        fs.writeFileSync(emojisFilePath, jsonEmojis);
        output.debug(`Emojis updated for ${colors.cyan(guild.name)}`);
    } catch (error) {
        output.error(`Error handling guildEmojis: ${error.message}`);
    }
}

module.exports = getGuildEmojis;
