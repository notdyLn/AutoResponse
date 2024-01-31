const colors = require('colors');
const output = require('../../console/output');

module.exports = (typing) => {
    try {
        output.typing(`${colors.cyan(typing.user.tag)} is typing in ${colors.cyan(`#${typing.channel.name}`)} - ${colors.cyan(`${typing.guild.name}`)}`);
    } catch (error) {
        output.error(`Error handling typingStart: ${error.message}`);
    }
};
