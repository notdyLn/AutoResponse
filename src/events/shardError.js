const { shardError } = require('../../utils/logging');

module.exports = {
    name: 'shardError',
    execute(event, id) {
        shardError(`Shard ${id} encountered an error`);
    }
};