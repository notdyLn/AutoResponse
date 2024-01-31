const output = require('../../console/output');

module.exports = (error) => {
    try {
        output.error(`${error.message}`);
    } catch (error) {
        output.error(`Error handling error: ${error.message}`);
    }
};