const { EmbedBuilder } = require('discord.js');
const { codeblock } = require('./markdown');
const { format } = require('./ansi');
const { COINS, COLORS, LINKS, TEXT, EMOJIS } = require('./constants');

module.exports.OCR = function(ocr, image) {
    const embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setDescription(`\`\`\`\n${ocr}\n\`\`\` `)
        .setThumbnail(image)
        .setFooter({
            iconURL: LINKS.google,
            text: `${TEXT.brand} • Google Cloud Vision`
        })
        .setTimestamp();

    return embed;
};

module.exports.messageDelete = function(message) {
    return embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setTitle(`Message Deleted in <#${message.channel.id}>`)
        .setDescription(`**\` ${message.author ? message.author.tag : 'Unknown'} \` - \` ${message.content ? message.content : 'Unknown'} \`**`)
        .setFooter({
            iconURL: LINKS.brand,
            text: TEXT.brand
        })
        .setTimestamp()
};

module.exports.messageUpdate = function(oldMessage, newMessage) {
    return embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setTitle(`Message Updated in <#${newMessage.channel.id}>`)
        .setDescription(
            `### Old Message:\n` +
            `**\` ${oldMessage.author ? oldMessage.author.tag : 'Unknown'} \` - \` ${oldMessage.content ? oldMessage.content : 'Unknown'} \`**\n` +
            `### New Message:\n` +
            `**\` ${newMessage.author ? newMessage.author.tag : 'Unknown'} \` - \` ${newMessage.content ? newMessage.content : 'Unknown'} \`**\n\n` +
            `-# [\` Go to message \`](${newMessage.url})`
        )
        .setFooter({
            iconURL: LINKS.brand,
            text: TEXT.brand
        })
        .setTimestamp()
};

module.exports.guildMemberUpdateMedia = function(change, member, URL) {
    return embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setTitle(`${member.username} changed their ${change}`)
        .setImage(URL)
        .setFooter({
            iconURL: LINKS.brand,
            text: TEXT.brand
        })
        .setTimestamp()
};

module.exports.guildMemberUpdateName = function(change, username, oldMemberName, newMemberName) {
    return embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setTitle(`${username} changed their ${change}`)
        .setDescription(`**\` ${oldMemberName} \` → \` ${newMemberName} \`**`)
        .setFooter({
            iconURL: LINKS.brand,
            text: TEXT.brand
        })
        .setTimestamp()
};

module.exports.Reminder = function(message) {
    return embed = new EmbedBuilder()
        .setColor(COLORS.done)
        .setDescription(`${EMOJIS.ico_checkmark} **${message}**`)
};

module.exports.StarboardMessage = function(messageAuthor, authorAvatar, messageContent, reactionCount, messageLink) {
    return embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setAuthor({
            name: messageAuthor,
            iconURL: authorAvatar
        })
        .setDescription(
            `${messageContent}\n\n` +
            `⭐ ${reactionCount}\n\n` +
            `-# [Go to message](${messageLink})`
        )
};

module.exports.DoneEmbed = function(message) {
    return embed = new EmbedBuilder()
        .setColor(COLORS.done)
        .setDescription(`${EMOJIS.ico_checkmark} **${message}**`)
}

module.exports.EmbedTest = function(URL) {
    return embed = new EmbedBuilder()
        .setColor(COLORS.test)
        .setTitle(`This is a title`)
        .setDescription(`This is a description\n` + `With multiple lines`)
        .addFields(
            {
                name: 'Inline',
                value: 'Value',
                inline: true
            },

            {
                name: 'Inline',
                value: null,
                inline: true
            }
        )
        .addFields(
            {
                name: 'This is a regular field',
                value: 'With a value',
                inline: false
            },

            {
                name: 'This is another regular field',
                value: 'With a value',
                inline: false
            }
        )
        .setImage(URL)
        .setFooter({
            iconURL: LINKS.brand,
            text: `This is a footer, with an iconURL`
        })
}

module.exports.OutageEmbed = function(authorAvatar, timestamp, description) {
    return embed = new EmbedBuilder()
        .setColor(COLORS.outage)
        .setAuthor({
            name: `dyLn`,
            iconURL: authorAvatar
        })
        .setTitle(`Outage Report - <t:${timestamp}:F>`)
        .setDescription(description)
        .setFooter({
            iconURL: LINKS.brand,
            text: TEXT.brand
        })
}

module.exports.UpdateEmbed = function(authorAvatar, timestamp, description) {
    return embed = new EmbedBuilder()
        .setColor(COLORS.blurple)
        .setAuthor({
            name: `dyLn`,
            iconURL: authorAvatar
        })
        .setTitle(`Update Report - <t:${timestamp}:F>`)
        .setDescription(description)
        .setFooter({
            iconURL: LINKS.brand,
            text: TEXT.brand
        })
}

