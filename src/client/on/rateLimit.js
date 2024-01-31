const output = require('../../console/output');

module.exports = (rateLimitData) => {
    try {
        output.warn(`Rate Limit Exceeded: ${JSON.stringify(rateLimitData)}`);
    } catch (error) {
        output.error(`Error handling rateLimit: ${error.message}`);
    }
};
