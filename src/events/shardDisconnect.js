const { shardDisconnect } = require('../../utils/logging');

module.exports = {
    name: 'shardDisconnect',
    execute(event, id) {
        shardDisconnect(`Shard ${id} disconnected`);
    }
};