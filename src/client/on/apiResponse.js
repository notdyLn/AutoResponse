const output = require('../../console/output');

module.exports = (res) => {
    try {
        output.api(`${res}`);
    } catch (error) {
        output.error(`Error handling apiResponse: ${error.message}`);
    }
};
