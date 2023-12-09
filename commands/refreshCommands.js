const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const allCommands = require('./commands');
const config = require('../settings/config.json');

const { token, clientId } = config;

async function refreshCommands() {
    try {
        const rest = new REST({ version: '9' }).setToken(token);
        await rest.put(Routes.applicationCommands(clientId), { body: allCommands });
    } catch (error) {
        console.error(error);
    }
}

module.exports = refreshCommands;