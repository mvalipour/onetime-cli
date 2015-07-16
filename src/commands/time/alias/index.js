var command = require('../../../utils/command');

module.exports = command.dispatch([
    'list',
    'add',
    'remove'
], {
    help: {
        description: 'manage your timesheet aliases',
    }
});
