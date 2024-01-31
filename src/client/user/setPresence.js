const fs = require('fs');
const path = require('path');
const presenceFile = path.join(__dirname, '../../../config/presence.json');
const output = require('../../console/output');

module.exports = (client) => {
    try {
        output.debug(`Updating presence...`);
        const presenceData = JSON.parse(fs.readFileSync(presenceFile, 'utf-8'));
        client.user.setPresence(presenceData);
        output.debug(`Presence updated`);
    } catch (error) {
        output.error(`Setting Presence: ${error.message}`);
    }
};
