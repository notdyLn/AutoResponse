const { presenceUpdate, Error } = require('../../utils/logging');

const lastStatus = new Map();

module.exports = {
    name: 'presenceUpdate',
    execute(oldPresence, newPresence) {
        const userId = newPresence.userID;
        const oldStatus = oldPresence ? oldPresence.status : undefined;
        const newStatus = newPresence.status;

        if (oldStatus !== newStatus) {
            const user = newPresence.user.username;

            try {
                let statusSymbol = '⬤';
                let statusColor = '';

                switch (newStatus) {
                    case 'online':
                        statusColor = 'green';
                        break;
                    case 'idle':
                        statusColor = 'yellow';
                        break;
                    case 'dnd':
                        statusColor = 'red';
                        break;
                    case 'offline':
                        statusColor = 'grey';
                        break;
                    default:
                        statusColor = 'white';
                        break;
                }

                let presenceDetails = `${statusSymbol[statusColor]}`;

                if (!lastStatus.has(userId) || lastStatus.get(userId) !== newStatus) {
                    presenceUpdate(`${presenceDetails} ${user}`);

                    lastStatus.set(userId, newStatus);
                }
            } catch (e) {
                Error(`Error fetching ${user}'s status: ${e.message}`);
            }
        }
    }
};