module.exports.JSONEmbed = function(fields) {
    return embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setDescription(`\`\`\`json\n${fields}\n\`\`\``)
        .setFooter({
            iconURL: LINKS.brand,
            text: TEXT.brand
        })
};

module.exports.DetailedHelpEmbed = function(title, description, message) {
    return embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setDescription(`${title}\n\n` + `${description}\n` + `${message}`)
        .setFooter({
            iconURL: LINKS.brand,
            text: TEXT.brand
        })
};

module.exports.HelpEmbed = function(title, description, message) {
    return embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setDescription(`${title}\n\n` + `${description}\n\n` + `${message}`)
        .setFooter({
            iconURL: LINKS.brand,
            text: TEXT.brand
        })
};

module.exports.FileEmbed = function(fileSize, timeTook) {
    return embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setDescription(`Size: ${fileSize}MB • Took ${timeTook}s`)
};

module.exports.CodeEmbed = function(output) {
    return embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setDescription(`\`\`\`\n${output}\n\`\`\``)
        .setFooter({
            iconURL: LINKS.brand,
            text: TEXT.brand + ' • CodeX'
        });
};

module.exports.InspireEmbed = function(URL) {
    return embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setImage(URL)
        .setFooter({
            iconURL: LINKS.brand,
            text: TEXT.brand + ' • InspiroBot'
        })
};

module.exports.LiveEmbed = function(streamInfo) {
    return new EmbedBuilder()
        .setColor(COLORS.twitch)
        .setAuthor({
            name: `${streamInfo.username} is live!`
        })
        .setThumbnail(streamInfo.avatarURL)
        .setTitle(streamInfo.title)
        .setURL(`https://twitch.tv/${streamInfo.username}`)
        .addFields(
            { name: 'Game', value: streamInfo.category, inline: true },
            { name: 'Viewers', value: streamInfo.viewers.toString(), inline: true },
        )
        .setImage(streamInfo.thumbnailURL)
        .setFooter({
            iconURL: LINKS.brand,
            text: TEXT.brand + ' • Twitch'
        })
};

module.exports.UserEmbed = function(userTag, userId, highestRole, highestRolePermissions, badges, createdTimestamp, joinedTimestamp, avatarURL, bannerURL) {
    try {
        return embed = new EmbedBuilder()
            .setColor(COLORS.default)
            .setDescription(
                `${EMOJIS.ico_user} **@${userTag}**\n\` ${userId} \`\n`
            )
            .addFields({
                name: `${EMOJIS.ico_calendar} **Dates**`,
                value: `**Joined Discord**: ${createdTimestamp}\n` + `**Joined server**: ${joinedTimestamp}\n`
            })
            .addFields(
                {
                    name: `${EMOJIS.ico_users} **Highest Role**`,
                    value: `\` ${highestRole} \``,
                    inline: true
                },
                {
                    name: `${EMOJIS.ico_users} **Badges**`,
                    value: badges,
                    inline: true
                },
            )
            .addFields({
                name: `${EMOJIS.ico_user} **Role Permissions**`,
                value: highestRolePermissions,
                inline: false
            })
            .setThumbnail(avatarURL)
            .setImage(bannerURL)
            .setFooter({
                iconURL: LINKS.brand,
                text: TEXT.brand
            })
    } catch (error) {
        return console.log(error.stack);
    }
};

module.exports.ServerEmbed = function(guildName, guildId, roles, userCount, emojiCount, stickerCount, guildDescription, guildIcon, guildBanner, guildOwner, formattedGuildCreatedAt, features, channels) {
    return embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setDescription(
            `${EMOJIS.ico_home} **${guildName}** \` ${guildId} \`\n` +
            `${EMOJIS.ico_users} \` ${userCount} \` ${EMOJIS.ico_user} \` ${roles} \`\n` +
            `${EMOJIS.ico_emoji} \` ${emojiCount} \` ${EMOJIS.ico_sticker} \` ${stickerCount} \`\n` +
            `${EMOJIS.ico_crown} ${guildOwner}\n` +
            `${guildDescription}\n`
        )
        .addFields(
            {
                name: ' ',
                value: `${EMOJIS.ico_calendar} **Server Created**: ${formattedGuildCreatedAt}\n`
            },
        )
        .addFields(
            {
                name: `${EMOJIS.ico_hashtag} **Channels**`,
                value: channels
            },
        )
        .addFields(
            {
                name: `${EMOJIS.ico_home} **Features**`,
                value: features
            },
        )
        .setThumbnail(guildIcon)
        .setImage(guildBanner)
        .setFooter({
            iconURL: LINKS.brand,
            text: TEXT.brand
        })
};

