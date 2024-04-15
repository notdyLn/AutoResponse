const { channelDelete } = require('../../utils/logging');

module.exports = {
    name: 'channelDelete',
    execute(channel) {
        channelDelete(`${channel.guild} - #${channel.name} Deleted`);
    }
};