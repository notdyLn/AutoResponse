const { channelCreate } = require('../../utils/logging');

module.exports = {
    name: 'channelCreate',
    execute(channel) {
        channelCreate(`Channel created: ${channel.name} (${channel.id})`);
    }
};