module.exports.MediaEmbed = function(URL) {
    return embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setImage(URL)
        .setFooter({
            iconURL: LINKS.brand,
            text: TEXT.brand
        })
};

module.exports.PingEmbed = function(ws, rest, wscolor) {
    return embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setDescription(`
            ${EMOJIS.ico_globe} **Pong!**\n` + 
            codeblock("ansi",
                [
                    `REST\t\t${format(`${rest}ms`, "m")}`,
                    `WebSocket   ${format(`${ws}ms`, wscolor)}`
                ]
            )
        )
        .setFooter({
            iconURL: LINKS.brand,
            text: TEXT.brand
        })
};

module.exports.PolicyEmbed = function() {
    return embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setDescription(`-# For more information about the privacy policy, please refer to the [Privacy Policy](https://dylandover.dev/privacypolicy).`)
};

module.exports.LoadingPingEmbed = function() {
    return embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setDescription(`
            ${EMOJIS.globe} **Pong!**\n` +
            `\`\`\`ansi\n` +
            `REST API\tLoading...\n` +
            `WebSocket   Loading...\n` +
            `\`\`\``
        )
        .setFooter({
            iconURL: LINKS.brand,
            text: TEXT.brand
        })
};

module.exports.CoinflipEmbed = function(result) {
    let emoji;

    if (result === 'Heads') {
        emoji = COINS.heads;
    } else if (result === 'Tails') {
        emoji = COINS.tails;
    }

    return embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setDescription(`# ${emoji} ${result}`)
};

module.exports.BallEmbed = function(author, question, result) {
    const embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setDescription(`# 🎱 ${result}`);
    
    if (question) {
        embed.setAuthor({
            name: `${author.tag}: ${question}`,
            iconURL: author.displayAvatarURL()
        });
    }

    return embed;
};

module.exports.Leaderboard = function(title, description, fields) {
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    
    const formattedTitle = title
        .split(' ')
        .map(word => capitalize(word))
        .join(' ');

    return embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setTitle(`${EMOJIS.ico_information} ${formattedTitle}`)
        .setDescription(description)
        .addFields(fields)
};

module.exports.StatsEmbed = function(serverCount, installCount, shardCount, uptime, memoryUsage, slashCommandsCount, cpuUsage, totalSessions, remainingSessions) {
    return embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setDescription(
            `${EMOJIS.ico_shard}` +          ` \` Shard Count        \` \` ${shardCount} \`\n` +
            `${EMOJIS.ico_home}` +           ` \` Server Count       \` \` ${serverCount} \`\n` +
            `${EMOJIS.ico_user}` +           ` \` Installation Count \` \` ${installCount} \`\n` +
            `${EMOJIS.ico_wrench}` +         ` \` Session Limit Info \` \` ${remainingSessions} / ${totalSessions} \`\n` +
            `${EMOJIS.ico_SlashCommand}` +   ` \` Slash Commands     \` \` ${slashCommandsCount} \`\n` +
            `${EMOJIS.ico_clock}` +          ` \` Uptime             \` \` ${uptime} \`\n\n` +

            `${EMOJIS.ico_cpu}` +            ` \` CPU Usage          \` \` ${cpuUsage}% \`\n` +
            `${EMOJIS.ico_ram}` +            ` \` Memory Usage       \` \` ${memoryUsage} MB \`\n\n`
        )
        .setFooter({
            iconURL: LINKS.brand,
            text: TEXT.brand
        })
        .setTimestamp()
};

module.exports.RestartEmbed = function(message) {
    return embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setDescription(`${EMOJIS.ico_restart} **${message}**`)
};

module.exports.LoadingEmbed = function(title, message) {
    return embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setDescription(`${EMOJIS.ico_loading} **${title}**\n` + message)
};

module.exports.SuccessEmbed = function(title, message) {
    return embed = new EmbedBuilder()
        .setColor(COLORS.done)
        .setDescription(`${EMOJIS.ico_checkmark} **${title}**\n` + `${message}`)
};

module.exports.InfoEmbed = function(info) {
    return embed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setDescription(info)
        .setFooter({
            iconURL: LINKS.brand,
            text: TEXT.brand
        })
};

module.exports.ErrorEmbed = function(message) {
    return embed = new EmbedBuilder()
        .setColor(COLORS.error)
        .setDescription(`${EMOJIS.ico_x} ${message}`)
};