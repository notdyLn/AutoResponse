const { ChannelType, SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, ApplicationIntegrationType } = require("discord.js");
const { ErrorEmbed, SuccessEmbed } = require("../../utils/embeds");
const { Error, Info } = require("../../utils/logging");

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const replyCooldownsDbPath = path.join(__dirname, "..", "..", "data", "replyCooldowns.db");

const replyCooldownsDb = new sqlite3.Database(replyCooldownsDbPath, (err) => {
    if (err) {
        Error(`Error connecting to SQLite database: ${err.message}`);
    } else {
        replyCooldownsDb.run(
            `CREATE TABLE IF NOT EXISTS cooldowns (serverId TEXT, channelId TEXT, timeRemaining INTEGER, PRIMARY KEY (serverId, channelId))`,
            (err) => {
                if (err) {
                    Error(`Error creating cooldowns table: ${err.message}`);
                }
            }
        );
    }
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pausereplies")
        .setDescription("Add a cooldown to pause replies")
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("The channel")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
        .addIntegerOption(option => option
            .setName("minutes")
            .setDescription("The length of the cooldown in minutes")
            .setRequired(true)
        )
        .setContexts(InteractionContextType.Guild, InteractionContextType.PrivateChannel)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        try {
            if (!interaction.guild) return;

            const serverId = interaction.guild.id;
            const channel = interaction.options.getChannel("channel");
            const minutes = interaction.options.getInteger("minutes");

            if (isNaN(minutes) || minutes <= 0) {
                const errorEmbed = ErrorEmbed('Please provide a valid number of minutes.');
                if (interaction.deferred || interaction.replied) {
                    await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
                } else {
                    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                }
            }

            const timeRemaining = Date.now() + minutes * 60 * 1000;
            replyCooldownsDb.run(
                `INSERT OR REPLACE INTO cooldowns (serverId, channelId, timeRemaining) VALUES (?, ?, ?)`,
                [serverId, channel.id, timeRemaining],
                (error) => {
                    if (error) {
                        const errorEmbed = ErrorEmbed(`Error setting cooldown for server ${serverId}:\n${error.message}`);
                        Error(`Error setting cooldown for server ${serverId}: ${error.stack}`);

                        if (interaction.deferred || interaction.replied) {
                            interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
                        } else {
                            interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                        }
                    }

                    const successEmbed = SuccessEmbed('Cooldown Added', `Replies in ${channel.name} have been paused for ${minutes} minutes.`);
                    interaction.reply({ embeds: [successEmbed] });
                }
            );
        } catch (error) {
            Error(`Error executing ${interaction.commandName}: ${error.stack}`);

            const errorEmbed = ErrorEmbed(`Error executing ${interaction.commandName}:\n${error.message}`);
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
};
