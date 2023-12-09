const { handleInteraction } = require('../client/interactionCreate');

const fs = require('fs');
const path = require('path');
const client = require('../client/client');
const configPath = path.join(__dirname, '..', 'settings', 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const token = config.token;

client.on('interactionCreate', handleInteraction);

client.login(token);