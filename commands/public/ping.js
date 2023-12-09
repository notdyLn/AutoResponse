const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { logToConsole } = require('../../output/console');

const loadingImageUrl = 'https://cdn.discordapp.com/emojis/1138172643867111595.gif?size=80&quality=lossless';

const passes = 50;

const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Get AutoResponse\'s latency and the API latency');

module.exports = { data, execute };

async function execute(interaction) {
    const loadingEmbed = new EmbedBuilder()
        .setColor(0x696969)
        .setTitle('Running Test...')
        .setThumbnail(loadingImageUrl)
        .setTimestamp();

    await interaction.reply({ embeds: [loadingEmbed], ephemeral: true });
    logToConsole(`Running ping test...`, 'info');

    let totalBotLatency = 0;
    let totalApiLatency = 0;

    let startTimestamp = Date.now();

    for (let i = 0; i < passes; i++) {
        const endTimestamp = Date.now();
        const botLatency = endTimestamp - startTimestamp;
        let apiLatency = interaction.client.ws.ping;
    
        apiLatency = Math.max(apiLatency, 0);
    
        totalBotLatency += botLatency;
        totalApiLatency += apiLatency;
    
        startTimestamp = Date.now();
    
        await sleep(100);
    }

    const averageBotLatency = Math.round(totalBotLatency / passes);
    const averageApiLatency = Math.round(totalApiLatency / passes);

    const finalEmbed = new EmbedBuilder()
        .setColor(0x696969)
        .setTitle('Latency Test Results')
        .addFields(
            { name: 'You → Bot', value: `≈ ${averageBotLatency}ms`, inline: true },
            { name: '\t', value: `\t`, inline: true },
            { name: 'Bot → Discord', value: `≈ ${averageApiLatency}ms`, inline: true }
        )
        .setTimestamp();

    await interaction.editReply({ embeds: [finalEmbed] });
    logToConsole(`Bot Latency: ${averageBotLatency}ms`, 'info');
    logToConsole(`API Latency: ${averageApiLatency}ms`, 'info');

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
