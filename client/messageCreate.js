const fs = require('fs');
const path = require('path');
const reply = require('./reply');

const dataFolderPath = path.join(__dirname, '../data/servers');

const ensureDirectoryExists = (directory) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
};

const messageCreate = (client) => {
    ensureDirectoryExists(dataFolderPath);
    reply(client);

    client.on('messageCreate', async (message) => {
        const serverId = message.guild?.id;

        if (!serverId || message.author.bot) {
            return;
        }

        const serverPath = path.join(dataFolderPath, serverId);
        const logsFolderPath = path.join(serverPath, 'logs');
        ensureDirectoryExists(logsFolderPath);

        const currentDate = new Date();
        const logFilePath = path.join(logsFolderPath, `${currentDate.toISOString().slice(0, 10)}.txt`);

        const logMessage = `${message.guild.name} - ${message.channel.name} - ${message.author.tag}: ${message.content}\n`;

        fs.appendFileSync(logFilePath, logMessage);

        const optedInUsersPath = path.join(dataFolderPath, 'optedInUsers.json');
        const optedInUsers = JSON.parse(fs.readFileSync(optedInUsersPath, 'utf8'));

        if (!optedInUsers.find(user => user.id === message.author.id)) {
            return;
        }
    });
};

module.exports = messageCreate;
