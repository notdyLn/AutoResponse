const output = require('../../console/output');

module.exports = (shardId, replayedEvents) => {
    try {
        output.debug(`Shard ${shardId} resumed: ${replayedEvents}`);
    } catch (error) {
        output.error(`Error handling shardReady: ${error.message}`);
    }
};
