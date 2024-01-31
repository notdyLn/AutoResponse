const { SlashCommandBuilder } = require('@discordjs/builders');
const colors = require('colors');
const fs = require('fs');
const path = require('path');
const EmbedBuilder = require('../../src/EmbedBuilder/EmbedBuilder');
const output = require('../../src/console/output');
const getSettings = require('../../src/verifyFiles/getSettings');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addreplychannel')
        .setDescription('Add a reply channel')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Select a channel to add to the list of reply channels')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {            
            const serverSettings = getSettings(interaction.guild.name);
            const isServerOwner = interaction.user.id === interaction.guild.ownerId;
            const hasTrustedRole = serverSettings.trustedRoles.some(roleId => interaction.member.roles.cache.has(roleId));

            output.debug(`Checking User...`);

            if (!isServerOwner && !hasTrustedRole) {
                const rejectedEmbed = EmbedBuilder.error('AutoResponse - Rejected', 'You are not authorized to use this command.');
                output.warn(`${colors.cyan(interaction.user.username)} is not authorized to use this command`);
                return interaction.reply({ embeds: [rejectedEmbed], ephemeral: true });
            }

            output.debug(`Running command...`);

            const selectedChannel = interaction.options.getChannel('channel');

            if (!selectedChannel) {
                const errorEmbed = EmbedBuilder.error('AutoResponse - Error', 'Channel not found.');
                output.warn(`${colors.cyan(`#${selectedChannel}`)} was not found`);
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            const selectedChannelId = selectedChannel.id;

            serverSettings.replyChannels = serverSettings.replyChannels || [];
            if (!serverSettings.replyChannels.some(channel => channel.id === selectedChannelId)) {
                serverSettings.replyChannels.push({ id: selectedChannelId, chance: 6 });

                const settingsFilePath = path.join(__dirname, '..', '..', 'data', interaction.guild.name, 'settings.json');
                fs.writeFileSync(settingsFilePath, JSON.stringify(serverSettings, null, 2));

                output.info(`${colors.cyan(interaction.user.username)} added ${colors.cyan(`#${selectedChannel.name}`)}`);
                const successEmbed = EmbedBuilder.done('AutoResponse - Done', `<#${selectedChannel.id}> has been added to the list of reply channels.`);
                await interaction.reply({ embeds: [successEmbed], ephemeral: true  });
            } else {
                output.warn(`${colors.cyan(`#${selectedChannel.name}`)} already exists`);
                const errorEmbed = EmbedBuilder.warn('AutoResponse - Warning', `<#${selectedChannel.id}> is already in the list of reply channels.`);
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true  });
            }

        } catch (error) {
            output.error(`Error executing command /addreplychannel: ${error.message}`);
            const errorEmbed = EmbedBuilder.error('AutoResponse - Error', `${error.message}`);
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};
