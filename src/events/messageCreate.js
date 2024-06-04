const { attachmentDownload, messageCreate, Debug, Error, Done } = require("../../utils/logging");
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

module.exports = {
    name: "messageCreate",
    async execute(message) {
        const serverId = message.guild.id;
        const serverName = message.guild.name;
        const channelName = message.channel.name;
        const globalUsername = message.author.tag;
        const globalUserId = message.author.id;
        const messageContent = message.content.replace(/[\r\n]+/g, " ");
        const db = initializeDatabase(serverId);
        const settings = await getSettings(serverId);
        const replyChannels = settings.replyChannels || [];
        const replyChannel = replyChannels.find(
            (channel) => channel.id === message.channel.id
        );
        const optOutList = await getOptOutList();

        if (message.author.bot || message.webhookId) {
            messageCreate(
                `${`BOT`.white} - ${serverName.cyan} - ${
                    "#".cyan + channelName.cyan
                } - ${globalUsername.cyan} - ${messageContent.white}`
            );
            return;
        }

        if (!replyChannel) {
            messageCreate(
                `${`0%`.red} - ${serverName.cyan} - ${
                    "#".cyan + channelName.cyan
                } - ${globalUsername.cyan} - ${messageContent.white}`
            );
            return;
        }

        if (optOutList.includes(globalUsername)) {
            messageCreate(
                `${`OOL`.red} - ${serverName.cyan} - ${
                    "#".cyan + channelName.cyan
                } - ${globalUsername.cyan} - ${messageContent.white}`
            );
            return;
        }

        let chance = replyChannel.chance || 0;
        chance += 1;
        replyChannel.chance = chance;
        settings.replyChannels = replyChannels;

        const updateChannels = `UPDATE replyChannels SET chance = ? WHERE id = ?`;
        db.run(updateChannels, [chance, replyChannel.id], function (err) {
            if (err) {
                Error(
                    `Error updating replyChannel chance for server ${serverId}: ${err.message}`
                );
            }
        });

        messageCreate(
            `${(chance + "%").green} - ${serverName.cyan} - ${
                "#".cyan + channelName.cyan
            } - ${globalUsername.cyan} - ${messageContent.white}`
        );

        if (message.attachments.size > 0) {
            const mediaDirPath = path.join(__dirname, "..", "..", "data", "media");
            if (!fs.existsSync(mediaDirPath)) {
                fs.mkdirSync(mediaDirPath, { recursive: true });
            }

            message.attachments.forEach(async (attachment) => {
                const fileExtension = path.extname(attachment.name);
                const fileName = `${globalUsername}-${new Date().toISOString().split('T')[0]}-${path.basename(attachment.name, fileExtension)}${fileExtension}`;
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
            await replyToUser(message, globalUsername);

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
