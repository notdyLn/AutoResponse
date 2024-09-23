const { INTENTS } = require('./intents');
const { PARTIALS } = require('./partials');
const { DiscordJS, Invalid, Error, Warn, WarnNoDB } = require('../utils/logging');
const startServer = require('../utils/server');

const setPresence = require('../utils/setPresence');

const Discord = require('discord.js');
const { version: DJSVersion } = Discord;

const fs = require('fs');
const path = require('path');

require('dotenv').config();

const client = new Discord.Client({
    intents: INTENTS,
    partials: PARTIALS,
});

startServer(client);

DiscordJS(`DiscordJS v${DJSVersion}`);
client.login(process.env.TOKEN);

client.commands = new Discord.Collection();

const eventFiles = fs.readdirSync(path.resolve(__dirname, 'events')).filter(file => file.endsWith('.js'));

const verifiedEvents = [];
const missingEvents = [];
const invalidEvents = [];

const disabledEventsPath = path.resolve(__dirname, '..', 'data', 'disabledEvents.json');

let disabledEvents = [];

if (fs.existsSync(disabledEventsPath)) {
    const data = fs.readFileSync(disabledEventsPath);
    disabledEvents = JSON.parse(data).disabledEvents || [];
} else {
    Warn('No disabledEvents.json found.');
}

if (disabledEvents.length === 0) {
    WarnNoDB('No disabled events.');
}

for (const file of eventFiles) {
    try {
        const event = require(`./events/${file}`);
        
        if (event.name && disabledEvents.includes(event.name)) {
            WarnNoDB(`Disabled event: ${event.name}`);
            continue;
        }
        
        if (event.name && typeof event.execute === 'function') {
            verifiedEvents.push(event.name);
            client.on(event.name, async (...args) => {
                try {
                    await event.execute(...args);
                } catch (error) {
                    Error(`Error executing event ${event.name}:\n${error.stack}`);
                }
            });
        } else {
            invalidEvents.push(file);
        }
    } catch (error) {
        Error(error.stack);
        missingEvents.push(file);
    }
}

const allClientEvents = Object.keys(Discord.Client.prototype.constructor.name ? Discord.Client.prototype : Discord.Client);
const implementedEvents = new Set(verifiedEvents);

const missingClientEvents = allClientEvents.filter(event => !implementedEvents.has(event));

if (missingEvents.length > 0) {
    Invalid(missingEvents.join('\n'));
    missingEvents.forEach(file => Invalid(file));
}

if (invalidEvents.length > 0) {
    Invalid(invalidEvents.join('\n'));
    invalidEvents.forEach(file => Invalid(file));
}

if (missingClientEvents.length > 0) {
    Invalid(missingClientEvents.join('\n'));
}

setInterval(() => {
    setPresence(client);
}, 15000);

module.exports = client;