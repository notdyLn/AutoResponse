const { messageReactionRemove } = require('../../utils/logging');

module.exports = {
    name: 'messageReactionRemove',
    execute(reaction, user) {
        messageReactionRemove(`Reaction removed by ${user.username} (${user.id})`);
    }
};