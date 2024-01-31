const colors = require('colors');
const fs = require('fs');
const output = require('../console/output');
const path = require('path');

function getSettings(serverName) {
  try {
    const settingsFilePath = path.join(__dirname, '..', '..', 'data', serverName, 'settings.json');

    if (fs.existsSync(settingsFilePath)) {
      const settingsData = fs.readFileSync(settingsFilePath, 'utf8');
      const parsedSettings = JSON.parse(settingsData);

      parsedSettings.replyChannels = parsedSettings.replyChannels || [];
      parsedSettings.trustedRoles = parsedSettings.trustedRoles || [];
      parsedSettings.phrases = parsedSettings.phrases || [];

      return parsedSettings;
    } else {
      const dataFolderPath = path.join(__dirname, '..', '..', 'data', serverName);
      if (!fs.existsSync(dataFolderPath)) {
        fs.mkdirSync(dataFolderPath);
      }

      const defaultSettings = {
        replyChannels: [],
        trustedRoles: [],
        phrases: [],
      };

      fs.writeFileSync(settingsFilePath, JSON.stringify(defaultSettings, null, 2));

      output.debug(`Settings file created for server ${colors.cyan(serverName)}`);
      return defaultSettings;
    }
  } catch (error) {
    output.error(`Error handling getSettings: ${error.message}`);
    return null;
  }
}

module.exports = getSettings;
