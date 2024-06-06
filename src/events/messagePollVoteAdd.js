const { messagePollVoteAdd } = require('../../utils/logging');

module.exports = {
    name: 'messagePollVoteAdd',
    async execute(pollAnswer, userId) {
        const pollQuestion = pollAnswer.poll.question;
        const pollText = pollAnswer.text;
        const voteCount = pollAnswer.voteCount;

        messagePollVoteRemove(`${(userId).cyan} added their vote ${(pollText).cyan} to the poll ${(pollQuestion).cyan}, now with ${(voteCount).cyan} votes`);
    }
};