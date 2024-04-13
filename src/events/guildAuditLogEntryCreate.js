const { guildAuditLogEntryCreate } = require('../../utils/logging');

module.exports = {
    name: 'guildAuditLogEntryCreate',
    execute(auditLogEntry) {
        guildAuditLogEntryCreate(`Audit log entry created: ${auditLogEntry}`);
    }
};