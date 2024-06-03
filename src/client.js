const { INTENTS } = require('./intents');
const { Debug, DiscordJS, Valid, Invalid, Error, debug } = require('../utils/logging');

const Discord = require('discord.js');
const { version: DJSVersion } = Discord;

const fs = require('fs');
const path = require('path');

require('dotenv').config();

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
        }
    } catch (error) {
        Error(error.message);
        missingEvents.push(file);
    }
}

DiscordJS(`DiscordJS v${DJSVersion}`);
client.login(process.env.TOKEN);

Valid(verifiedEvents.join('\n'));

if (missingEvents.length > 0) {
    missingEvents.forEach(file => Invalid(file));
}

if (invalidEvents.length > 0) {
    invalidEvents.forEach(file => Invalid(file));
}

module.exports = client;