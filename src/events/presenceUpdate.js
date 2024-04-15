const { presenceUpdate, Error, Info } = require('../../utils/logging');

const lastStatus = new Map();

module.exports = {
    name: 'presenceUpdate',
    execute(oldPresence, newPresence) {
        const userId = newPresence.userID;
        const oldStatus = oldPresence ? oldPresence.status : undefined;
        const newStatus = newPresence.status;

        const oldActivity = oldPresence ? oldPresence.activities : undefined;
        const newActivity = newPresence ? newPresence.activities : undefined;

        if (oldStatus !== newStatus) {
            const user = newPresence.user.username;

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
        } else if (JSON.stringify(oldActivity) !== JSON.stringify(newActivity)) {
            const user = newPresence.user.username;

            if (newActivity && newActivity.length > 0) {
                let primaryActivityName = '';
                for (const activity of newActivity) {
                    if (activity.type === 4) {
                        primaryActivityName = activity.state;
                        break;
                    } else {
                        primaryActivityName = activity.name;
                        break;
                    }
                }

                if (!lastStatus.has(userId) || lastStatus.get(userId) !== primaryActivityName) {
                    presenceUpdate(`${user} - ${primaryActivityName}`);

                    lastStatus.set(userId, primaryActivityName);
                } 
            }
        }
    }
};