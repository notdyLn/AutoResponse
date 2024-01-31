const output = require('../../console/output');

module.exports = (shardId) => {
    try {
        output.debug(`Shard ${shardId} - Ready`);
    } catch (error) {
        output.error(`Error handling shardReady: ${error.message}`);
    }
};
