const { SlashCommandBuilder } = require('@discordjs/builders');
const colors = require('colors');
const fs = require('fs');
const path = require('path');
const EmbedBuilder = require('../../src/EmbedBuilder/EmbedBuilder');
const getSettings = require('../../src/verifyFiles/getSettings');
const output = require('../../src/console/output');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addphrase')
        .setDescription('Add a phrase')
        .addStringOption(option =>
            option.setName('phrase')
                .setDescription('The phrase to add')
                .setRequired(true)),
    async execute(interaction) {
        try {
            const phrase = interaction.options.getString('phrase');

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

            if (settings.phrases.includes(phrase)) {
                const alreadyAddedEmbed = EmbedBuilder.warn('AutoResponse - Warning', `"${phrase}" is already in the list of reply phrases.`);
                return await interaction.reply({ embeds: [alreadyAddedEmbed], ephemeral: true });
            }

            settings.phrases.push(phrase);

            const settingsFilePath = path.join(__dirname, '..', '..', 'data', serverName, 'settings.json');
            fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));

            output.debug(`${colors.cyan(interaction.user.username)} added the phrase ${colors.cyan(phrase)}`);
            const successEmbed = EmbedBuilder.done('AutoResponse - Done', `"${phrase}" has been added to the list of reply phrases.`);
            await interaction.reply({ embeds: [successEmbed], ephemeral: true });

        } catch (error) {
            output.error(`Error executing command /addphrase: ${error.message}`);
            const errorEmbed = EmbedBuilder.error('AutoResponse - Error', `${error.message}`);
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};
