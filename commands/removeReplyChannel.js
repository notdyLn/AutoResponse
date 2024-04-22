const { ChannelType, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { ErrorEmbed, SuccessEmbed } = require('../utils/embeds');
const { Error, Info } = require('../utils/logging');
const fs = require('fs');
const path = require('path');
const getSettings = require('../utils/getSettings');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removereplychannel')
        .setDescription('Remove a reply channel')
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('The channel to remove')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        try {
            const settings = getSettings(interaction.guild.name);
            const channelToRemove = interaction.options.getChannel('channel');

            settings.replyChannels = settings.replyChannels || [];

            const indexToRemove = settings.replyChannels.findIndex(channel => channel.id === channelToRemove.id);
            if (indexToRemove === -1) {
                const notFoundEmbed = ErrorEmbed('Error', `<#${channelToRemove.id}> is not a reply channel.`);
                return await interaction.reply({ embeds: [notFoundEmbed], ephemeral: true });
            }

            settings.replyChannels.splice(indexToRemove, 1);

            const settingsFilePath = path.join(__dirname, '..', 'data', serverName, 'settings.json');
            fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));

            const successEmbed = SuccessEmbed(`${channelToRemove.name} has been removed as a reply channel.`);
            await interaction.reply({ embeds: [successEmbed], ephemeral: true });

        } catch (error) {
            const errorEmbed = ErrorEmbed('Error executing /addReplyChannel: ', error.message);
            Error(`Error executing /addReplyChannel: ${error.message}`);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },
};
