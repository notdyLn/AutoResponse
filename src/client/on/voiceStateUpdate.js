const colors = require('colors');
const output = require('../../console/output');

module.exports = (oldMember, newMember) => {
    try {
        const member = newMember.member || oldMember.member;

        if (oldMember.channel !== newMember.channel) {
            if (oldMember.channel) {
                output.voice(`${colors.cyan(member.user.tag)} left ${colors.cyan(`${oldMember.channel.name}`)} in ${colors.cyan(oldMember.guild.name)}`);
            }

            if (newMember.channel) {
                output.voice(`${colors.cyan(member.user.tag)} joined ${colors.cyan(`${newMember.channel.name}`)} in ${colors.cyan(newMember.guild.name)}`);
            }
        }
    } catch (error) {
        output.error(`Error handling voiceStateUpdate: ${error}`);
    }
};
