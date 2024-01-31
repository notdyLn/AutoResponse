const output = require('../../console/output');

module.exports = (warning) => {
    try {
        output.warn(`Warning: ${warning}`);
    } catch (error) {
        output.error(`Error handling warning: ${error.message}`);
    }
};
