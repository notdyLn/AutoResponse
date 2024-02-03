const { SlashCommandBuilder } = require('@discordjs/builders');
const EmbedBuilder = require('../../src/EmbedBuilder/EmbedBuilder');
const fs = require('fs');
const output = require('../../src/console/output');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Display the leaderboard of members who received the most replies')
        .addStringOption(option =>
            option.setName('season')
                .setDescription('Specify a season for the leaderboard')
                .setRequired(true)
                .addChoices(
                    { name: 'Current', value: 'current' },
                    { name: 'Season 1', value: 'season1' }
                )
        ),
    async execute(interaction) {
        try {
            const season = interaction.options.getString('season');
            const leaderboard = loadLeaderboard(season);
            const helpers = loadHelpers();
            const owners = loadOwner();
            const previousWinners = loadPreviousWinners();
    
            output.debug(`Running command...`);
    
            if (leaderboard.length === 0) {
                const emptyEmbed = EmbedBuilder.warn(`AutoResponse - Warn`, `Leaderboard is empty.`);
    
                return interaction.reply({ embeds: [emptyEmbed], ephemeral: true });
            }
    
            const sortedLeaderboard = leaderboard.sort((a, b) => b.replies - a.replies);
            const topEntries = sortedLeaderboard.slice(0, 10);
    
            const leaderboardFields = topEntries.map((entry, index) => {
                const medals = ["1st", "2nd", "3rd"];
                const medal = index < 3 ? medals[index] : `**${index + 1}th**`;
                const owner = owners.includes(entry.username) ? "<:Programmer:1203392650015936522>" : "";
                const helper = helpers.includes(entry.username) ? "<:Helper:1203391198170189874>" : "";
                const prevwinner = previousWinners.includes(entry.username) ? "<:Season1Winner:1203384448515842119>" : "";
    
                return {
                    name: `${medal} - ${entry.username} ${owner} ${helper} ${prevwinner}`,
                    value: `**${entry.replies}** replies`,
                    inline: false,
                };
            });
    
            const leaderboardEmbed = EmbedBuilder.leaderboard(`AutoResponse - Leaderboard - Season 2`, leaderboardFields);
            output.debug(`Sending embed...`);
    
            await interaction.reply({ embeds: [leaderboardEmbed], ephemeral: true });
        } catch (error) {
            output.error(`Error executing command /leaderboard: ${error.message}`);
            const errorEmbed = EmbedBuilder.error('AutoResponse - Error', `${error.message}`);
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }        
};
    
function loadLeaderboard(season) {
    try {
        const filename = season ? `${season}.json` : 'current.json';
        const filePath = path.join(__dirname, '../../data/leaderboards', filename);

        const leaderboardData = fs.readFileSync(filePath, 'utf8');
        let leaderboard;

        try {
            leaderboard = JSON.parse(leaderboardData);
        } catch (error) {
            output.error(`Error parsing leaderboard data: ${error}`, 'error');
            return [];
        }

        if (Array.isArray(leaderboard)) {
            return leaderboard;
        } else if (typeof leaderboard === 'object') {
            return Object.keys(leaderboard).map(username => ({
                username,
                replies: leaderboard[username],
            }));
        }

        output.debug(`Loaded leaderboard for ${season || 'current'}`, 'success');
        return [];
    } catch (error) {
        output.error(`Loading leaderboard: ${error}`, 'error');
        return [];
    }
}

function loadHelpers() {
    try {
        const filePath = path.join(__dirname, '../../config/settings.json');

        const settingsData = fs.readFileSync(filePath, 'utf8');
        const settings = JSON.parse(settingsData);

        return settings.helpers || [];
    } catch (error) {
        output.error(`Loading starred users: ${error}`, 'error');
        return [];
    }
}

function loadPreviousWinners() {
    try {
        const settingsFilePath = path.join(__dirname, '../../config/settings.json');
        const settingsData = fs.readFileSync(settingsFilePath, 'utf8');
        const settings = JSON.parse(settingsData);

        return settings.previousWinners || [];
    } catch (error) {
        output.error(`Loading previous winners: ${error}`, 'error');
        return [];
    }
}

function loadOwner() {
    try {
        const settingsFilePath = path.join(__dirname, '../../config/settings.json');
        const settingsData = fs.readFileSync(settingsFilePath, 'utf8');
        const settings = JSON.parse(settingsData);

        return settings.owner || [];
    } catch (error) {
        output.error(`Loading owner: ${error}`, 'error');
        return [];
    }
}