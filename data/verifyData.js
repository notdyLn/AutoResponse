const fs = require('fs');
const path = require('path');
const { logToConsole } = require('../output/console');

const dataFolderPath = path.join(__dirname, 'servers');

const ensureDirectoryExists = (directory) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
};

const ensureFileExists = (filePath, defaultContent = '{}') => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, defaultContent, 'utf8');
    }
};

const verifyData = async (client) => {
    ensureDirectoryExists(dataFolderPath);

    client.once('ready', async () => {
        await sleep(100);

        logToConsole(`Verifying data...`, 'info');

        const optedInUsersPath = path.join(dataFolderPath, 'optedInUsers.json');
        ensureFileExists(optedInUsersPath, '[]');
        try {
            JSON.parse(fs.readFileSync(optedInUsersPath, 'utf8'));
            logToConsole(`Found ${optedInUsersPath}`, 'success');
        } catch (error) {
            logToConsole(`Invalid JSON format in optedInUsers.json for server "${serverId}"`, 'warn');
        }

        const serverFolders = fs.readdirSync(dataFolderPath);
        for (const serverId of serverFolders) {
            const serverPath = path.join(dataFolderPath, serverId);

            if (!fs.statSync(serverPath).isDirectory()) {
                continue;
            }

            const settingsFilePath = path.join(serverPath, 'settings.json');
            ensureFileExists(settingsFilePath);

            const settingsData = JSON.parse(fs.readFileSync(settingsFilePath, 'utf8'));
            if (settingsData.hasOwnProperty('allowedRoleId')) {
                try {
                    const guild = await client.guilds.fetch(serverId);

                    if (guild) {
                        const roleId = settingsData.allowedRoleId;
                        const role = guild.roles.cache.get(roleId);

                        logToConsole(`${guild.name}:`, 'info');

                        if (role) {
                            logToConsole(`\tRole:`, 'info');
                            logToConsole(`\t\t${role.name}`, 'info');
                        } else {
                            logToConsole(`\tThe role with ID "${roleId}" does not exist`, 'warn');
                        }

                        if (settingsData.hasOwnProperty('replyChannels')) {
                            const replyChannels = settingsData.replyChannels.map(channelId => {
                                const channel = guild.channels.cache.get(channelId);
                                return channel ? channel.name : `Unknown Channel (ID: ${channelId})`;
                            });

                            logToConsole(`\tReply Channels:`, 'info');
                            logToConsole(`\t\t#${replyChannels.join('\n\t\t\t\t\t\t\t\t\t#')}`);
                        }
                    } else {
                        logToConsole(`Server "${serverId}" does not exist`, 'warn');
                    }
                } catch (error) {
                    logToConsole(`Error getting data for "${serverId}": ${error}`, 'error');
                }
            }
        }

        const leaderboardFilePath = path.join(__dirname, 'leaderboard.json');
        ensureFileExists(leaderboardFilePath);

        logToConsole(`Data verified`, 'success');
    });
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = verifyData;