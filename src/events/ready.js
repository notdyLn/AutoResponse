const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { ready, Error, Valid } = require('../../utils/logging');

const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

const getLeaderboards = require('../../utils/getLeaderboards');
const getSettings = require('../../utils/getSettings');

const setPresence = require('../../utils/setPresence');

function updatePresence(client) {
    try {
        setPresence(client);
    } catch (e) {
        Error(`Failed to update presence: ${e.message}`);
    }
}

function updateCommands() {
    const commands = [];

    const commandFolder = path.join(__dirname, '..', '..', 'commands');
    const commandFiles = fs.readdirSync(commandFolder).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const commandPath = path.join(commandFolder, file);
        const command = require(commandPath);

        commands.push({
            ...command.data.toJSON(),
            execute: command.execute,
        });

        Valid(`/${command.data.name}`);
    }

    return commands;
}

module.exports = {
    name: 'ready',
    async execute(client) {
        try {
            updatePresence(client);

            client.guilds.cache.forEach(guild => {
                getSettings(guild.name);
            });

            getLeaderboards();

            const commands = updateCommands(client);
            const rest = new REST({ version: '10' }).setToken(client.token);

            try {
                await rest.put(
                    Routes.applicationCommands(client.user.id),
                    { body: commands },
                );
            } catch (e) {
                Error(`Failed to update commands: ${e.message}`);
            } finally {
                Valid(`Updated commands`);
            }
        } catch (e) {
            Error(`Failed to update commands: ${e.message}`);
        } finally {
            ready(`Ready as ${client.user.tag}`);

            cron.schedule('*/15 * * * * *', async () => {
                updatePresence(client);
            });
        }
    }
};
