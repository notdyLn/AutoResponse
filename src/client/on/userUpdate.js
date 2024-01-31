const output = require('../../console/output');

module.exports = (oldUser, newUser) => {
    try {
        output.debug(`User updated: ${oldUser.tag} -> ${newUser.tag}`);
    } catch (error) {
        output.error(`Error handling userUpdate: ${error.message}`);
    }
};
