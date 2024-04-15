const colors = require('colors');
const fs = require('fs');
const path = require('path');

function fileOutput(m) {
    const d = new Date().toISOString().slice(0, 10);
    const t = new Date().toLocaleTimeString();
    const p = path.join(__dirname, '..', 'logs', `${d}.log`);
    const message = colors.stripColors(m);
    fs.appendFileSync(p, `${t}\t\t${message}\n`);
}

function info(m, c) {
    const t = new Date().toLocaleTimeString();
    console.log(`${t.grey}\t${c(m)}`);
}

function debug(m, c) {
    console.log(c(m));
}

// Basic Events

module.exports.Info = function(message) {
    info(message, colors.grey);
    fileOutput(message);
};

module.exports.Debug = function(message) {
    info(message, colors.grey);
};

module.exports.Error = function(message) {
    info(message, colors.red);
    fileOutput(message);
};

module.exports.Warn = function(message) {
    info(message, colors.yellow);
    fileOutput(message);
};

module.exports.Done = function(message) {
    info(message, colors.green);
    fileOutput(message);
};

module.exports.End = function(message) {
    info(message, colors.magenta);
};

module.exports.Valid = function(message) {
    debug(message, colors.green);
};

module.exports.Invalid = function(message) {
    debug(message, colors.red);
};

module.exports.DiscordJS = function(message) {
    debug(message, colors.cyan);
};

// Discord Events

module.exports.applicationCommandPermissionsUpdate = function(message) {
    info(message, colors.grey);
};

module.exports.autoModerationActionExecution = function(message) {
    info(message, colors.grey);
};

module.exports.autoModerationRuleCreate = function(message) {
    info(message, colors.grey);
};

module.exports.autoModerationRuleDelete = function(message) {
    info(message, colors.grey);
};

module.exports.autoModerationRuleUpdate = function(message) {
    info(message, colors.grey);
};

module.exports.cacheSweep = function(message) {
    info(message, colors.grey);
};

module.exports.channelCreate = function(message) {
    info(message, colors.grey);
};

module.exports.channelDelete = function(message) {
    info(message, colors.grey);
};

module.exports.channelPinsUpdate = function(message) {
    info(message, colors.grey);
};

module.exports.channelUpdate = function(message) {
    info(message, colors.grey);
};

module.exports.debug = function(message) {
    debug(message, colors.grey);
};

module.exports.emojiCreate = function(message) {
    info(message, colors.grey);
};

module.exports.emojiDelete = function(message) {
    info(message, colors.grey);
};

module.exports.emojiUpdate = function(message) {
    info(message, colors.grey);
};

module.exports.guildAuditLogEntryCreate = function(message) {
    info(message, colors.grey);
};

module.exports.guildAvailable = function(message) {
    info(message, colors.green);
};

module.exports.guildBanAdd = function(message) {
    info(message, colors.grey);
};

module.exports.guildBanRemove = function(message) {
    info(message, colors.grey);
};

module.exports.guildCreate = function(message) {
    info(message, colors.grey);
};

module.exports.guildDelete = function(message) {
    info(message, colors.grey);
};

module.exports.guildIntegrationsUpdate = function(message) {
    info(message, colors.grey);
};

module.exports.guildMemberAdd = function(message) {
    info(message, colors.grey);
};

module.exports.guildMemberAvailable = function(message) {
    info(message, colors.grey);
};

module.exports.guildMemberRemove = function(message) {
    info(message, colors.grey);
};

module.exports.guildMembersChunk = function(message) {
    info(message, colors.grey);
};

module.exports.guildMemberUpdate = function(message) {
    info(message, colors.grey);
};

module.exports.guildScheduledEventCreate = function(message) {
    info(message, colors.grey);
};

module.exports.guildScheduledEventDelete = function(message) {
    info(message, colors.grey);
};

module.exports.guildScheduledEventUpdate = function(message) {
    info(message, colors.grey);
};

module.exports.guildScheduledEventUserAdd = function(message) {
    info(message, colors.grey);
};

module.exports.guildScheduledEventUserRemove = function(message) {
    info(message, colors.grey);
};

module.exports.guildUnavailable = function(message) {
    info(message, colors.red);
};

module.exports.guildUpdate = function(message) {
    info(message, colors.grey);
};

module.exports.interactionCreate = function(message) {
    info(message, colors.magenta);
    fileOutput(message);
};

module.exports.invalidated = function(message) {
    info(message, colors.red);
};

module.exports.inviteCreate = function(message) {
    info(message, colors.grey);
};

module.exports.inviteDelete = function(message) {
    info(message, colors.grey);
};

module.exports.messageCreate = function(message) {
    info(message, colors.blue);
    fileOutput(message);
};

module.exports.messageDelete = function(message) {
    info(message, colors.red);
    fileOutput(message);
};

module.exports.messageDeleteBulk = function(message) {
    info(message, colors.grey);
};

module.exports.messageReactionAdd = function(message) {
    info(message, colors.grey);
};

module.exports.messageReactionRemove = function(message) {
    info(message, colors.grey);
};

module.exports.messageReactionRemoveAll = function(message) {
    info(message, colors.grey);
};

module.exports.messageReactionRemoveEmoji = function(message) {
    info(message, colors.grey);
};

module.exports.messageUpdate = function(message) {
    info(message, colors.grey);
    fileOutput(message);
};

module.exports.presenceUpdate = function(message) {
    info(message, colors.grey);
};

module.exports.ready = function(message) {
    debug(message, colors.green);
    fileOutput(message);
};

module.exports.roleCreate = function(message) {
    info(message, colors.grey);
};

module.exports.roleDelete = function(message) {
    info(message, colors.grey);
};

module.exports.roleUpdate = function(message) {
    info(message, colors.grey);
};

module.exports.shardDisconnect = function(message) {
    info(message, colors.red);
};

module.exports.shardError = function(message) {
    info(message, colors.red);
};

module.exports.shardReady = function(message) {
    info(message, colors.grey);
};

module.exports.shardReconnecting = function(message) {
    info(message, colors.yellow);
};

module.exports.shardResume = function(message) {
    info(message, colors.grey);
};

module.exports.stageInstanceCreate = function(message) {
    info(message, colors.grey);
};

module.exports.stageInstanceDelete = function(message) {
    info(message, colors.grey);
};

module.exports.stageInstanceUpdate = function(message) {
    info(message, colors.grey);
};

module.exports.stickerCreate = function(message) {
    info(message, colors.grey);
};

module.exports.stickerDelete = function(message) {
    info(message, colors.grey);
};

module.exports.stickerUpdate = function(message) {
    info(message, colors.grey);
};

module.exports.threadCreate = function(message) {
    info(message, colors.grey);
};

module.exports.threadDelete = function(message) {
    info(message, colors.grey);
};

module.exports.threadListSync = function(message) {
    info(message, colors.grey);
};

module.exports.threadMembersUpdate = function(message) {
    info(message, colors.grey);
};

module.exports.threadMemberUpdate = function(message) {
    info(message, colors.grey);
};

module.exports.typingStart = function(message) {
    info(message, colors.grey);
};

module.exports.userUpdate = function(message) {
    info(message, colors.green);
    fileOutput(message);
};

module.exports.voiceStateUpdate = function(message) {
    info(message, colors.blue);
    fileOutput(message);
};

module.exports.threadUpdate = function(message) {
    info(message, colors.grey);
};

module.exports.webhooksUpdate = function(message) {
    info(message, colors.grey);
};

module.exports.webhookUpdate = function(message) {
    info(message, colors.grey);
};