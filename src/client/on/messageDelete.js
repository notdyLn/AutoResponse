const colors = require('colors');
const output = require('../../console/output');

module.exports = (message) => {
    try {
        if (message.author.bot || message.webhookId) {
            return;
        }

        const userTag = message.author.tag;
        const cleanedContent = message.content.replace(/[\r\n]+/g, ' ');

        output.delete(`${colors.cyan(`${userTag}'s`)} message was deleted - ${colors.white(cleanedContent)}`);
    } catch (error) {
        output.error(`Error handling messageDelete: ${error.message}`);
    }
};
