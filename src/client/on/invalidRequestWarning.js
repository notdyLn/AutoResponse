const colors = require('colors');
const output = require('../../console/output');

module.exports = (invalidRequestWarningData) => {
    try {
        output.warn(`${invalidRequestWarningData}`);
    } catch (error) {
        output.error(`Error handling invalidRequestWarning: ${error.message}`);
    }
};
