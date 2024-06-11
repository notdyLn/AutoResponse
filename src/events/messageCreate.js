const { attachmentDownload, messageCreate, Error, Debug, Info } = require("../../utils/logging");
const fs = require("fs");
const path = require("path");
const getSettings = require("../../utils/getSettings");
const replyToUser = require("../../utils/reply");
const sqlite3 = require("sqlite3").verbose();

const dbDirPath = path.join(__dirname, "..", "..", "data");
const dbFilePath = path.join(dbDirPath, "optoutlist.db");

if (!fs.existsSync(dbDirPath)) {
    fs.mkdirSync(dbDirPath, { recursive: true });
}

const optOutDb = new sqlite3.Database(dbFilePath, (err) => {
    if (err) {
        Error(`Error connecting to SQLite database: ${err.message}`);
    } else {
        optOutDb.run(
            `CREATE TABLE IF NOT EXISTS OptOutList (userId TEXT PRIMARY KEY, userTag TEXT UNIQUE)`,
            (err) => {
                if (err) {
                    Error(`Error creating table: ${err.message}`);
                }
            }
        );
    }
});

function initializeDatabase(serverId) {
    const dbFilePath = path.join(
        __dirname,
        "..",
        "..",
        "data",
        `${serverId}.db`
    );
    const db = new sqlite3.Database(dbFilePath);
    return db;
}

function getOptOutList() {
    return new Promise((resolve, reject) => {
        optOutDb.all(`SELECT * FROM OptOutList`, [], (err, rows) => {
            if (err) {
                Error(`Error getting opt-out list: ${err.message}`);
                reject(err);
            } else {
                resolve(rows.map((row) => row.userTag));
            }
        });
    });
}

async function downloadAttachment(url, filename) {
    const fetch = await import('node-fetch').then(mod => mod.default);
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    fs.writeFileSync(filename, Buffer.from(arrayBuffer));
}

const replyCooldownsDbPath = path.join(__dirname, "..", "..", "data", "replyCooldowns.db");

const replyCooldownsDb = new sqlite3.Database(replyCooldownsDbPath, (err) => {
    if (err) {
        Error(`Error connecting to SQLite database: ${err.message}`);
    } else {
        replyCooldownsDb.run(
            `CREATE TABLE IF NOT EXISTS cooldowns (serverId TEXT, channelId TEXT, timeRemaining INTEGER, PRIMARY KEY (serverId, channelId))`,
            (err) => {
                if (err) {
                    Error(`Error creating ReplyCooldowns table: ${err.message}`);
                }
            }
        );
    }
});

async function getCooldownTimeRemaining(serverId, channelId) {
    return new Promise((resolve, reject) => {
        replyCooldownsDb.get(
            `SELECT timeRemaining FROM cooldowns WHERE serverId = ? AND channelId = ?`,
            [serverId, channelId],
            (err, row) => {
                if (err) {
                    Error(`Error fetching cooldown time: ${err.message}`);
                    return reject(err);
                }

                if (row) {
                    resolve(row.timeRemaining - Date.now());
                } else {
                    resolve(0);
                }
            }
        );
    });
}

