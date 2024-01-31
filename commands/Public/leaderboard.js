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

            output.debug(`Running command...`);

            if (leaderboard.length === 0) {
                const emptyEmbed = EmbedBuilder.warn(`AutoResponse - Warn`, `Leaderboard is empty.`);

                return interaction.reply({ embeds: [emptyEmbed], ephemeral: true });
            }

            const sortedLeaderboard = leaderboard.sort((a, b) => b.replies - a.replies);
            const topEntries = sortedLeaderboard.slice(0, 10);

            const leaderboardString = topEntries.map((entry, index) => {
                const medals = ["🥇", "🥈", "🥉"];
                const medal = index < 3 ? medals[index] : `**${index + 1}th**`;

                return `${medal} ${entry.username}: ${entry.replies} replies`;
            })
            .join('\n');

            const leaderboardEmbed = EmbedBuilder.done(`AutoResponse - Leaderboard`, leaderboardString);
            output.debug(`Sending embed...`);

            await interaction.reply({ embeds: [leaderboardEmbed], ephemeral: true });
        } catch (error) {
            output.error(`Error executing command /addphrase: ${error.message}`);
            const errorEmbed = EmbedBuilder.error('AutoResponse - Error', `${error.message}`);
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
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