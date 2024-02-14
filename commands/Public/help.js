const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const EmbedBuilder = require('../../src/EmbedBuilder/EmbedBuilder');
const output = require('../../src/console/output');
const getSettings = require('../../src/verifyFiles/getSettings');

const commandsFolder = path.join(__dirname, '..', '..', 'commands');

function getCommandData(folder) {
    const folderPath = path.join(commandsFolder, folder);
    const commandFiles = fs.readdirSync(folderPath);
    const commandData = [];

    for (const commandFile of commandFiles) {
        const commandPath = path.join(folderPath, commandFile);
        const command = require(commandPath);

        commandData.push({
            name: command.data.name,
            description: command.data.description || 'No Description',
        });
    }

    return commandData;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Display help information'),
    async execute(interaction) {
        try {
            const isServerOwner = interaction.user.id === interaction.guild.ownerId;
            const settings = getSettings(interaction.guild.name);
            const hasTrustedRole = settings.trustedRoles.some(roleId => interaction.member.roles.cache.has(roleId));

            let title, description;

            output.debug(`Running command...`);

            title = `AutoResponse - Public Commands`;
            description = `Here are the available commands:`;

            if (isServerOwner || hasTrustedRole) {
                title = `AutoResponse - Admin Commands`;
                description = `Here are the available commands:`;

                output.debug(`${colors.cyan(interaction.user.username)} is an admin`);
                const adminCommands = getCommandData('Admin');
                adminCommands.forEach(command => {
                    description += `\n- **/${command.name}**: ${command.description}`;
                });
            }

            const publicCommands = getCommandData('Public');
            publicCommands.forEach(command => {
                description += `\n- **/${command.name}**: ${command.description}`;
            });

            output.debug(`Sending embed...`);

            const helpEmbed = EmbedBuilder.done(title, description);
            await interaction.reply({ embeds: [helpEmbed], ephemeral: true });

        } catch (error) {
            output.error(`Error executing command /help: ${error.message}`);
            const errorEmbed = EmbedBuilder.error('AutoResponse - Error', `${error.message}`);
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};
