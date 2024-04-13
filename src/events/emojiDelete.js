const { emojiDelete } = require('../../utils/logging');

module.exports = {
    name: 'emojiDelete',
    execute(emoji) {
        emojiDelete(`Emoji deleted: ${emoji.name} (${emoji.id})`);
    }
};