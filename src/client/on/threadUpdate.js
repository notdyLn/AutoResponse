const output = require('../../console/output');

module.exports = (oldThread, newThread) => {
    try {
        output.debug(`Thread updated: ${oldThread} -> ${newThread}`);
    } catch (error) {
        output.error(`Error handling threadUpdate: ${error.message}`);
    }
};
