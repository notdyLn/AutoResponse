const colors = require('colors');
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '..', '..', 'logs');

if (!fs.existsSync(logFilePath)) {
    fs.mkdirSync(logFilePath);
}

module.exports = {
    clear: () => {
        console.clear();
    },

    info: (message) => {
        logMessage('Info', message, 'grey');
    },

    done: (message) => {
        logMessage('Done', message, 'green');
    },

    warn: (message) => {
        logMessage('Warn', message, 'yellow');
    },

    error: (message) => {
        logMessage('Error', message, 'red');
    },

    message: (message) => {
        logMessage('Message', message, 'blue');
    },

    voice: (message) => {
        logMessage('Voice', message, 'grey');
    },

    interaction: (message) => {
        logMessage('Command', message, 'magenta');
    },

    status: (message) => {
        logMessage('Status', message, 'grey');
    },

    react: (message) => {
        logMessage('React', message, 'grey');
    },

    delete: (message) => {
        logMessage('Delete', message, 'grey');
    },

    typing: (message) => {
        logMessage('Typing', message, 'grey');
    },

    role: (message) => {
        logMessage('Role', message, 'grey');
    },

    api: (message) => {
        logMessage('API', message, 'grey');
    },

    debug: (message) => {
        logMessage('Debug', message, 'grey');
    },

    reply: (message) => {
        logMessage('Reply', message, 'magenta');
    },

    update: (message) => {
        logMessage('Update', message, 'blue');
    },

    nothing: () => {},
};

function logMessage(type, message, color) {
    const timestamp = new Date().toLocaleTimeString('en-US', { timeZone: 'America/Chicago' });
    const formattedMessage = `${timestamp}\t\t${type}\t\t${message}`;
    const coloredMessage = colors[color](formattedMessage);

    const strippedMessage = coloredMessage.replace(/\x1b\[[0-9;]*m/g, '');

    console.log(coloredMessage);

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', { timeZone: 'America/Chicago' }).replace(/\//g, '-');
    const logFileName = path.join(logFilePath, `${formattedDate}.txt`);

    if (type !== 'Status' && type !== 'Debug' && type !== 'Typing') {
        fs.appendFileSync(logFileName, `${strippedMessage}\n`);
    }
}

