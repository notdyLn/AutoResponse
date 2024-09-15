const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { Error, Done, Debug } = require('./logging');

const fs = require('fs');
const path = require('path');

const fetchCommandCount = async (client) => {
    try {
        const rest = new REST({ version: '10' }).setToken(client.token);
        const registeredCommands = await rest.get(Routes.applicationCommands(client.user.id));
        return registeredCommands.length;
    } catch (error) {
        Error('Failed to fetch commands:', error);
        return 0;
    }
};

const updateCommands = () => {
    const commands = [];
    const output = {};

    const commandFolders = ['slash', 'context'];
    commandFolders.forEach(folder => {
        const commandFolderPath = path.join(__dirname, '..', 'commands', folder);
        const commandFiles = fs
            .readdirSync(commandFolderPath)
            .filter(file => file.endsWith('.js'));

        if (!output[folder]) {
            output[folder] = [];
        }

        for (const file of commandFiles) {
            const commandPath = path.join(commandFolderPath, file);
            const command = require(commandPath);

            if (command.data && command.execute) {
                commands.push(command.data.toJSON());

                output[folder].push(command.data.name);
            }
        }
    });

    for (const [type, commandList] of Object.entries(output)) {
        Debug(`${type}\t┓`);
        commandList.forEach((command, index) => {
            const prefix = (index === commandList.length - 1) ? '┗' : '┣';
            Debug(`\t${prefix} ${command}`);
        });
    }

    return commands;
};

const registerCommands = async (client) => {
    const commands = updateCommands();
    const rest = new REST({ version: '10' }).setToken(client.token);

    try {
        const registeredCommands = await rest.put(Routes.applicationCommands(client.user.id), {
            body: commands,
        });

        const commandsWithIds = {};
        registeredCommands.forEach((cmd) => {
            commandsWithIds[cmd.name] = {
                id: cmd.id,
                ...cmd,
            };
        });

        const commandsFilePath = path.join(__dirname, '..', 'data', 'bot', 'commands.json');
        fs.mkdirSync(path.dirname(commandsFilePath), { recursive: true });

        try {
            fs.writeFileSync(commandsFilePath, JSON.stringify(commandsWithIds, null, 2));
            Done('Commands data with IDs successfully written to commands.json');
        } catch (error) {
            Error('Failed to write commands data to commands.json:', error);
        }

        const commandsCount = await fetchCommandCount(client);
        Done(`Successfully registered application commands. Total commands: ${commandsCount}`);
    } catch (error) {
        Error(`Failed to update commands: ${error.message}`);
    }
};

module.exports = { registerCommands, fetchCommandCount };