const { SlashCommandBuilder } = require('@discordjs/builders');
const colors = require('colors');
const fs = require('fs');
const path = require('path');
const EmbedBuilder = require('../../src/EmbedBuilder/EmbedBuilder');
const getSettings = require('../../src/verifyFiles/getSettings');
const output = require('../../src/console/output');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removephrase')
        .setDescription('Remove a phrase')
        .addStringOption(option =>
            option.setName('phrase')
                .setDescription('The phrase to remove')
                .setRequired(true)),
    async execute(interaction) {
        try {
            const phraseToRemove = interaction.options.getString('phrase');

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

            settings.phrases = settings.phrases || [];

            const indexOfPhrase = settings.phrases.indexOf(phraseToRemove);
            if (indexOfPhrase === -1) {
                const notFoundEmbed = EmbedBuilder.warn('AutoResponse - Warning', `"${phraseToRemove}" is not in the list of reply phrases.`);
                output.warn(`"${colors.cyan(phraseToRemove)}" is not in the list`);
                return await interaction.reply({ embeds: [notFoundEmbed], ephemeral: true });
            }

            settings.phrases.splice(indexOfPhrase, 1);

            const settingsFilePath = path.join(__dirname, '..', '..', 'data', serverName, 'settings.json');
            fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));

            const successEmbed = EmbedBuilder.done('AutoResponse - Done', `"${phraseToRemove}" has been removed from the list of reply phrases.`);
            output.info(`${colors.cyan(interaction.user.username)} removed "${colors.cyan(phraseToRemove)}"`);
            await interaction.reply({ embeds: [successEmbed], ephemeral: true });

        } catch (error) {
            output.error(`Error executing command /removephrase: ${error.message}`);
            const errorEmbed = EmbedBuilder.error('AutoResponse - Error', `${error.message}`);
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};
