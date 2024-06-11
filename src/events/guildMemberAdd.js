const { guildMemberAdd } = require('../../utils/logging');

module.exports = {
    name: 'guildMemberAdd',
    execute(member) {
        const guildName = member.guild.name;
        const pending = member.pending ? '(Pending...)'.yellow : '(Approved)';

        guildMemberAdd(`${guildName.cyan} - ${member.user.tag.cyan} Joined ${pending}`);
    }
};