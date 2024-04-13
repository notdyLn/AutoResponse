const { messageCreate, Debug, Error } = require('../../utils/logging');
const fs = require('fs');
const path = require('path');
const getSettings = require('../../utils/getSettings');
const replyToUser = require('../../utils/reply');
const optOutFilePath = path.join(__dirname, '..', '..', 'data', 'blacklist.json');
const leaderboardFilePath = path.join(__dirname, '..', 'data', 'leaderboards', 'current.json');

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

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        const server = message.guild.name;
        const channel = message.channel.name;
        const globalUsername = message.author.tag;
        const messageContent = message.content.replace(/[\r\n]+/g, ' ');
        const attachments = message.attachments;
        const settings = getSettings(server);
        const replyChannels = settings.replyChannels || [];
        const replyChannel = replyChannels.find(channel => channel.id === message.channel.id);
        const cleanedContent = message.content.replace(/[\r\n]+/g, ' ');
        const optOutList = getOptOutList();

        if (message.author.bot || message.webhookId) {
            messageCreate(`${`BOT`.white} - ${server.cyan} - ${'#'.cyan + channel.cyan} - ${globalUsername.cyan} - ${messageContent.white}`);
            return;
        }

        if (!replyChannel) {
            messageCreate(`${`0%`.red } - ${server.cyan} - ${'#'.cyan + channel.cyan} - ${globalUsername.cyan} - ${messageContent.white}`);
            return;
        }

        if (optOutList.includes(globalUsername)) {
            messageCreate(`${`0%`.red} - ${server.cyan} - ${'#'.cyan + channel.cyan} - ${globalUsername.cyan} - ${messageContent.white}`);
            return;
        }

        let chance = replyChannel.chance || 6;
        chance += 1;
        replyChannel.chance = chance;
        settings.replyChannels = replyChannels;
        fs.writeFileSync(path.join(__dirname, '..', '..', 'data', server, 'settings.json'), JSON.stringify(settings, null, 2));

        messageCreate(`${(chance + '%').green} - ${server.cyan} - ${'#'.cyan + channel.cyan} - ${globalUsername.cyan} - ${messageContent.white}`);
    
        if (Math.random() * 100 < replyChannel.chance) {
            const leaderboardData = fs.existsSync(leaderboardFilePath)
              ? JSON.parse(fs.readFileSync(leaderboardFilePath, 'utf8'))
              : {};
      
            const sortedLeaderboard = Object.entries(leaderboardData).sort((a, b) => b[1] - a[1]);
            const [firstPlaceUser, secondPlaceUser] = sortedLeaderboard.slice(0, 2);
      
            if (firstPlaceUser && secondPlaceUser && firstPlaceUser[1] - secondPlaceUser[1] >= 5) {
              const userPosition = sortedLeaderboard.findIndex(user => user[0] === globalUsername);
      
              if (userPosition === 0 && firstPlaceUser[1] - secondPlaceUser[1] >= 5) {
                return;
              } else {
                await replyToUser(message, globalUsername);
              }
            } else {
              await replyToUser(message, globalUsername);
            }
      
            replyChannel.chance = 6;
            settings.replyChannels = replyChannels;
            fs.writeFileSync(path.join(__dirname, '..', '..', 'data', server, 'settings.json'), JSON.stringify(settings, null, 2));
        }
    }
};