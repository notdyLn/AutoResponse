const colors = require('colors');
const output = require('../../console/output');
const fs = require('fs');
const path = require('path');

module.exports = async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, user } = interaction;

    const messageContent = interaction.options
        ? interaction.options.data.map(option => `${colors.magenta(`${option.name}:`)} ${option.value}`).join(', ')
        : '';
    
    output.interaction(`${colors.cyan(`#${interaction.channel.name}`)} - ${colors.cyan(`${user.tag}`)}: ${colors.white(`/${commandName} ${messageContent}`)}`);

    try {
        const commandCategories = ['Public', 'Admin', 'Owner'];
        let executed = false;

        for (const category of commandCategories) {
            const commandPath = path.join(__dirname, '..', '..', '..', 'commands', category, `${commandName}.js`);
            
            if (fs.existsSync(commandPath)) {
                const command = require(commandPath);
                await command.execute(interaction);
                executed = true;
                break;
            }
        }
    } catch (error) {
        output.error(`Error handling interactionCreate: ${error.message}`);
    }
};
