const { guildUnavailable } = require('../../utils/logging');

module.exports = {
    name: 'guildUnavailable',
    execute(guild) {
        guildUnavailable(`Unavailable\t${guild.name}`);
    }
};