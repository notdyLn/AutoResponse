const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

const leaderboardFilePath = path.join(__dirname, '../../data/leaderboard.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Display the leaderboard of members who received the most replies'),
    async execute(interaction) {
        try {
            const leaderboard = loadLeaderboard();

            if (!Array.isArray(leaderboard)) {
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle(`Error loading leaderboard data.`)
                    .setTimestamp();

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (leaderboard.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle(`Leaderboard is empty.`)
                    .setTimestamp();

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const sortedLeaderboard = leaderboard.sort((a, b) => b.replies - a.replies);
            const topEntries = sortedLeaderboard.slice(0, 10);

            const leaderboardString = topEntries
                .map((entry, index) => {
                    const medals = ["🥇", "🥈", "🥉"];
                    const medal = index < 3 ? medals[index] : `${index + 1}th`;

                    return `${medal} ${entry.username}: ${entry.replies} replies`;
                })
                .join('\n');

            const embed = new EmbedBuilder()
                .setColor(0x6969FF)
                .setTitle(`Leaderboard:`)
                .setDescription(leaderboardString)
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            const errorEmbed = createErrorEmbed(error);
            console.error(error);
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};

function loadLeaderboard() {
    try {
        const leaderboardData = fs.readFileSync(leaderboardFilePath, 'utf8');
        const leaderboard = JSON.parse(leaderboardData);

        if (typeof leaderboard === 'object' && leaderboard !== null) {
            const entries = Object.entries(leaderboard);
            const formattedLeaderboard = entries.map(([username, replies]) => ({ username, replies }));
            return formattedLeaderboard;
        }

        console.log('Original Leaderboard:', leaderboard);
        return [];
    } catch (error) {
        console.error('Error loading leaderboard:', error);
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