const { SlashCommandBuilder } = require('@discordjs/builders');
const colors = require('colors');
const config = require('../../config/settings.json');
const EmbedBuilder = require('../../src/EmbedBuilder/EmbedBuilder');
const output = require('../../src/console/output');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('Restart AutoResponse'),
    async execute(interaction) {
        const allowedUserId = config.ownerId;
        output.debug(`Checking User...`);

        if (interaction.user.id !== allowedUserId) {
            const rejectedEmbed = EmbedBuilder.error('AutoResponse - Rejected', `You are not authorized to use this command.`);
            output.warn(`${colors.cyan(interaction.user.username)} is not authorized to use this command`);
            return interaction.reply({ embeds: [rejectedEmbed], ephemeral: true });
        } else {
            output.debug(`Hello ${colors.cyan(interaction.user.username)}`);
            output.debug(`Running command...`);

            try {
                const countdownDuration = 1;
                const initialEmbed = EmbedBuilder.warn(`AutoResponse - Restarting`, `Restarting...`);
                interaction.reply({ embeds: [initialEmbed], ephemeral: true });

                let countdownRemaining = countdownDuration;

                output.debug(`RESTARTING`);

                const updateInterval = setInterval(() => {
                    countdownRemaining--;

                    if (countdownRemaining <= 0) {
                        clearInterval(updateInterval);
                        const restartedEmbed = EmbedBuilder.done(`AutoResponse - Done`, `AutoResponse was Restarted.`);
                        interaction.editReply({ embeds: [restartedEmbed], ephemeral: true }).then(() => {
                            process.exit();
                        });
                    } else {
                        const loadingEmbed = EmbedBuilder.warn(`AutoResponse - Restarting`, `Restarting in ${countdownRemaining - 1}s...`);
                        interaction.editReply({ embeds: [loadingEmbed], ephemeral: true });
                    }
                }, 1000);
            } catch (error) {
                output.error(`Error executing command /restart: ${error.message}`);
                const errorEmbed = EmbedBuilder.error(`AutoResponse - Error`, `${error.message}`);
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },
};
