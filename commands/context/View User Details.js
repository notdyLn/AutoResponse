const { ApplicationCommandType, ContextMenuCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { UserEmbed, ErrorEmbed } = require("../../utils/embeds");
const { CommandError } = require("../../utils/logging");
const { EMOJIS } = require("../../utils/constants");

const command = new ContextMenuCommandBuilder()
    .setName("View User Details")
    .setType(ApplicationCommandType.User)
    .setDMPermission(true)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

command.integration_types = [
    1
];

module.exports = {
    data: command,
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const targetUser = await interaction.client.users.fetch(interaction.targetId, { force: true });
            const guildMember = await interaction.guild.members.fetch(targetUser.id);
            const userTag = targetUser.tag;
            const userId = targetUser.id;
            const createdTimestamp = targetUser.createdTimestamp;
            const formattedDiscordTimestamp = `<t:${Math.floor(createdTimestamp / 1000)}:f>`;
            const joinedTimestamp = guildMember.joinedTimestamp;
            const formattedJoinedTimestamp = `<t:${Math.floor(joinedTimestamp / 1000)}:f>`;
            const highestRole = guildMember.roles.highest.name;
            const avatarURL = targetUser.avatarURL({ size: 4096 }) || null;
            const bannerURL = targetUser.bannerURL({ size: 4096 }) || null;
            
            let highestRolePermissions = 'No special permissions';

            try {
                highestRolePermissions = guildMember.roles.highest.permissions.toArray()
                    .map(permission => `\` ${permission} \``)
                    .join('\n') || 'No special permissions';
            } catch (error) {
                return Error(interaction.commandName, error.stack);
            }

            let badges = '';
            const userFlags = await targetUser.fetchFlags();
            userFlags.toArray().forEach(flag => {
                if (flag === 'ActiveDeveloper') { badges += EMOJIS.ActiveDeveloper; }
                if (flag === 'BotHTTPInteractions') { badges += EMOJIS.HTTPInteractions; }
                if (flag === 'BugHunterLevel1') { badges += EMOJIS.BugHunter; }
                if (flag === 'BugHunterLevel2') { badges += EMOJIS.BugHunterGold; }
                if (flag === 'CertifiedModerator') { badges += EMOJIS.ModeratorAlumni; }
                if (flag === 'HypeSquadOnlineHouse1') { badges += EMOJIS.HypesquadBravery; }
                if (flag === 'HypeSquadOnlineHouse2') { badges += EMOJIS.HypesquadBrilliance; }
                if (flag === 'HypeSquadOnlineHouse3') { badges += EMOJIS.HypesquadBalance; }
                if (flag === 'Quarentined') { badges += EMOJIS.exclamation; }
                if (flag === 'Spammer') { badges += EMOJIS.exclamation; }
                if (flag === 'Staff') { badges += EMOJIS.DiscordStaff; }
                if (flag === 'VerifiedBot') { badges += EMOJIS.VerifiedApp; }
                if (flag === 'VerifiedDeveloper') { badges += EMOJIS.VerifiedApp; }
            });

            if (avatarURL.endsWith('.gif') || bannerURL) { badges += EMOJIS.Nitro; }

            if (!badges) {
                badges = '\` None \`';
            }

            const userEmbed = UserEmbed(userTag, userId, highestRole, highestRolePermissions, badges, formattedDiscordTimestamp, formattedJoinedTimestamp, avatarURL, bannerURL);
            await interaction.editReply({ embeds: [userEmbed] });
        } catch (error) {
            CommandError(interaction.commandName, error.stack);

            const errorEmbed = ErrorEmbed(`Error executing ${interaction.commandName}:\n${error.message}`);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
};