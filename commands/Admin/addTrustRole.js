const { SlashCommandBuilder } = require('@discordjs/builders');
const colors = require('colors');
const fs = require('fs');
const path = require('path');
const EmbedBuilder = require('../../src/EmbedBuilder/EmbedBuilder');
const getSettings = require('../../src/verifyFiles/getSettings');
const output = require('../../src/console/output');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addtrustrole')
        .setDescription('Add a trust role')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to add')
                .setRequired(true)),
    async execute(interaction) {
        try {
            const roleToAdd = interaction.options.getRole('role');

            const serverName = interaction.guild.name;
            const settings = getSettings(serverName);

            const isServerOwner = interaction.user.id === interaction.guild.ownerId;

            output.debug(`Checking User...`);

            if (!isServerOwner) {
                const unauthorizedEmbed = EmbedBuilder.error('AutoResponse - Rejected', 'You are not authorized to use this command.');
                output.warn(`${colors.cyan(interaction.user.username)} is not authorized to use this command`);
                return await interaction.reply({ embeds: [unauthorizedEmbed], ephemeral: true });
            }

            output.debug(`Running command...`);

            settings.trustedRoles = settings.trustedRoles || [];

            if (settings.trustedRoles.includes(roleToAdd.id)) {
                const alreadyAddedEmbed = EmbedBuilder.error('AutoResponse - Already Added', `<@&${roleToAdd.id}> is already in the list of trusted roles.`);
                output.warn(`${colors.cyan(roleToAdd.name)} is already in the list`);
                return await interaction.reply({ embeds: [alreadyAddedEmbed], ephemeral: true });
            }

            settings.trustedRoles.push(roleToAdd.id);

            const settingsFilePath = path.join(__dirname, '..', '..', 'data', serverName, 'settings.json');
            fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));

            const successEmbed = EmbedBuilder.done('AutoResponse - Done', `<@&${roleToAdd.id}> has been added to the list of trusted roles.`);
            output.info(`${colors.cyan(interaction.user.username)} added ${colors.cyan(`@${roleToAdd.name}`)}`);
            await interaction.reply({ embeds: [successEmbed], ephemeral: true });

        } catch (error) {
            output.error(`Error executing command /addtrustrole: ${error.message}`);
            const errorEmbed = EmbedBuilder.error('AutoResponse - Error', `${error.message}`);
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};
