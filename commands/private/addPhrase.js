const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { logToConsole } = require('../../output/console');
const fs = require('fs');
const path = require('path');

const dataFolderPath = path.join(__dirname, '../../data/servers');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addphrase')
        .setDescription('Add a phrase to the server list')
        .addStringOption(option => option
            .setName('phrase')
            .setDescription('Enter the phrase')
            .setRequired(true)),
    async execute(interaction) {
        const serverId = interaction.guildId;
        const memberId = interaction.user.id;
        const phrase = interaction.options.getString('phrase');

        const allowedRoleId = loadSettings(serverId).allowedRoleId;
        const member = await interaction.guild.members.fetch(memberId);
        if (!member.roles.cache.has(allowedRoleId)) {
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle(`You do not have permission to use this command.`)
                .setTimestamp();

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

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

            if (phrases.includes(phrase)) {
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle(`"${phrase}" is already in the phrases list.`)
                    .setTimestamp();

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const keywords = [ "balls", "ballz", "cock", "cocks", "pussy", "pussies", "vagina", "vaginas", "cunt", "cunts", "sex", "sexual", "edp" ];
            if (keywords.some(keyword => phrase.toLowerCase().includes(keyword))) {
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle(`That phrase is not allowed.`)
                    .setTimestamp();
            
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            phrases.push(phrase);

            savePhrases(serverId, phrases);

            logToConsole(`Phrase added for server ${serverId}: ${phrase}`, 'info');
            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle(`Phrase added: "${phrase}"`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            const errorEmbed = createErrorEmbed(error);
            console.error(error);
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};

function loadSettings(serverId) {
    try {
        const settingsData = fs.readFileSync(path.join(dataFolderPath, `${serverId}/settings.json`), 'utf8');
        return JSON.parse(settingsData);
    } catch (error) {
        return {};
    }
}

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

function savePhrases(serverId, phrases) {
    const phrasesFilePath = path.join(dataFolderPath, `${serverId}/phrases.json`);
    const phrasesData = JSON.stringify(phrases, null, 2);
    fs.writeFileSync(phrasesFilePath, phrasesData, 'utf8');
}

function createErrorEmbed(error) {
    return {
        color: 0xFF0000,
        title: 'An Error Occurred:',
        description: `${error}`,
        timestamp: new Date(),
    };
}