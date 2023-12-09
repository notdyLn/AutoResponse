const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

const dataFolderPath = path.join(__dirname, '../../data/servers');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('List the first 50 phrases in the server'),
    async execute(interaction) {
        const serverId = interaction.guildId;

        try {
            if (!fs.existsSync(dataFolderPath)) {
                fs.mkdirSync(dataFolderPath, { recursive: true });
            }

            const serverFolderPath = path.join(dataFolderPath, serverId);
            if (!fs.existsSync(serverFolderPath)) {
                fs.mkdirSync(serverFolderPath, { recursive: true });
            }

            const phrasesFilePath = path.join(serverFolderPath, 'phrases.json');
            ensureFileExists(phrasesFilePath, '[]');

            const phrases = loadPhrases(serverId);

            if (phrases.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle(`No phrases found.`)
                    .setTimestamp();

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const first50Phrases = phrases.slice(0, 50).join('\n');

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle(`Current Phrases:`)
                .setDescription(first50Phrases)
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            const errorEmbed = createErrorEmbed(error);
            console.error(error);
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};

function ensureFileExists(filePath, defaultContent = '{}') {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, defaultContent, 'utf8');
    }
}

function loadPhrases(serverId) {
    try {
        const phrasesData = fs.readFileSync(path.join(dataFolderPath, `${serverId}/phrases.json`), 'utf8');
        return JSON.parse(phrasesData);
    } catch (error) {
        return [];
    }
}

function createErrorEmbed(error) {
    return {
        color: 0xFF0000,
        title: 'An Error Occurred:',
        description: `${error}`,
        timestamp: new Date(),
    };
}