const { SlashCommandBuilder } = require('@discordjs/builders');
const colors = require('colors');
const fs = require('fs');
const path = require('path');
const EmbedBuilder = require('../../src/EmbedBuilder/EmbedBuilder');
const getSettings = require('../../src/verifyFiles/getSettings');
const output = require('../../src/console/output');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removereplychannel')
        .setDescription('Remove a reply channel')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to remove')
                .setRequired(true)),
    async execute(interaction) {
        try {
            const channelToRemove = interaction.options.getChannel('channel');

            const serverName = interaction.guild.name;
            const settings = getSettings(serverName);

            const isServerOwner = interaction.user.id === interaction.guild.ownerId;
            const hasTrustedRole = settings.trustedRoles.some(roleId => interaction.member.roles.cache.has(roleId));

            output.debug(`Checking User...`);

            if (!isServerOwner && !hasTrustedRole) {
                const unauthorizedEmbed = EmbedBuilder.error('AutoResponse - Rejected', 'You are not authorized to use this command.');
                output.warn(`${colors.cyan(interaction.user.username)} is not authorized to use this command`);
                return await interaction.reply({ embeds: [unauthorizedEmbed], ephemeral: true });
            }

            output.debug(`Running command...`);

            settings.replyChannels = settings.replyChannels || [];

            const indexToRemove = settings.replyChannels.findIndex(channel => channel.id === channelToRemove.id);
            if (indexToRemove === -1) {
                const notFoundEmbed = EmbedBuilder.warn('AutoResponse - Warning', `<#${channelToRemove.id}> is not in the list of reply channels.`);
                output.warn(`${colors.cyan(`#${channelToRemove.name}`)} is not in the list`);
                return await interaction.reply({ embeds: [notFoundEmbed], ephemeral: true });
            }

            settings.replyChannels.splice(indexToRemove, 1);

            const settingsFilePath = path.join(__dirname, '..', '..', 'data', serverName, 'settings.json');
            fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));

            output.debug(`Removed #${channelToRemove.name}`);
            const successEmbed = EmbedBuilder.done('AutoResponse - Done', `${channelToRemove.name} has been removed from the list of reply channels.`);
            await interaction.reply({ embeds: [successEmbed], ephemeral: true });

        } catch (error) {
            output.error(`Error executing command /removereplychannel: ${error.message}`);
            const errorEmbed = EmbedBuilder.error('AutoResponse - Error', `${error.message}`);
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};
