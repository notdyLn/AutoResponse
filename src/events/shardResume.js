const { shardResume } = require('../../utils/logging');

module.exports = {
    name: 'shardResume',
    execute(replayedEvents, shardId) {
        shardResume(`Shard ${shardId} has resumed. Replayed ${replayedEvents} events.`);
    }
};