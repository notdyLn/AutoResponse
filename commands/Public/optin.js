const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const EmbedBuilder = require('../../src/EmbedBuilder/EmbedBuilder');
const output = require('../../src/console/output');

const optOutFilePath = path.join(__dirname, '..', '..', 'data', 'blacklist.json');

function getOptOutList() {
    try {
        if (fs.existsSync(optOutFilePath)) {
            const optOutData = fs.readFileSync(optOutFilePath, 'utf8');
            output.debug(optOutFilePath);
            return JSON.parse(optOutData);
        } else {
            output.debug(optOutFilePath);
            return [];
        }
    } catch (error) {
        output.error(`Error getting opt-out list: ${error.message}`);
        return [];
    }
}

function updateOptOutList(optOutList) {
    try {
        fs.writeFileSync(optOutFilePath, JSON.stringify(optOutList, null, 2));
    } catch (error) {
        output.error(`Error updating opt-out list: ${error.message}`);
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('optin')
        .setDescription('Opt in to receive replies'),
    async execute(interaction) {
        try {
            const userName = interaction.user.username;
            const userTag = interaction.user.tag;
            const optOutList = getOptOutList();

            if (!optOutList.includes(userTag)) {
                const warnEmbed = EmbedBuilder.warn(
                    'AutoResponse - Warning',
                    `You are already opted in to receive replies.\n` + `Use **/optout** to stop receiving replies.`
                );
                output.debug(`${colors.cyan(userName)} is already opted in to receive replies`);
                return await interaction.reply({ embeds: [warnEmbed], ephemeral: true });
            }

            const updatedOptOutList = optOutList.filter(tag => tag !== userTag);
            updateOptOutList(updatedOptOutList);

            const successEmbed = EmbedBuilder.done(
                'AutoResponse - Done',
                `You have opted in to receive replies.\n` + `Use **/optout** to stop receiving replies.`
            );
            output.debug(`${colors.cyan(userName)} opted in to receive replies`);
            await interaction.reply({ embeds: [successEmbed], ephemeral: true });

        } catch (error) {
            output.error(`Error executing command /optin: ${error.message}`);
            const errorEmbed = EmbedBuilder.error('AutoResponse - Error', `${error.message}`);
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};
