const output = require('../../console/output');

module.exports = (req) => {
    try {
        output.api(`${req}`);
    } catch (error) {
        output.error(`Error handling apiRequest: ${error.message}`);
    }
};
