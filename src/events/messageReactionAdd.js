const { messageReactionAdd } = require('../../utils/logging');

module.exports = {
    name: 'messageReactionAdd',
    execute(reaction, user) {
        messageReactionAdd(`Reaction added by ${user.username} (${user.id})`);
    }
};