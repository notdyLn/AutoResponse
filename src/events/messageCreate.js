const { attachmentDownload, messageCreate, Error, interactionCreate, Debug } = require("../../utils/logging");
const { sendEmail } = require('../../utils/sendEmail');

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
    const dbFilePath = path.join(__dirname, "..", "..", "data", `${serverId}.db`);
    const db = new sqlite3.Database(dbFilePath);
    return db;
}

async function downloadAttachment(url, filename) {
    const fetch = await import('node-fetch').then(mod => mod.default);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
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

function loadCommands(dir) {
    const commands = new Map();
    const commandFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(path.join(dir, file));
        commands.set(command.name, command);
    }

    return commands;
}

const messageCommands = loadCommands(path.join(__dirname, '..', '..', 'commands', 'message'));

module.exports = {
    name: "messageCreate",
    async execute(message) {
        try {
            const serverId = message.guild ? message.guild.id : null;
            const serverName = message.guild ? message.guild.name : "Direct Message";

            const channelId = message.channel ? message.channel.id : null;
            const channelName = message.channel && message.channel.name ? message.channel.name : "Direct Message";
            
            const allowedUserId = process.env.OWNERID;
            const commandPrefix = process.env.PREFIX;

            let authorFlags = message.author?.flags;
            let authorUsername = message.author ? message.author.username : "Unknown User";

            let messageContent = message.content.replace(/[\r\n]+/g, " ");

            try {
                if (message.author.id === allowedUserId) {
                    if (messageContent.startsWith(commandPrefix)) {
                        const commandName = messageContent.slice(commandPrefix.length).split(' ')[0];
                        const command = messageCommands.get(commandName);

                        if (command) {
                            interactionCreate(`${serverName.cyan} - ${('#' + channelName).cyan} - ${authorUsername.cyan} - ${messageContent.magenta}`);
                            return await command.execute(message);
                        } else {
                            return message.react('❔');
                        }
                    }
                }
            } catch (error) {
                Error(`Error processing owner commands:\n${error.stack}`);
            }

            const db = initializeDatabase(serverId);
            const settings = await getSettings(serverId, message.client);
            const replyChannels = settings.replyChannels || [];
            const replyChannel = replyChannels.find(channel => channel.id === message.channel.id);
            const optOutList = await getOptOutList();

            if (optOutList.includes(authorUsername)) {
                return messageCreate(`${'OptOut'.red} - ${serverName.cyan} - ${"#".cyan + channelName.cyan} - ${authorUsername.cyan} - ${messageContent.white}`);
            }

            const cooldownTimeRemaining = await getCooldownTimeRemaining(serverId, channelId);
            if (cooldownTimeRemaining > 0) {
                return messageCreate(`${'Cooldown'.red} - ${serverName.cyan} - ${"#".cyan + channelName.cyan} - ${authorUsername.cyan} - ${messageContent.white}`);
            }

            let chance = replyChannel ? replyChannel.chance : 0;
            if (replyChannel) replyChannel.chance = chance;

            if (message.embeds.length > 0) {
                messageContent += ' EMBED '.bgYellow.black;
            }

            if (message.poll) {
                const pollQuestion = message.poll.question.text.replace(/[\r\n]+/g, " ");
                const pollAnswers = message.poll.answers.map(answer => answer.text).join(', ');

                messageContent += ' POLL '.bgMagenta.black + ` ${pollQuestion.cyan} - ${pollAnswers.cyan} `;
            }

            if (!message.inGuild()) {
                return messageCreate(`${`DM`.magenta} - ${authorUsername.cyan} - ${messageContent.white}`);
            }

            if (message.author.system) {
                return messageCreate(`${` SYSTEM `.bgBlue.white} - ${serverName.cyan} - ${"#".cyan + channelName.cyan} - ${authorUsername.cyan} - ${messageContent.white}`);
            }

            if (message.author.bot && authorFlags.has('VerifiedBot')) {
                return messageCreate(`${` ✓ APP `.bgBlue.white} - ${serverName.cyan} - ${"#".cyan + channelName.cyan} - ${authorUsername.cyan} - ${messageContent.white}`);
            }

            if (message.author.bot && !authorFlags.has('VerifiedBot')) {
                return messageCreate(`${` APP `.bgBlue.white} - ${serverName.cyan} - ${"#".cyan + channelName.cyan} - ${authorUsername.cyan} - ${messageContent.white}`);
            }

            if (message.webhookId > 0) {
                return messageCreate(`${` WEBHOOK `.bgBlue.white} - ${serverName.cyan} - ${"#".cyan + channelName.cyan} - ${authorUsername.cyan} - ${messageContent.white}`);
            }

            try {
                if (message.attachments.size > 0) {
                    const mediaDirPath = path.join(__dirname, "..", "..", "data", "media");
                    if (!fs.existsSync(mediaDirPath)) {
                        fs.mkdirSync(mediaDirPath, { recursive: true });
                    }

                    for (const attachment of message.attachments.values()) {
                        const fileExtension = path.extname(attachment.name);
                        const sanitizedFilename = attachment.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
                        const fileName = `${authorUsername}-${new Date().toISOString().split('T')[0]}-${path.basename(sanitizedFilename, fileExtension)}${fileExtension}`;
                        const filePath = path.join(mediaDirPath, fileName);

                        try {
                            attachmentDownload(`Downloaded attachment to ${filePath}`);
                            await downloadAttachment(attachment.url, filePath);
                        } catch (err) {
                            Error(`Error downloading attachment ${attachment.name}: ${err.message}`);
                        }
                    }
                }
            } catch (err) {
                Error(`Error downloading attachments: ${err.message}`);
            }

            if (!message.author.bot || !message.webhookId && replyChannel) {
                if (replyChannel) {
                    const randomChance = Math.random() * 100;
            
                    if (randomChance <= chance) {
                        replyToUser(message);
            
                        replyChannel.chance = 6;
            
                        const updateChannels = `UPDATE replyChannels SET chance = ? WHERE id = ?`;
                        db.run(updateChannels, [replyChannel.chance, replyChannel.id], function (err) {
                            if (err) {
                                Error(`Error updating replyChannel chance for server ${serverId}: ${err.message}`);
                            }
                        });
                    } else {
                        chance = Math.min(chance + 1, 100);
            
                        const updateChannels = `UPDATE replyChannels SET chance = ? WHERE id = ?`;
                        db.run(updateChannels, [chance, replyChannel.id], function (err) {
                            if (err) {
                                Error(`Error updating replyChannel chance for server ${serverId}: ${err.message}`);
                            }
                        });
            
                        messageCreate(`${(chance + '%').green} - ${serverName.cyan} - ${"#".cyan + channelName.cyan} - ${authorUsername.cyan} - ${messageContent.white}`);
                    }
                } else {
                    return messageCreate(`${'0%'.red} - ${serverName.cyan} - ${"#".cyan + channelName.cyan} - ${authorUsername.cyan} - ${messageContent.white}`);
                }
            }            
        } catch (error) {
            Error(`Error executing ${module.exports.name}:\n${error.stack}`);
            sendEmail(module.exports.name, error.stack);
        }
    },
};