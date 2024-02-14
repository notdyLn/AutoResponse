const { EmbedBuilder } = require('discord.js');
const avatarURL = 'https://cdn.discordapp.com/avatars/1141116585742966794/533dd2f3d456954259d6f9f99c5c8eae.webp?size=lossless';

module.exports = {
    warn: (title, description) => {
        const embed = new EmbedBuilder()
            .setColor('#FFFF00')
            .setAuthor({ name: title, iconURL: avatarURL })
            .setTitle(description)
            .setTimestamp();

        return embed;
    },

    done: (title, description) => {
        const embed = new EmbedBuilder()
            .setColor('#00AA00')
            .setAuthor({ name: title, iconURL: avatarURL })
            .setTitle(description)
            .setTimestamp();
            
        return embed;
    },

    error: (title, description) => {
        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setAuthor({ name: title, iconURL: avatarURL })
            .setTitle(description)
            .setTimestamp();

        return embed;
    },

    info: (title, description) => {
        const embed = new EmbedBuilder()
            .setColor('#999999')
            .setAuthor({ name: title, iconURL: avatarURL })
            .setDescription(description)
            .setTimestamp();
            
        return embed;
    },

    leaderboard: (title, fields) => {
        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    
        const formattedTitle = title
            .split(' ')
            .map(word => capitalize(word))
            .join(' ');

        const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setAuthor({ name: formattedTitle, iconURL: avatarURL })
            .addFields(fields)
            .setTimestamp();

        return embed;
    },
};
