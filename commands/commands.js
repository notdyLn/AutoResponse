const { logToConsole } = require('../output/console');

const fs = require('fs');
const path = require('path');

function loadCommands(folder) {
    const commands = [];
    const commandFiles = fs.readdirSync(path.join(__dirname, folder)).filter(file => file.endsWith('.js'));

    logToConsole(`Looking for commands in the ${folder} folder...`, `info`); 

    for (const file of commandFiles) {
        const command = require(path.join(__dirname, folder, file));
        logToConsole(`\tCommand Found: ${file}`, `info`); 
        commands.push(command.data.toJSON());
    }

    return commands;
}

const publicCommands = loadCommands('public');
const privateCommands = loadCommands('private');
const ownerCommands = loadCommands('owner');

const allCommands = [...publicCommands, ...privateCommands, ...ownerCommands];

module.exports = allCommands;
