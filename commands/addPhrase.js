const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { ErrorEmbed, SuccessEmbed } = require('../utils/embeds');
const { Error, Info } = require('../utils/logging');
const fs = require('fs');
const path = require('path');
const getSettings = require('../utils/getSettings');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addphrase')
        .setDescription('Add a phrase')
        .addStringOption(option => option
            .setName('phrase')
            .setDescription('The phrase to add')
            .setRequired(true)
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        try {
            const phrase = interaction.options.getString('phrase');

            const serverName = interaction.guild.name;
            const settings = getSettings(serverName);

            settings.phrases = settings.phrases || [];

            if (settings.phrases.includes(phrase)) {
                Info(`"${phrase.cyan}" already exists`);

                const alreadyAddedEmbed = ErrorEmbed('Error', `**${phrase}** is already a phrase.`);
                return await interaction.reply({ embeds: [alreadyAddedEmbed], ephemeral: true });
            }

            settings.phrases.push(phrase);

            const settingsFilePath = path.join(__dirname, '..', 'data', serverName, 'settings.json');
            fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));

            Info(`${interaction.user.username.cyan} added the phrase "${phrase.cyan}"`);
            const successEmbed = SuccessEmbed('Added', `**${phrase}** has been added as a phrase.`);
            await interaction.reply({ embeds: [successEmbed], ephemeral: true });

        } catch (error) {
            const errorEmbed = ErrorEmbed('Error executing /addPhrase: ', error.message);
            Error(`Error executing /addPhrase: ${error.message}`);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
};