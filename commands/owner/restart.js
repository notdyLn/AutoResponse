const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { logToConsole } = require('../../output/console');

const config = require('../../settings/config.json');

const data = new SlashCommandBuilder()
    .setName('restart')
    .setDescription('Restarts AutoResponse');

module.exports = { data, execute };

async function execute(interaction) {
    const isOwner = interaction.user.id === config.ownerId;

    if (!isOwner) {
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle(`You do not have permission to restart AutoResponse.`)
            .setTimestamp();

        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
        logToConsole('BOT IS RESTARTING', 'warn');
        const embed = new EmbedBuilder()
            .setColor(0xFFFF00)
            .setTitle('Restarting in 5 seconds!')
            .setTimestamp();

        const reply = await interaction.reply({ embeds: [embed], ephemeral: true });

        for (let i = 4; i >= 0; i--) {
            await sleep(1000);

            const title = i === 0 ? 'Bot was restarted.' : `Restarting in ${i} seconds!`;

            const newEmbed = new EmbedBuilder()
                .setColor(0xFFFF00)
                .setTitle(title)
                .setTimestamp();

            await reply.edit({ embeds: [newEmbed] });
        }

        process.exit();
    } catch (error) {
        logToConsole(`Error during bot restart: ${error}`, 'error');
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .addFields(
                { name: `An error occurred`, value: `${error}`, inline: true }
            )
            .setTimestamp();
            
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}