const { guildUnavailable } = require('../../utils/logging');

module.exports = {
    name: 'guildUnavailable',
    execute(guild) {
        guildUnavailable(`✕\t${guild.name}`);
    }
};