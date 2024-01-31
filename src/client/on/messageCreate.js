const https = require('https');
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const output = require('../../console/output');
const getSettings = require('../../verifyFiles/getSettings');
const replyToUser = require('../../reply/reply');
const optOutFilePath = path.join(__dirname, '..', '..', '..', 'data', 'optout.json');

const replyChances = new Map();

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

module.exports = async (message) => {
  try {
    if (message.author.bot || message.webhookId) {
      return;
    }

    const userTag = message.author.tag;
    const channelName = message.channel.name || 'DM';
    const serverName = message.guild ? message.guild.name : 'Unknown Server';
    const attachments = message.attachments;
    const settings = getSettings(serverName);
    const replyChannels = settings.replyChannels || [];
    const replyChannel = replyChannels.find(channel => channel.id === message.channel.id);
    const cleanedContent = message.content.replace(/[\r\n]+/g, ' ');
    const optOutList = getOptOutList();

    if (!replyChannel) {
      output.message(`${colors.red(`0%`)} - ${colors.cyan(serverName)} - ${colors.cyan(`#${channelName}`)} - ${colors.cyan(userTag)}: ${colors.white(cleanedContent)}`);
      return;
    }

    if (optOutList.includes(userTag)) {
      output.message(`${colors.red(`0%`)} - ${colors.cyan(serverName)} - ${colors.cyan(`#${channelName}`)} - ${colors.cyan(userTag)}: ${colors.white(cleanedContent)}`);
      return;
    }

    let chance = replyChances.get(userTag) || replyChannel.chance || 6;
    chance += 1;
    replyChances.set(userTag, chance);

    replyChannel.chance = chance;
    settings.replyChannels = replyChannels;
    fs.writeFileSync(path.join(__dirname, '..', '..', '..', 'data', serverName, 'settings.json'), JSON.stringify(settings, null, 2));

    output.message(`${colors.green(`${chance}%`)} - ${colors.cyan(serverName)} - ${colors.cyan(`#${channelName}`)} - ${colors.cyan(userTag)}: ${colors.white(cleanedContent)}`);

    if (Math.random() * 100 < chance) {
      replyChances.set(userTag, 6);

      await replyToUser(message, userTag);
    }

    if (attachments.size > 0) {
      const downloadPath = path.join(__dirname, '..', '..', '..', 'logs', 'media');

      if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath);
      }

      for (const [key, attachment] of attachments.entries()) {
        const timestamp = new Date().getTime();
        const attachmentPath = path.join(downloadPath, `${userTag}_${channelName}_${serverName}_${timestamp}_${attachment.name}`);

        const fileStream = fs.createWriteStream(attachmentPath);

        https.get(attachment.url, (response) => {
          response.pipe(fileStream);

          fileStream.on('finish', () => {
            fileStream.close();
            output.debug(`Attachment was downloaded to ${attachmentPath}`);
          });
        });
      }
    }

  } catch (error) {
    output.error(`Error handling messageCreate: ${error.message}`);
  }
};