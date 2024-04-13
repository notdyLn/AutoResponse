const { channelUpdate } = require('../../utils/logging');

module.exports = {
    name: 'channelUpdate',
    execute(oldChannel, newChannel) {
        const changes = [];

        if (oldChannel.name !== newChannel.name) {
            changes.push(`Channel name updated: ${oldChannel.name} => ${newChannel.name}`);
        }

        if (changes.length > 0) {
            channelUpdate(`Channel ${newChannel.name} (${newChannel.id}) updated: ${changes.join(', ')}`);
        }
    }
};