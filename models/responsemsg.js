//response messages for errors
var messages = function() {};

messages.prototype.USER_NOT_FOUND = 100;
messages.prototype.INVALID_PASSWORD = 101;
messages.prototype.DATABASE_ERROR = 102;
messages.prototype.EMAIL_EXISTS = 103;
messages.prototype.USER_CREATION_FAILED = 104;
messages.prototype.PASSWORD_RESET_EXPIRED = 105;
messages.prototype.PASSWORD_RESET_EMAIL_MISMATCH = 106;
messages.prototype.PASSWORD_RESET_HASH_MISMATCH = 107;
messages.prototype.PASSWORD_RESET_FAILED = 108;

module.exports = messages;