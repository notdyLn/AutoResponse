const output = require('../../console/output');

module.exports = (event, shardId) => {
    try {
        output.warn(`Shard ${shardId} disconnected: ${event}`);
    } catch (error) {
        output.error(`Error handling shardDisconnect: ${error.message}`);
    }
};
