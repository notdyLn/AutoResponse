const { applicationCommandPermissionsUpdate } = require('../../utils/logging');

module.exports = {
    name: 'applicationCommandPermissionsUpdate',
    execute(command, oldPermissions, newPermissions) {
        const commandName = command.name;
        const changes = [];

        if (JSON.stringify(oldPermissions) !== JSON.stringify(newPermissions)) {
            changes.push(`Permissions for command '${commandName}' have been updated.`);
        }

        if (changes.length > 0) {
            applicationCommandPermissionsUpdate(`${changes.join(', ')}`);
        }
    }
};