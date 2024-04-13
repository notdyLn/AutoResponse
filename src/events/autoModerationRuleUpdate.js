const { autoModerationRuleUpdate } = require('../../utils/logging');

module.exports = {
    name: 'autoModerationRuleUpdate',
    execute(oldRule, newRule) {
        const changes = [];

        if (oldRule.name !== newRule.name) {
            changes.push(`Rule name updated: ${oldRule.name} => ${newRule.name}`);
        }

        if (changes.length > 0) {
            autoModerationRuleUpdate(`${changes.join(', ')}`);
        }
    }
};
