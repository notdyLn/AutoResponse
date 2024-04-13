const { autoModerationRuleCreate } = require('../../utils/logging');

module.exports = {
    name: 'autoModerationRuleCreate',
    execute(rule) {
        autoModerationRuleCreate(`Auto moderation rule created: ${rule}`);
    }
};