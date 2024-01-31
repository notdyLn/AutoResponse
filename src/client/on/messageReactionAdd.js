const colors = require('colors');
const output = require('../../console/output');

module.exports = (reaction, user) => {
    try {
        const emoji = reaction.emoji.name;
        output.react(`${colors.cyan(user.tag)} reacted with "${colors.yellow(emoji)}" to ${colors.cyan(`${reaction.message.author.tag}'s`)} message`);
    } catch (error) {
        output.error(`Error handling messageReactionAdd: ${error.message}`);
    }
};