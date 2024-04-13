const { guildMemberAdd } = require('../../utils/logging');

module.exports = {
    name: 'guildMemberAdd',
    execute(member) {
        guildMemberAdd(`New member joined: ${member.user.username} (${member.id})`);
    }
};