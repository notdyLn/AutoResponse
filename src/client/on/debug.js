const output = require('../../console/output');

module.exports = () => {
    try {
        output.nothing();
    } catch (error) {
        output.error(`Error handling debug: ${error.message}`);
    }
};
