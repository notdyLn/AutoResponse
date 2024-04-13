const { INTENTS } = require('./intents');
const { Invalid, Valid, Error } = require('../utils/logging');

const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '..', 'config', 'client.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const client = new Discord.Client({ intents: INTENTS });
client.commands = new Discord.Collection();

const eventFiles = fs.readdirSync(path.resolve(__dirname, 'events')).filter(file => file.endsWith('.js'));

const verifiedEvents = [];
const missingEvents = [];
const invalidEvents = [];

for (const file of eventFiles) {
    try {
        const event = require(`./events/${file}`);
        if (event.name && typeof event.execute === 'function') {
            verifiedEvents.push(event.name);
            client.on(event.name, (...args) => event.execute(...args));
        } else {
            invalidEvents.push(file);
            Error(`Failed to load event ${file}: ${error.message}`);
        }
    } catch (error) {
        missingEvents.push(file);
        Error(`Failed to load event ${file}: ${error.message}`);
    }
}

client.login(config.token);

Valid(verifiedEvents.join('\n'));

if (missingEvents.length > 0) {
    missingEvents.forEach(file => Invalid(file));
}

if (invalidEvents.length > 0) {
    invalidEvents.forEach(file => Invalid(file));
}

module.exports = client;