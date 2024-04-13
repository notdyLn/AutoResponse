const { shardReady } = require('../../utils/logging');

module.exports = {
    name: 'shardReady',
    execute(shardId) {
        shardReady(`Shard ${shardId} is ready`);
    }
};