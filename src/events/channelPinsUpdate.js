const { channelPinsUpdate } = require('../../utils/logging');

module.exports = {
    name: 'channelPinsUpdate',
    execute(channel, time) {
        channelPinsUpdate(`Pins updated for channel ${channel.name} (${channel.id}) at ${time}`);
    }
};