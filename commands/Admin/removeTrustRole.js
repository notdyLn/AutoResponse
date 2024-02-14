const { SlashCommandBuilder } = require('@discordjs/builders');
const colors = require('colors');
const fs = require('fs');
const path = require('path');
const EmbedBuilder = require('../../src/EmbedBuilder/EmbedBuilder');
const getSettings = require('../../src/verifyFiles/getSettings');
const output = require('../../src/console/output');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removetrustrole')
        .setDescription('Remove a trusted role')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to remove')
                .setRequired(true)),
    async execute(interaction) {
        try {
            const roleToRemove = interaction.options.getRole('role');

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

            settings.trustedRoles = settings.trustedRoles || [];

            if (!settings.trustedRoles.includes(roleToRemove.id)) {
                const notFoundEmbed = EmbedBuilder.info('AutoResponse - Warning', `<@&${roleToRemove.id}> is not in the list of trusted roles.`);
                output.warn(`${colors.cyan(roleToRemove.name)} is not in the list`);
                return await interaction.reply({ embeds: [notFoundEmbed], ephemeral: true });
            }

            settings.trustedRoles = settings.trustedRoles.filter(roleId => roleId !== roleToRemove.id);

            const settingsFilePath = path.join(__dirname, '..', '..', 'data', serverName, 'settings.json');
            fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));

            const successEmbed = EmbedBuilder.info('AutoResponse - Done', `<@&${roleToRemove.id}> has been removed from the list of trusted roles.`);
            output.info(`${colors.cyan(interaction.user.username)} removed ${colors.cyan(`@${roleToRemove.name}`)}`);
            await interaction.reply({ embeds: [successEmbed], ephemeral: true });

        } catch (error) {
            output.error(`Error executing command /removetrustrole: ${error.message}`);
            const errorEmbed = EmbedBuilder.error('AutoResponse - Error', `${error.message}`);
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};
