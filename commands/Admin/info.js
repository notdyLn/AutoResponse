const { SlashCommandBuilder } = require('@discordjs/builders');
const EmbedBuilder = require('../../src/EmbedBuilder/EmbedBuilder');
const output = require('../../src/console/output');
const getSettings = require('../../src/verifyFiles/getSettings');
const config = require('../../config/settings.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Display server information'),
    async execute(interaction) {
        try {
            const isServerOwner = interaction.user.id === interaction.guild.ownerId || interaction.user.id === config.ownerId;

            output.info(`Checking User...`);

            if (!isServerOwner) {
                const unauthorizedEmbed = EmbedBuilder.error('AutoResponse - Rejected', 'You are not authorized to use this command.');
                output.warn(`${colors.cyan(interaction.user.username)} is not authorized to use this command`);
                return await interaction.reply({ embeds: [unauthorizedEmbed], ephemeral: true });
            }

            output.debug(`Running command...`);

            const serverName = interaction.guild.name;
            const settings = getSettings(serverName);

            const phrasesCount = settings.phrases ? settings.phrases.length : 0;
            const replyChannelsCount = settings.replyChannels ? settings.replyChannels.length : 0;
            const replyChannelsList = settings.replyChannels ? settings.replyChannels.map(channel => `<#${channel.id}>`).join(`\n`) : 'None';
            const membersCount = interaction.guild.members.cache.size;

            const trustedRolesCount = settings.trustedRoles ? settings.trustedRoles.length : 0;
            const trustedRolesList = settings.trustedRoles ? settings.trustedRoles.map(roleId => `<@&${roleId}>`).join(`\n`) : 'None';

            const infoEmbed = EmbedBuilder.done(
                `AutoResponse - Server Information`,
                `**Server Name**: ${serverName}\n` +
                `**Phrases**: ${phrasesCount}\n` +
                `**Reply Channels**: ${replyChannelsCount}\n` +
                `${replyChannelsList}\n` +
                `**Trusted Roles**:${trustedRolesCount}\n` +
                `${trustedRolesList}\n` +
                `**Members**: ${membersCount}\n`
            );

            await interaction.reply({ embeds: [infoEmbed], ephemeral: true });

        } catch (error) {
            output.error(`Error executing command /info: ${error.message}`);
            const errorEmbed = EmbedBuilder.error('AutoResponse - Error', `${error.message}`);
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};
