const { SlashCommandBuilder } = require('@discordjs/builders');
const EmbedBuilder = require('../../src/EmbedBuilder/EmbedBuilder');
const output = require('../../src/console/output.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a poll')
        .addStringOption(option =>
            option.setName('topic')
                .setDescription('Topic of poll')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('option1')
                .setDescription('First option for the poll')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('option2')
                .setDescription('Second option for the poll')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('option3')
                .setDescription('Third option for the poll')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('option4')
                .setDescription('Fourth option for the poll')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('option5')
                .setDescription('Fifth option for the poll')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('option6')
                .setDescription('Sixth option for the poll')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('option7')
                .setDescription('Seventh option for the poll')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('option8')
                .setDescription('Eighth option for the poll')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('option9')
                .setDescription('Ninth option for the poll')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('option10')
                .setDescription('Tenth option for the poll')
                .setRequired(false)
        ),
    async execute(interaction) {
        try {
            const topic = interaction.options.getString('topic');
            const optionFields = [];
            const reactionOptions = [];

            for (let i = 1; i <= 10; i++) {
                const optionName = interaction.options.getString(`option${i}`);
                if (optionName) {
                    const numberEmoji = `${i}\u20E3`;
                    optionFields.push({ name: `${numberEmoji} ${optionName}`, value: ' ', inline: false });
                    reactionOptions.push(numberEmoji);
                } else {
                    break;
                }
            }

            const pollEmbed = EmbedBuilder.poll(`AutoResponse - Poll`, topic, optionFields);

            output.debug(`Sending embed...`);
            const replyMessage = await interaction.reply({ embeds: [pollEmbed], fetchReply: true });

            for (const reactionOption of reactionOptions) {
                await replyMessage.react(reactionOption);
            }
        } catch (error) {
            output.error(`Error executing command /poll: ${error.message}`);
            const errorEmbed = EmbedBuilder.error(`AutoResponse - Error`, `${error.message}`);
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};