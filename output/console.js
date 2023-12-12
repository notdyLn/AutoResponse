const colors = require('colors');

const logToConsole = (message, type = 'info') => {
    const timestamp = new Date().toLocaleString();

    const validTypes = ['success', 'info', 'warn', 'error', 'message'];
    if (!validTypes.includes(type)) {
        console.warn(`${timestamp}\t\t[WARN]\t\tInvalid log type specified. Defaulting to 'info'.`);
        type = 'info';
    }

    switch (type) {
        case 'success':
            console.log(colors.green(`[${timestamp}]\t\t[${type.toUpperCase()}]\t${message}`));
            break;
        case 'info':
            console.log(colors.gray(`[${timestamp}]\t\t[${type.toUpperCase()}]\t\t${message}`));
            break;
        case 'message':
            console.log(colors.grey(`[${timestamp}]\t\t[${type.toUpperCase()}]\t\t${message}`));
            break;
        case 'warn':
            console.warn(colors.yellow(`[${timestamp}]\t\t[${type.toUpperCase()}]\t\t${message}`));
            break;
        case 'error':
            console.error(colors.red(`[${timestamp}]\t\t[${type.toUpperCase()}]\t\t${message}`));
            break;
        default:
            console.log(colors.gray(`[${timestamp}]\t\t[${type.toUpperCase()}]\t\t${message}`));
            break;
    }
};

module.exports = { logToConsole };