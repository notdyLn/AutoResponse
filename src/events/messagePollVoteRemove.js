const { messagePollVoteRemove } = require('../../utils/logging');

module.exports = {
    name: 'messagePollVoteRemove',
    async execute(pollAnswer, userId) {
        const pollQuestion = pollAnswer.poll.question;
        const pollText = pollAnswer.text;
        const voteCount = pollAnswer.voteCount;

        messagePollVoteRemove(`${(userId).cyan} removed their vote ${(pollText).cyan} from the poll ${(pollQuestion).cyan}, now with ${(voteCount).cyan} votes`);
    }
};