const { channelCreate } = require('../../utils/logging');

module.exports = {
    name: 'channelCreate',
    execute(channel) {
        channelCreate(`${channel.guild} - #${channel.name} Created`);
    }
};