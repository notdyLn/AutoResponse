const { SlashCommandBuilder } = require('@discordjs/builders');
const colors = require('colors');
const fs = require('fs');
const path = require('path');
const EmbedBuilder = require('../../src/EmbedBuilder/EmbedBuilder');
const output = require('../../src/console/output');

const optOutFilePath = path.join(__dirname, '..', '..', 'data', 'blacklist.json');

function getOptOutList() {
    try {
        if (fs.existsSync(optOutFilePath)) {
            const optOutData = fs.readFileSync(optOutFilePath, 'utf8');
            return JSON.parse(optOutData);
        } else {
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
        .setName('optout')
        .setDescription('Opt out of receiving replies'),
    async execute(interaction) {
        try {
            const userTag = interaction.user.tag;
            const optOutList = getOptOutList();

            if (!optOutList.includes(userTag)) {
                optOutList.push(userTag);
                updateOptOutList(optOutList);

                const successEmbed = EmbedBuilder.done('AutoResponse - Done', `You have opted out of receiving replies.\n` + `Use **/optin** to start receiving replies again.`);
                output.debug(`${colors.cyan(interaction.user.username)} opted out of receiving replies`);
                await interaction.reply({ embeds: [successEmbed], ephemeral: true });
            } else {
                const warnEmbed = EmbedBuilder.warn('AutoResponse - Warning', `You are already opted out of receiving replies.\n` + `Use **/optin** to start receiving replies again.`);
                output.debug(`${colors.cyan(interaction.user.username)} already is opted out to receive replies`);
                await interaction.reply({ embeds: [warnEmbed], ephemeral: true });
            }

        } catch (error) {
            output.error(`Error executing command /optout: ${error.message}`);
            const errorEmbed = EmbedBuilder.error('AutoResponse - Error', `${error.message}`);
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};
