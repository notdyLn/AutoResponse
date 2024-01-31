const { SlashCommandBuilder } = require('@discordjs/builders');
const colors = require('colors');
const config = require('../../config/settings.json');
const EmbedBuilder = require('../../src/EmbedBuilder/EmbedBuilder');
const output = require('../../src/console/output');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('me')
        .setDescription('Send a message as AutoResponse')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to send')
                .setRequired(true)),
    async execute(interaction) {
        const allowedUserId = config.ownerId;
        output.info(`Checking User...`);

        if (interaction.user.id !== allowedUserId) {
            const rejectedEmbed = EmbedBuilder.error('AutoResponse - Rejected', `You are not authorized to use this command.`);
            output.warn(`${colors.cyan(interaction.user.username)} is not authorized to use this command`);
            return interaction.reply({ embeds: [rejectedEmbed], ephemeral: true });
        } else {
            output.debug(`Running command...`);

            const userMessage = interaction.options.getString('message');
            const loadingEmbed = EmbedBuilder.warn(`AutoResponse - Me`, `Sending message...`);
            const doneEmbed = EmbedBuilder.done(`AutoResponse - Me`, `AutoResponse sent your message`);

            await interaction.reply({ embeds: [loadingEmbed], ephemeral: true });
            output.debug(`Sending message...`);

            try {
                await interaction.channel.send(userMessage);
                await interaction.editReply({ embeds: [doneEmbed], ephemeral: true });
            } catch (error) {
                const errorEmbed = EmbedBuilder.error(`AutoResponse - Error`, `${error.message}`);

                await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
                output.error(`Error executing command /me: ${error.message}`);
            } finally {
                output.done(`Message sent`);
            }
        }
    },
};
