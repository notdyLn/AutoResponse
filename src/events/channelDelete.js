const { channelDelete } = require('../../utils/logging');

module.exports = {
    name: 'channelDelete',
    execute(channel) {
        channelDelete(`Channel deleted: ${channel.name} (${channel.id})`);
    }
};