const output = require('../../console/output');

module.exports = (error, shardId) => {
    try {
        output.error(`Shard ${shardId} encountered an error: ${error}`);
    } catch (error) {
        output.error(`Error handling shardError: ${error.message}`);
    }
};
