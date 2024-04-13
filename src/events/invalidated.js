const { invalidated } = require('../../utils/logging');

module.exports = {
    name: 'invalidated',
    execute() {
        invalidated('Session invalidated');
    }
};