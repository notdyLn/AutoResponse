const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { RANKS } = require('../utils/constants');
const { ErrorEmbed, Leaderboard } = require('../utils/embeds');
const { Error, Debug } = require('../utils/logging');
const fs = require('fs');
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
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    async execute(interaction) {
        try {
            const season = interaction.options.getString('season');
            const leaderboard = loadLeaderboard(season);
            const helpers = loadHelpers();
            const owners = loadOwner();
            const previousWinners = loadPreviousWinners();
    
            if (leaderboard.length === 0) {
                const emptyEmbed = ErrorEmbed(`Error`, `Leaderboard is empty.`);
    
                return interaction.reply({ embeds: [emptyEmbed], ephemeral: true });
            }
    
            const sortedLeaderboard = leaderboard.sort((a, b) => b.replies - a.replies);
            const topEntries = sortedLeaderboard.slice(0, 10);
    
            const leaderboardFields = topEntries.map((entry, index) => {
                const medals = ["1st", "2nd", "3rd"];
                const medal = index < 3 ? medals[index] : `**${index + 1}th**`;

                const owner = owners.includes(entry.username) ? RANKS.owner : "";
                const helper = helpers.includes(entry.username) ? RANKS.helper : "";
                const prevwinner = previousWinners.includes(entry.username) ? RANKS.s1 : "";
    
                return {
                    name: `${medal} - ${entry.username} ${owner} ${helper} ${prevwinner}`,
                    value: `**${entry.replies} replies**`,
                    inline: false,
                };
            });

            let description = '';

            if (season === 'current') {
                description = 'This is the current leaderboard. The next season starts <t:1735707600:R>';
            } else {
                description = 'You are currently viewing an older leaderboard.';
            }
    
            const leaderboardEmbed = Leaderboard(`Leaderboard - ${season}`, description, leaderboardFields);
    
            await interaction.reply({ embeds: [leaderboardEmbed], ephemeral: true });
        } catch (error) {
            const errorEmbed = ErrorEmbed('Error executing /leaderboard: ', error.message);
            Error(`Error executing /leaderboard: ${error.message}`);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }        
};
    
function loadLeaderboard(season) {
    try {
        const filename = season ? `${season}.json` : 'current.json';
        const filePath = path.join(__dirname, '../data/leaderboards', filename);

        const leaderboardData = fs.readFileSync(filePath, 'utf8');
        let leaderboard;

        try {
            leaderboard = JSON.parse(leaderboardData);
        } catch (error) {
            Error(`Error: ${error}`);
            return [];
        }

        if (Array.isArray(leaderboard)) {
            return leaderboard;
        } else if (typeof leaderboard === 'object') {
            return Object.keys(leaderboard).map(username => ({ username, replies: leaderboard[username] }));
        }

        Debug(`Loaded leaderboard for ${season || 'current'}`, 'success');
        return [];
    } catch (error) {
        Error(`Error: ${error}`);
        return [];
    }
}

function loadHelpers() {
    try {
        const filePath = path.join(__dirname, '../config/client.json');

        const settingsData = fs.readFileSync(filePath, 'utf8');
        const settings = JSON.parse(settingsData);

        return settings.helpers || [];
    } catch (error) {
        Error(`Error: ${error}`);
        return [];
    }
}

function loadPreviousWinners() {
    try {
        const settingsFilePath = path.join(__dirname, '../config/client.json');
        const settingsData = fs.readFileSync(settingsFilePath, 'utf8');
        const settings = JSON.parse(settingsData);

        return settings.previousWinners || [];
    } catch (error) {
        Error(`Error: ${error}`);
        return [];
    }
}

function loadOwner() {
    try {
        const settingsFilePath = path.join(__dirname, '../config/client.json');
        const settingsData = fs.readFileSync(settingsFilePath, 'utf8');
        const settings = JSON.parse(settingsData);

        return settings.owner || [];
    } catch (error) {
        Error(`Error: ${error}`);
        return [];
    }
}