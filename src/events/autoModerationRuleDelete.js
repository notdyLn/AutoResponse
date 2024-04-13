const { autoModerationRuleDelete } = require('../../utils/logging');

module.exports = {
    name: 'autoModerationRuleDelete',
    execute(rule) {
        autoModerationRuleDelete(`Auto moderation rule deleted: ${rule}`);
    }
};