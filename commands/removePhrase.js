const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { ErrorEmbed, SuccessEmbed } = require('../utils/embeds');
const { Error, Info } = require('../utils/logging');
const fs = require('fs');
const path = require('path');
const getSettings = require('../utils/getSettings');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removephrase')
        .setDescription('Remove a phrase')
        .addStringOption(option => option
            .setName('phrase')
            .setDescription('The phrase to remove')
            .setRequired(true)
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        try {
            const phraseToRemove = interaction.options.getString('phrase');

            const serverName = interaction.guild.name;
            const settings = getSettings(serverName);

            settings.phrases = settings.phrases || [];

            const indexOfPhrase = settings.phrases.indexOf(phraseToRemove);
            if (indexOfPhrase === -1) {
                const notFoundEmbed = ErrorEmbed('Error', `**${phraseToRemove}** is not a phrase.`);
                return await interaction.reply({ embeds: [notFoundEmbed], ephemeral: true });
            }

            settings.phrases.splice(indexOfPhrase, 1);

            const settingsFilePath = path.join(__dirname, '..', 'data', serverName, 'settings.json');
            fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));

            const successEmbed = SuccessEmbed('Done', `**${phraseToRemove}** is no longer a phrase.`);
            await interaction.reply({ embeds: [successEmbed], ephemeral: true });

        } catch (error) {
            const errorEmbed = ErrorEmbed('Error executing /removePhrase: ', error.message);
            Error(`Error executing /removePhrase: ${error.message}`);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },
};
