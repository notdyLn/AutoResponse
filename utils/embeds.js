const { EmbedBuilder } = require('discord.js');
const { codeblock } = require('./markdown');
const { format } = require('./ansi');
const { COLORS, ICONS, TEXT } = require('./constants');

module.exports.DetailsEmbed = function(userTag, userId, guildName, highestRole, badges, createdTimestamp, joinedTimestamp, avatarURL, bannerURL) {
    const embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setDescription(
            `${ICONS.member} **@${userTag}**\n\` ${userId} \`\n`
        )
        .addFields(
            {
                name: `${ICONS.calendar} **Dates**`,
                value: `**Joined Discord**: ${createdTimestamp}\n` + `**Joined ${guildName}**: ${joinedTimestamp}\n`
            },
        )
        .addFields(
            {
                name: `${ICONS.members} **Highest Role**`,
                value: `\` ${highestRole} \``,
                inline: true
            },

            {
                name: `${ICONS.members} **Badges**`,
                value: badges,
                inline: true
            },
        )
        .setThumbnail(avatarURL)
        .setImage(bannerURL)
        .setFooter({
            iconURL: ICONS.brand_url,
            text: TEXT.footer
        })

    return embed;
};

module.exports.MediaEmbed = function(URL) {
    const embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setImage(URL)
        .setFooter({
            iconURL: ICONS.brand_url,
            text: TEXT.footer
        })

    return embed;
};

module.exports.PingEmbed = function(ws, rest, wscolor) {
    const embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setDescription(`${ICONS.globe} **Pong!**\n` + codeblock("ansi", [`rest\t\t${format(`${rest}ms`, "m")}`, `websocket   ${format(`${ws}ms`, wscolor)}`]))

    return embed;
};

module.exports.CoinflipEmbed = function(result) {
    let emoji;

    if (result === 'Heads') {
        emoji = ICONS.heads;
    } else if (result === 'Tails') {
        emoji = ICONS.tails;
    }

    const embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setDescription(`# ${emoji} ${result}`)

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

    return embed;
};

module.exports.StatsEmbed = function(serverCount, shardCount, uptime) {
    const embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setDescription(
            `${ICONS.home} **Server Count**: \` ${serverCount} \`\n` +
            `${ICONS.shard} **Shard Count**: \` ${shardCount} \`\n` +
            `${ICONS.clock} **Uptime**: \` ${uptime} \`\n` +
            `${ICONS.github} **Version**: \` 1cc1f05 \``
        )

    return embed;
};

module.exports.RestartEmbed = function(message) {
    const embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setDescription(`${ICONS.restart} **${message}**`)

    return embed;
};

module.exports.LoadingEmbed = function(title) {
    const embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setDescription(`${ICONS.loading} **${title}**`)

    return embed;
};

module.exports.SuccessEmbed = function(title, message) {
    const embed = new EmbedBuilder()
        .setColor(COLORS.done)
        .setDescription(`${ICONS.checkmark} **${title}**\n` + `${message}`)

    return embed;
};

module.exports.ErrorEmbed = function(title, message) {
    const embed = new EmbedBuilder()
        .setColor(COLORS.error)
        .setDescription(`${ICONS.xmark} **${title}**\n` + `${message}`)

    return embed;
};