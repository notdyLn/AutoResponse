const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const cron = require('node-cron');
const fs = require('fs');
const output = require('../../console/output');
const path = require('path');
const setPresence = require('../user/setPresence');

const getGuildSettings = require('../guilds/settings');
const getGuildEmojis = require('../guilds/emojis');

const getLeaderboards = require('../../verifyFiles/getLeaderboards');
const getSettings = require('../../verifyFiles/getSettings');

function readCommandsFromFolder(folderPath) {
    const commands = [];
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

    output.debug(`Looking for commands in ${folderPath}`);

    for (const file of commandFiles) {
        const commandPath = path.join(folderPath, file);
        const command = require(commandPath);
        commands.push(command);

        output.debug(`Found command: /${path.basename(commandPath, '.js')}`);
    }

    return commands;
}

function updateBot(client) {
    setPresence(client);
    getGuildSettings(client);
    getGuildEmojis(client);

    client.guilds.cache.forEach(guild => {
        getSettings(guild.name);
    });

    getLeaderboards();

    const commands = [];

    const categories = ['Public', 'Admin', 'Owner'];
    for (const category of categories) {
        const categoryFolder = path.join(__dirname, '..', '..', '..', 'commands', category);
        const categoryCommands = readCommandsFromFolder(categoryFolder);

        const categoryCommandsJSON = categoryCommands.map(command => ({
            ...command.data.toJSON(),
            execute: command.execute,
        }));

        commands.push(...categoryCommandsJSON);
    }

    const rest = new REST({ version: '10' }).setToken(client.token);

    try {
        output.debug('Refreshing commands');

        rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );

        output.debug('Refreshed commands');
    } catch (error) {
        output.error(error.message);
    } finally {
        output.debug(`Online as ${client.user.tag}`);
    }
}

module.exports = async (client) => {
    updateBot(client);

    cron.schedule('*/60 * * * *', async () => {
        output.clear();
        updateBot(client);
    });
};
