const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { Info, Error } = require('../../utils/logging');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setlogschannel')
        .setDescription('Set a channel to log client events')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('The channel to send logs to')
            .setRequired(true)
        ),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const channelId = interaction.options.getChannel('channel').id;
        const dbPath = path.resolve(__dirname, `../../data/${guildId}.db`);

        // Open the database connection
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
            if (err) {
                Error(`Could not connect to database: ${err.message}`);
                return interaction.reply({ content: 'There was an error setting the logs channel. Please try again later.', ephemeral: true });
            }
        });

        // Create the logsChannel table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS logsChannel (id TEXT PRIMARY KEY)`, (err) => {
            if (err) {
                Error(`Could not create logsChannel table: ${err.message}`);
                db.close();
                return interaction.reply({ content: 'There was an error setting the logs channel. Please try again later.', ephemeral: true });
            }
        });

        // Insert or replace the channelId
        db.run(`INSERT OR REPLACE INTO logsChannel (id) VALUES (?)`, [channelId], (err) => {
            if (err) {
                Error(`Could not insert channelId into logsChannel table: ${err.message}`);
                db.close();
                return interaction.reply({ content: 'There was an error setting the logs channel. Please try again later.', ephemeral: true });
            }

            Info(`Logs channel set to ${channelId} for guild ${guildId}`);
            interaction.reply({ content: `Logs channel has been set to <#${channelId}>.`, ephemeral: true });
            db.close();
        });
    }
};
