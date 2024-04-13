const { emojiCreate } = require('../../utils/logging');

module.exports = {
    name: 'emojiCreate',
    execute(emoji) {
        emojiCreate(`Emoji created: ${emoji.name} (${emoji.id})`);
    }
};