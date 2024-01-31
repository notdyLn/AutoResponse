const colors = require('colors');
const output = require('../../console/output');

module.exports = (channel) => {
    try {
        output.warn(`${channel}'s webhooks have changed`)
    } catch (error) {
        output.error(`Error handling webhookUpdate: ${error.message}`);
    }
};
