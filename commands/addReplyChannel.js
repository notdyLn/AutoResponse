const { ChannelType, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { ErrorEmbed, SuccessEmbed } = require('../utils/embeds');
const { Error, Info } = require('../utils/logging');
const fs = require('fs');
const path = require('path');
const getSettings = require('../utils/getSettings');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addreplychannel')
        .setDescription('Add a reply channel')
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('The channel to add')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        try {            
            const serverSettings = getSettings(interaction.guild.name);
            const selectedChannel = interaction.options.getChannel('channel');

            const selectedChannelId = selectedChannel.id;

            serverSettings.replyChannels = serverSettings.replyChannels || [];
            if (!serverSettings.replyChannels.some(channel => channel.id === selectedChannelId)) {
                serverSettings.replyChannels.push({ id: selectedChannelId, chance: 6 });

                const settingsFilePath = path.join(__dirname, '..', 'data', interaction.guild.name, 'settings.json');
                fs.writeFileSync(settingsFilePath, JSON.stringify(serverSettings, null, 2));

                const successEmbed = SuccessEmbed('Done', `<#${selectedChannel.id}> has been added as a reply channel.`);
                await interaction.reply({ embeds: [successEmbed], ephemeral: true  });
            } else {
                const errorEmbed = ErrorEmbed('Error', `<#${selectedChannel.id}> is already a reply channel.`);
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true  });
            }

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
