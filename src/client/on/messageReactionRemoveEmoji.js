const colors = require('colors');
const output = require('../../console/output');

module.exports = (reaction, user) => {
    try {
        const emoji = reaction.emoji;
        const userName = user ? user.tag : 'Unknown User';

        output.delete(`${colors.cyan(userName)} removed reaction ${colors.blue(emoji.name)} from ${colors.white(reaction.message.content)}`);
    } catch (error) {
        output.error(`Error handling messageReactionRemove: ${error.message}`);
    }
};
