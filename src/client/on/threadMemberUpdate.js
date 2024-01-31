const output = require('../../console/output');

module.exports = (oldMember, newMember) => {
    try {
        output.debug(`Thread member updated: ${oldMember} -> ${newMember}`);
    } catch (error) {
        output.error(`Error handling threadMemberUpdate: ${error.message}`);
    }
};
