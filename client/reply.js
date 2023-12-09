const { logToConsole } = require('../output/console');
const fs = require('fs');
const path = require('path');

const dataFolderPath = path.join(__dirname, '../data/servers');

const ensureDirectoryExists = (directory) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
};

const saveSettings = (filePath, settings) => {
    try {
        const settingsFilePath = fs.statSync(filePath).isDirectory()
            ? path.join(filePath, 'settings.json')
            : filePath;

        const settingsData = JSON.stringify(settings, null, 2);
        fs.writeFileSync(settingsFilePath, settingsData, 'utf8');
    } catch (error) {
        logToConsole(`Error saving settings to ${filePath}: ${error.message}`, 'error');
    }
};


const reply = (client) => {
    ensureDirectoryExists(dataFolderPath);

    client.once('ready', () => {
        logToConsole('Bot is ready. Fetching current channel chances...', 'info');
        fetchChannelChances(client);
    });

    client.on('messageCreate', async (message) => {
        const serverId = message.guild?.id;
    
        if (!serverId || message.author.bot) {
            return;
        }
    
        const serverPath = path.join(dataFolderPath, serverId);
        const settingsFilePath = path.join(serverPath, 'settings.json');
    
        const settingsData = JSON.parse(fs.readFileSync(settingsFilePath, 'utf8'));
    
        if (settingsData.hasOwnProperty('replyChannels')) {
            const replyChannels = settingsData.replyChannels;
    
            if (replyChannels.includes(message.channel.id) && message.author.id !== client.user.id) {
                const optedInUsersPath = path.join(dataFolderPath, 'optedInUsers.json');
                const optedInUsers = JSON.parse(fs.readFileSync(optedInUsersPath, 'utf8'));
    
                const isOptedInUser = optedInUsers.some(user => user.id === message.author.id);
    
                if (!isOptedInUser) {
                    return;
                }
    
                const channelChances = settingsData.channelChances || {};
                const channelId = message.channel.id;
                const channelChance = channelChances[channelId] || settingsData.replyChance || 6;
    
                logToConsole(`${channelChance}% - ${message.guild.name} - #${message.channel.name} - ${message.author.tag}: ${message.content}`, 'message');
    
                if (Math.random() * 100 < channelChance) {
                    const randomPhrase = getRandomPhrase(serverId);
                    await message.reply({ content: randomPhrase, allowedMentions: { repliedUser: false } });
                    updateLeaderboard(serverId, message.author);
                    resetChance(serverPath, channelId);
                } else {
                    incrementChance(serverPath, settingsData, channelId);
                }
            }
        }
    });    
};

function fetchChannelChances(client) {
    client.guilds.cache.forEach(async (guild) => {
        const serverId = guild.id;
        const serverPath = path.join(dataFolderPath, serverId);
        const settingsFilePath = path.join(serverPath, 'settings.json');

        if (fs.existsSync(settingsFilePath)) {
            const settingsData = JSON.parse(fs.readFileSync(settingsFilePath, 'utf8'));
            const channelChances = settingsData.channelChances || {};

            logToConsole(`Fetching current channel chances for the server "${guild.name}"...`, 'info');

            guild.channels.cache.forEach((channel) => {
                if (channel.type === 'GUILD_TEXT') {
                    const channelId = channel.id;
                    const currentChance = channelChances[channelId] || settingsData.replyChance || 6;
                    logToConsole(`\t#${channel.name}: ${currentChance}%`, 'info');
                }
            });
        }
    });
}

function getRandomPhrase(serverId) {
    const phrasesFilePath = path.join(dataFolderPath, `${serverId}/phrases.json`);
    
    try {
        if (fs.existsSync(phrasesFilePath)) {
            const phrases = JSON.parse(fs.readFileSync(phrasesFilePath, 'utf8'));
            
            if (phrases.length > 0) {
                return phrases[Math.floor(Math.random() * phrases.length)];
            }
        }
    } catch (error) {
        logToConsole(`Error reading phrases file for server ${serverId}: ${error.message}`, 'error');
    }
    
    return null;
}

function updateLeaderboard(serverId, author) {
    const leaderboardFilePath = path.join(__dirname, '../data/leaderboard.json');

    try {
        let leaderboard = JSON.parse(fs.readFileSync(leaderboardFilePath, 'utf8'));

        if (typeof leaderboard !== 'object' || leaderboard === null) {
            leaderboard = {};
        }

        const username = author?.tag;

        if (username) {
            if (leaderboard.hasOwnProperty(username)) {
                leaderboard[username] += 1;
            } else {
                leaderboard[username] = 1;
            }

            fs.writeFileSync(leaderboardFilePath, JSON.stringify(leaderboard, null, 2), 'utf8');

            logToConsole(`Leaderboard updated`, 'info');
        } else {
            logToConsole(`Error updating leaderboard: Invalid or undefined message author`, 'error');
        }
    } catch (error) {
        logToConsole(`Error updating leaderboard: ${error}`, 'error');
    }
}

function resetChance(directoryPath, channelId) {
    const filePath = path.join(directoryPath, 'settings.json');

    logToConsole(`Resetting Chance...`, 'info');

    if (fs.existsSync(filePath)) {
        try {
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                logToConsole(`Error: ${filePath} is a directory. Expected a file.`, 'error');
                return;
            }

            const settingsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            if (channelId) {
                const channelChances = settingsData.channelChances || {};
                channelChances[channelId] = 6;

                settingsData.channelChances = channelChances;
                saveSettings(filePath, settingsData);

                logToConsole(`Chance reset for ${channelId}.`, 'info');
            } else {
                logToConsole(`Channel ID is not provided. Skipping chance reset.`, 'info');
            }
        } catch (error) {
            logToConsole(`Error reading or updating settings: ${error.message}`, 'error');
        }
    } else {
        logToConsole(`Error: Settings file not found at ${filePath}`, 'error');
    }
}

function incrementChance(filePath, settingsData, channelId) {
    const channelChances = settingsData.channelChances || {};
    const currentChance = channelChances[channelId] || settingsData.replyChance || 6;
    const newChance = Math.min(currentChance + 1, 100);

    channelChances[channelId] = newChance;

    settingsData.channelChances = channelChances;
    saveSettings(filePath, settingsData);
}

module.exports = reply;