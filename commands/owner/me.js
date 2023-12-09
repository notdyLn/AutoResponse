const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { logToConsole } = require('../../output/console');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../../settings/config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const botOwnerId = config.ownerId;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('me')
        .setDescription('Send a message to the channel')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to send')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.user;

        if (user.id !== botOwnerId) {
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle(`You do not have permission to use this command.`)
                .setTimestamp();

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const messageToSend = interaction.options.getString('message');

        try {
            const embed = new EmbedBuilder()
                .setColor(0xFFFF00)
                .setTitle(`/me ${messageToSend}`)
                .setDescription('Message is being sent...')
                .addFields({ name: ' ', value: ' ', inline: false })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
            await interaction.channel.send(`${messageToSend}`);
            logToConsole(`Message sent by ${user.tag}: ${messageToSend}`, 'info');

            const editEmbed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle(`/me ${messageToSend}`)
                .setDescription('Message was sent. You can dismiss this message.')
                .addFields({ name: ' ', value: ' ', inline: false })
                .setTimestamp();

            await interaction.editReply({ embeds: [editEmbed], ephemeral: true });
        } catch (error) {
            const errorEmbed = createErrorEmbed(error);
            console.error(error);
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};

function createErrorEmbed(error) {
    return new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('An Error Occurred:')
        .setDescription(`${error}`)
        .setTimestamp();
}
