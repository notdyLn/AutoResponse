const colors = require('colors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

function dbOutput(t, m) {
    const date = new Date();
    const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${date.getFullYear()}`;
    const time = date.toLocaleTimeString();
    const type = colors.stripColors(t);
    const content = colors.stripColors(m);

    const dataFolderPath = path.join(__dirname, '..', 'data');
    const dbPath = path.join(dataFolderPath, 'logs.db');

    require('fs').promises.mkdir(dataFolderPath, { recursive: true });

    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening SQLite database:', err);
            return;
        }

        db.serialize(() => {
            const tableName = formattedDate;
            db.run(`CREATE TABLE IF NOT EXISTS "${tableName}" (time TEXT, type TEXT, content TEXT)`);
            const stmt = db.prepare(`INSERT INTO "${tableName}" (time, type, content) VALUES (?,?,?)`);
            stmt.run(time, type, content);
            stmt.finalize();
        });

        db.close((err) => {
            if (err) {
                console.error('Error closing SQLite database:', err);
            }
        });
    });
}

module.exports.Feedback = function(a, m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${a.cyan} sent feedback: ${m.black.bgGreen}`);
    dbOutput('Feedback', a + ' - ' + m);
};

module.exports.attachmentDownload = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.green}`);
    dbOutput('Attachment Download', m);
};

module.exports.DiscordJS = function(m) {
    console.log(m.cyan);
};

module.exports.Info = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.grey}`);
    dbOutput('Info', m);
};

module.exports.Debug = function(m) {
    console.log(m);
};

module.exports.Valid = function(m) {
    console.log(m.green);
};

module.exports.Invalid = function(m) {
    console.log(m.red);
};

module.exports.Done = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.green}`);
};

module.exports.Error = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.red}\t${m.red}`);
    dbOutput('Error', m);
};

module.exports.Warn = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.yellow}\t${m.yellow}`);
    dbOutput('Warn', m);
};

module.exports.Presence = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.grey}`);
};

// Discord Events

module.exports.applicationCommandPermissionsUpdate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Application Command Permissions Updated', m);
};

module.exports.autoModerationActionExecution = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('AutoMod', m);
};

module.exports.autoModerationRuleCreate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('AutoMod Rule Created', m);
};

module.exports.autoModerationRuleDelete = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('AutoMod Rule Deleted', m);
};

module.exports.autoModerationRuleUpdate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('AutoMod Rule Updated', m);
};

module.exports.cacheSweep = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.green}`);
    dbOutput('Cache Sweep', m);
};

module.exports.channelCreate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Channel Created', m);
};

module.exports.channelDelete = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Channel Deleted', m);
};

module.exports.channelPinsUpdate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Channel Pins Updated', m);
};

module.exports.channelUpdate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Channel Updated', m);
};

module.exports.debug = function(m) {
    console.log(`${m.grey}`);
};

module.exports.emojiCreate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Emoji Created', m);
};

module.exports.emojiDelete = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Emoji Deleted', m);
};

module.exports.emojiUpdate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Emoji Updated', m);
};

module.exports.guildAuditLogEntryCreate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Audit Log', m);
};

module.exports.guildAvailable = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.green}`);
};

module.exports.guildBanAdd = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Guild Ban Added', m);
};

module.exports.guildBanRemove = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Guild Ban Removed', m);
};

module.exports.guildCreate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Guild Created', m);
};

module.exports.guildDelete = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Guild Deleted', m);
};

module.exports.guildIntegrationsUpdate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Guild Integrations Updated', m);
};

module.exports.guildMemberAdd = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.green}`);
    dbOutput('Member Joined', m);
};

module.exports.guildMemberAvailable = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.green}`);
    dbOutput('Member Available', m);
};

module.exports.guildMemberRemove = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.red}`);
    dbOutput('Member Removed', m);
};

module.exports.guildMembersChunk = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Member Chunk', m);
};

module.exports.guildMemberUpdate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Member Updated', m);
};

module.exports.guildScheduledEventCreate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Guild Event Created', m);
};

module.exports.guildScheduledEventDelete = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Guild Event Deleted', m);
};

module.exports.guildScheduledEventUpdate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Guild Event Updated', m);
};

module.exports.guildScheduledEventUserAdd = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Guild Event User Added', m);
};

module.exports.guildScheduledEventUserRemove = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Guild Event User Removed', m);
};

module.exports.guildUnavailable = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Guild Unavailable', m);
};

module.exports.guildUpdate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Guild Updated', m);
};

module.exports.interactionCreate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Interaction', m);
};

module.exports.invalidated = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Invalidated', m);
};

module.exports.inviteCreate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Guild Invite Created', m);
};

module.exports.inviteDelete = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Guild Invite Deleted', m);
};

module.exports.messageCreate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.blue}`);
    dbOutput('Message Created', m);
};

module.exports.messageDelete = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.red}`);
    dbOutput('Message Deleted', m);
};

module.exports.messageDeleteBulk = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.red}`);
    dbOutput('Multiple Messages Deleted', m);
};

module.exports.messagePollVoteAdd = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.green}`);
    dbOutput('Poll Vote Added', m);
};

module.exports.messagePollVoteRemove = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.red}`);
    dbOutput('Poll Vote Removed', m);
};

module.exports.messageReactionAdd = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.green}`);
    dbOutput('Reaction Added', m);
};

module.exports.messageReactionRemove = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.red}`);
    dbOutput('Reaction Removed', m);
};

module.exports.messageReactionRemoveAll = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.red}`);
    dbOutput('All Reactions Removed', m);
};

module.exports.messageReactionRemoveEmoji = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.red}`);
    dbOutput('Emoji Reaction Removed', m);
};

module.exports.messageUpdate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.yellow}`);
    dbOutput('Message Updated', m);
};

module.exports.presenceUpdate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.grey}`);
};

module.exports.ready = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.green}`);
    dbOutput('Ready', m);
};

module.exports.roleCreate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.green}`);
    dbOutput('Role Created', m);
};

module.exports.roleDelete = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.red}`);
    dbOutput('Role Deleted', m);
};

module.exports.roleUpdate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.yellow}`);
    dbOutput('Role Updated', m);
};

module.exports.shardDisconnect = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.red}`);
};

module.exports.shardError = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.red}`);
    dbOutput('Shard Error', m);
};

module.exports.shardReady = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.green}`);
};

module.exports.shardReconnecting = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.yellow}`);
};

module.exports.shardResume = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.green}`);
};

module.exports.stageInstanceCreate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Stage Instance Created', m);
};

module.exports.stageInstanceDelete = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Stage Instance Deleted', m);
};

module.exports.stageInstanceUpdate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Stage Instance Updated', m);
};

module.exports.stickerCreate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Sticker Created', m);
};

module.exports.stickerDelete = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Sticker Deleted', m);
};

module.exports.stickerUpdate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Sticker Updated', m);
};

module.exports.threadCreate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Thread Created', m);
};

module.exports.threadDelete = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Thread Deleted', m);
};

module.exports.threadListSync = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Thread List Synced', m);
};

module.exports.threadMembersUpdate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Thread Members Updated', m);
};

module.exports.threadMemberUpdate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Thread Member Updated', m);
};

module.exports.typingStart = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m.blue}`);
};

module.exports.userUpdate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('User Updated', m);
};

module.exports.voiceStateUpdate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Voice State Updated', m);
};

module.exports.threadUpdate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Thread Updated', m);
};

module.exports.webhooksUpdate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Webhooks Updated', m);
};

module.exports.webhookUpdate = function(m) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time.grey}\t${m}`);
    dbOutput('Webhook Updated', m);
};