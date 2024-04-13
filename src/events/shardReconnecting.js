const { shardReconnecting } = require('../../utils/logging');

module.exports = {
    name: 'shardReconnecting',
    execute(event, id) {
        shardReconnecting(`Shard ${id} is reconnecting...`);
    }
};