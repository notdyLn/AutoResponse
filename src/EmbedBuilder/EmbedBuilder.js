const { EmbedBuilder } = require('discord.js');

module.exports = {
    warn: (title, description) => {
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor('#FFFF00');

        return embed;
    },

    done: (title, description ) => {
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor('#00aa00');

        return embed;
    },

    error: (title, description ) => {
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor('#FF0000');

        return embed;
    },
};
