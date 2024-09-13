const { presenceUpdate, Error } = require('../../utils/logging');

const fs = require('fs');
const path = require('path');
const lastStatus = new Map();

function activitiesAreEqual(oldActivities, newActivities) {
    if (!oldActivities || !newActivities || oldActivities.length !== newActivities.length) {
        return false;
    }

    for (let i = 0; i < oldActivities.length; i++) {
        const oldActivity = oldActivities[i];
        const newActivity = newActivities[i];

        if (oldActivity.type !== newActivity.type ||
            oldActivity.name !== newActivity.name ||
            oldActivity.details !== newActivity.details ||
            oldActivity.state !== newActivity.state) {
            return false;
        }
    }

    return true;
}

module.exports = {
    name: 'presenceUpdate',
    async execute(oldPresence, newPresence) {
        try {
            if (newPresence.user.bot) return;

            const username = newPresence.user.username.replace(/[^a-zA-Z0-9_-]/g, '');
            const userDir = path.join(__dirname, `../../data/users/${username}`);
            const userJsonPath = path.join(userDir, 'user.json');
            let userInfo = {};

            if (!fs.existsSync(userDir)) {
                fs.mkdirSync(userDir, { recursive: true });
            }

            if (fs.existsSync(userJsonPath)) {
                userInfo = JSON.parse(fs.readFileSync(userJsonPath, 'utf8'));
            } else {
                userInfo = {
                    username: newPresence.user.username,
                    status: newPresence.status,
                    activities: []
                };
            }

            const oldStatus = oldPresence ? oldPresence.status : undefined;
            const newStatus = newPresence.status;
            const oldActivity = oldPresence ? oldPresence.activities : undefined;
            const newActivity = newPresence ? newPresence.activities : undefined;

            if (oldStatus !== newStatus) {
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

                if (!lastStatus.has(username) || lastStatus.get(username) !== newStatus) {
                    presenceUpdate(`${presenceDetails} ${username.grey}`);
                    lastStatus.set(username, newStatus);
                }

                userInfo.status = newStatus;
            }

            if (!activitiesAreEqual(oldActivity, newActivity)) {
                if (newActivity && newActivity.length > 0) {
                    let activityName = '';
                    let activityDetails = '';
                    let activityState = '';

                    for (const activity of newActivity) {
                        if (activity.type !== 4) {
                            if (activity.name) {
                                activityName = `- ${activity.name} `;
                            }
                            
                            if (activity.details) {
                                activityDetails = `- ${activity.details} `;
                            }

                            if (activity.state) {
                                activityState = `- ${activity.state}`;
                            }

                            break;
                        } else {
                            activityState = `- ${activity.state}`;
                        }
                    }

                    const activityText = `${activityName}${activityDetails}${activityState}`.trim();

                    if (activityText && (!lastStatus.has(username) || lastStatus.get(username) !== activityText)) {
                        presenceUpdate(`${username} ${activityText}`);
                        lastStatus.set(username, activityText);
                    }

                    userInfo.activities = newActivity.map(act => ({
                        name: act.name,
                        type: act.type,
                        details: act.details,
                        state: act.state
                    }));
                }
            }

            fs.writeFileSync(userJsonPath, JSON.stringify(userInfo, null, 2));

        } catch (error) {
            Error(`Error executing ${module.exports.name}: ${error.message}`);
        }
    }
};