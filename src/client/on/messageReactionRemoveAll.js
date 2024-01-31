const colors = require('colors');
const output = require('../../console/output');

module.exports = (message) => {
    try {
        output.delete(`${colors.white('All reactions removed from')} ${colors.white(message.content)}`);
    } catch (error) {
        output.error(`Error handling messageReactionRemoveAll: ${error.message}`);
    }
};
