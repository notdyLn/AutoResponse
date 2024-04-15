const { guildAvailable } = require('../../utils/logging');

module.exports = {
    name: 'guildAvailable',
    execute(guild) {
        guildAvailable(`Available\t${guild.name}`);
    }
};