const { autoModerationActionExecution } = require('../../utils/logging');

module.exports = {
    name: 'autoModerationActionExecution',
    execute(actionType, user, reason) {
        autoModerationActionExecution(`Action '${actionType}' executed for user ${user} with reason: ${reason}`);
    }
};