const colors = require('colors');
const output = require('../../console/output');

module.exports = (oldPresence, newPresence) => {
    const member = newPresence.member;

    try {
        if (!member) {
            return;
        }

        const oldStatus = oldPresence ? oldPresence.status : null;
        const newStatus = newPresence ? newPresence.status : null;

        if (oldStatus !== newStatus) {
            const statusColor = getStatusColor(newStatus);
            const statusName = getStatusName(newStatus);

            output.status(`${statusColor(statusName)} ${member.user.tag}`);
        }

    } catch (error) {
        output.error(`Error handling presenceUpdate: ${member.user.tag}: ${error.message}`);
    }
};

function getStatusColor(status) {
    switch (status) {
        case 'online':
            return colors.green;
        case 'idle':
            return colors.yellow;
        case 'dnd':
            return colors.red;
        case 'offline':
            return colors.grey;
        default:
            return colors.gray;
    }
}

function getStatusName(status) {
    switch (status) {
        case 'online':
            return '⬤';
        case 'idle':
            return '⬤';
        case 'dnd':
            return '⬤';
        case 'offline':
            return '⬤';
        default:
            return 'Unknown';
    }
}