module.exports = {
    name: "messageCreate",
    async execute(message) {
        const serverId = message.guild ? message.guild.id : "Direct Message";
        const serverName = message.guild ? message.guild.name : "Direct Message";

        const channelId = message.channel ? message.channel.id : "Direct Message";
        const channelName = message.channel && message.channel.name ? message.channel.name : "Direct Message";

        let authorFlags;
        if (message.author) {
            authorFlags = await message.author.fetchFlags();
        }

        const authorId = message.author ? message.author.id : 'Unknown user';
        const authorUsername = message.author ? message.author.username : 'Unknown user';

        let messageContent = message.content.replace(/[\r\n]+/g, " ");

        if (message.embeds.length > 0) {
            messageContent += ' EMBED '.bgYellow.black;
        }

        if (message.poll) {
            const pollQuestion = message.poll.question.text.replace(/[\r\n]+/g, " ");;
            const pollAnswers = message.poll.answers.map(answer => answer.text).join(', ');

            messageContent += ' POLL '.bgMagenta.black + ` ${pollQuestion.cyan} - ${pollAnswers.cyan} `;
        }

        if (!message.inGuild()) {
            return messageCreate( `${`DM`.magenta} - ${authorUsername.cyan} - ${messageContent.white}` );
        }

        if (message.author.system) {
            return messageCreate( `${` SYSTEM `.bgBlue.white} - ${serverName.cyan} - ${"#".cyan + channelName.cyan} - ${authorUsername.cyan} - ${messageContent.white}` );
        }

        if (authorFlags && authorFlags.has('VerifiedBot')) {
            return messageCreate( `${` ✓ APP `.bgBlue.white} - ${serverName.cyan} - ${"#".cyan + channelName.cyan} - ${authorUsername.cyan} - ${messageContent.white}` );
        }

        if (message.author.bot) {
            return messageCreate( `${` APP `.bgBlue.white} - ${serverName.cyan} - ${"#".cyan + channelName.cyan} - ${authorUsername.cyan} - ${messageContent.white}` );
        }

        const db = initializeDatabase(serverId);
        const settings = await getSettings(serverId);
        const replyChannels = settings.replyChannels || [];
        const replyChannel = replyChannels.find( (channel) => channel.id === message.channel.id );
        const optOutList = await getOptOutList();

        if (!replyChannel) {
            return messageCreate( `${`0%`.red} - ${serverName.cyan} - ${"#".cyan + channelName.cyan} - ${authorUsername.cyan} - ${messageContent.white}` );
        }

        if (optOutList.includes(authorUsername)) {
            return messageCreate( `${`OOL`.red} - ${serverName.cyan} - ${"#".cyan + channelName.cyan} - ${authorUsername.cyan} - ${messageContent.white}` );
        }

        const cooldownTimeRemaining = await getCooldownTimeRemaining(serverId, channelId);
        if (cooldownTimeRemaining > 0) {
            Info(`Replies are paused for another ${Math.ceil(cooldownTimeRemaining / 60000)} minutes.`);
            return messageCreate( `${`PAUSED`.red} - ${serverName.cyan} - ${"#".cyan + channelName.cyan} - ${authorUsername.cyan} - ${messageContent.white}` );
        }

        let chance = replyChannel.chance || 0;
        chance += 1;
        replyChannel.chance = chance;
        settings.replyChannels = replyChannels;

        const updateChannels = `UPDATE replyChannels SET chance = ? WHERE id = ?`;
        db.run(updateChannels, [chance, replyChannel.id], function (err) {
            if (err) {
                Error(`Error updating replyChannel chance for server ${serverId}: ${err.message}`);
            }
        });

        messageCreate(
            `${(chance + "%").green} - ${serverName.cyan} - ${
                "#".cyan + channelName.cyan
            } - ${authorUsername.cyan} - ${messageContent.white}`
        );

        if (message.attachments.size > 0) {
            const mediaDirPath = path.join(__dirname, "..", "..", "data", "media");
            if (!fs.existsSync(mediaDirPath)) {
                fs.mkdirSync(mediaDirPath, { recursive: true });
            }

            message.attachments.forEach(async (attachment) => {
                const fileExtension = path.extname(attachment.name);
                const fileName = `${authorUsername}-${new Date().toISOString().split('T')[0]}-${path.basename(attachment.name, fileExtension)}${fileExtension}`;
                const filePath = path.join(mediaDirPath, fileName);
                
                try {
                    await downloadAttachment(attachment.url, filePath);
                } catch (err) {
                    Error(`Error downloading attachment: ${err.message}`);
                } finally {
                    attachmentDownload(`Attachment Downloaded to ${filePath}`);
                }
            });
        }

        if (Math.random() * 100 < replyChannel.chance) {
            await replyToUser(message, authorUsername);

            replyChannel.chance = 6;
            settings.replyChannels = replyChannels;

            db.run(updateChannels, [6, replyChannel.id], function (err) {
                if (err) {
                    Error(
                        `Error resetting replyChannel chance for server ${serverId}: ${err.message}`
                    );
                }
            });
        }

        db.close();
    },
};
