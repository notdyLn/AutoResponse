const { Client, GatewayIntentBits } = require('discord.js');
const { logToConsole } = require('../output/console');

const messageCreate = require('./messageCreate');
const onReady = require('./onReady');
const refreshCommands = require('../commands/refreshCommands');
const verifyData = require('../data/verifyData');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
    ],
});

client.setMaxListeners(25);

verifyData(client);
messageCreate(client);

client.once("ready", async () => {
    onReady(client, refreshCommands);
});

setInterval(async () => {
    logToConsole('Bot is doing its hourly restart...', 'warn');
    await sleep(5000);
    process.exit();
}, 60 * 60 * 1000);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = client;
