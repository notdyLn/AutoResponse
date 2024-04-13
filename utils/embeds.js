const { EmbedBuilder } = require('discord.js');
const { BLOCK, COLORS, ICONS } = require('./constants');

const botName = 'AutoResponse';

module.exports.PingEmbed = function(message, color) {
    const embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setTitle(`${ICONS.ping} Pong!`)
        .setDescription(`\`\`\`ansi\n${color}${message} ${BLOCK.reset}Latency\`\`\``)
        .setFooter({
            text: botName,
            iconURL: ICONS.avatarURL
        })

    return embed;
};

module.exports.Leaderboard = function(title, description, fields) {
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    
    const formattedTitle = title
        .split(' ')
        .map(word => capitalize(word))
        .join(' ');

    const embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setTitle(`${ICONS.trophy} ${formattedTitle}`)
        .setDescription(description)
        .addFields(fields)
        .setFooter({
            text: botName,
            iconURL: ICONS.avatarURL
        })

    return embed;
};

module.exports.StatsEmbed = function(serverCount, shardCount, uptime) {
    const embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setDescription(`${ICONS.server} **Server Count:** ${serverCount}\n${ICONS.shard} **Shard Count:** ${shardCount}\n${ICONS.createdAt} **Uptime:** ${uptime}`)
        .setFooter({
            text: botName,
            iconURL: ICONS.avatarURL
        })

    return embed;
};

module.exports.RestartEmbed = function(message) {
    const embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setTitle(`${ICONS.restarting} ${message}`)

    return embed;
};

module.exports.LoadingEmbed = function(title) {
    const embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setTitle(`${ICONS.loading} ${title}`)
        .setFooter({
            text: botName,
            iconURL: ICONS.avatarURL
        })

    return embed;
};

module.exports.SuccessEmbed = function(title, message) {
    const embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setTitle(`${ICONS.check} ${title}`)
        .setDescription(message)
        .setFooter({
            text: botName,
            iconURL: ICONS.avatarURL
        })

    return embed;
};

module.exports.ErrorEmbed = function(title, message) {
    const embed = new EmbedBuilder()
        .setColor(COLORS.error)
        .setTitle(`${ICONS.error} ${title}`)
        .setDescription(`${message}`)
        .setFooter({
            text: botName,
            iconURL: ICONS.avatarURL
        })

    return embed;
};