const output = require('../../console/output');

module.exports = (shardId) => {
    try {
        output.debug(`Shard ${shardId} is reconencting...`);
    } catch (error) {
        output.error(`Error handling shardReady: ${error.message}`);
    }
};
