const { userUpdate } = require('../../utils/logging');

module.exports = {
    name: 'userUpdate',
    execute(oldUser, newUser) {
        const changes = [];

        if (oldUser.username !== newUser.username) {
            changes.push(`${oldUser.username} updated their username: ${newUser.username}`);
        }
        if (oldUser.avatar !== newUser.avatar) {
            changes.push(`${oldUser.username} updated their avatar`);
        }
        if (changes.length > 0) {
            userUpdate(`${changes.join(', ')}`);
        }
    }
};
