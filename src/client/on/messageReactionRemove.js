const colors = require('colors');
const output = require('../../console/output');

module.exports = (reaction, user) => {
    try {
        const emoji = reaction.emoji.name;
        output.delete(`${colors.cyan(user.tag)} removed their reaction "${colors.yellow(emoji)}" from ${colors.cyan(`${reaction.message.author.tag}'s`)} message`);
    } catch (error) {
        output.error(`Error handling messageReactionRemove: ${error.message}`);
    }
};
