const { Valid } = require('../../utils/logging');

module.exports = {
    name: 'guildAvailable',
    execute(guild) {
        Valid(guild.name);
    }
};