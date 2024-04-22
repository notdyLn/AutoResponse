const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { ErrorEmbed, Leaderboard, SuccessEmbed } = require('../utils/embeds');
const { Error, Debug } = require('../utils/logging');
const fs = require('fs');
const path = require('path');

const optOutFilePath = path.join(__dirname, '..', 'data', 'blacklist.json');

function getOptOutList() {
    try {
        if (fs.existsSync(optOutFilePath)) {
            const optOutData = fs.readFileSync(optOutFilePath, 'utf8');
            return JSON.parse(optOutData);
        } else {
            return [];
        }
    } catch (error) {
        Error(`Error getting opt-out list: ${error.message}`);
        return [];
    }
}

function updateOptOutList(optOutList) {
    try {
        fs.writeFileSync(optOutFilePath, JSON.stringify(optOutList, null, 2));
    } catch (error) {
        Error(`Error updating opt-out list: ${error.message}`);
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('optin')
        .setDescription('Opt in to receive replies')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    async execute(interaction) {
        try {
            const userTag = interaction.user.tag;
            const optOutList = getOptOutList();

            if (!optOutList.includes(userTag)) {
                const errorEmbed = ErrorEmbed( 'Error', `You are already opted in to receive replies.\n` + `Use **/optout** to stop receiving replies.`);
                return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            const updatedOptOutList = optOutList.filter(tag => tag !== userTag);
            updateOptOutList(updatedOptOutList);

            const successEmbed = SuccessEmbed(`You have opted in to receive replies.\n` + `Use **/optout** to stop receiving replies.`
            );
            await interaction.reply({ embeds: [successEmbed], ephemeral: true });

        } catch (error) {
            const errorEmbed = ErrorEmbed('Error executing /optin: ', error.message);
            Error(`Error executing /optin: ${error.message}`);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
};
