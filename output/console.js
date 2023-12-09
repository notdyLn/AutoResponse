const logToConsole = (message, type = 'info') => {
    const timestamp = new Date().toLocaleString();
    
    const validTypes = ['info', 'warn', 'error', 'message'];
    if (!validTypes.includes(type)) {
        console.warn(`${timestamp}\t\t[WARN]\t\tInvalid log type specified. Defaulting to 'info'.`);
        type = 'info';
    }

    switch (type) {
        case 'info':
            console.log(`${timestamp}\t\t[INFO]\t\t${message}`);
            break;
        case 'message':
            console.log(`${timestamp}\t\t[MESSAGE]\t${message}`);
            break;
        case 'warn':
            console.warn(`${timestamp}\t\t[WARN]\t\t${message}`);
            break;
        case 'error':
            console.error(`${timestamp}\t\t[ERROR]\t\t${message}`);
            break;
        default:
            console.log(`${timestamp}\t[${type.toUpperCase()}]\t\t${message}`);
            break;
    }
};

module.exports = { logToConsole };