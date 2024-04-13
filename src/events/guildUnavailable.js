const { guildUnavailable } = require('../../utils/logging');

module.exports = {
    name: 'guildUnavailable',
    execute(guild) {
        guildUnavailable(guild.name);
    }
};