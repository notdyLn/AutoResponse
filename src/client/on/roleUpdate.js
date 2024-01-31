const output = require('../../console/output');

module.exports = (oldRole, newRole) => {
    try {
        output.info(`Role updated: ${oldRole.name} -> ${newRole.name}`);
    } catch (error) {
        output.error(`Error handling roleUpdate: ${error.message}`);
    }
};
