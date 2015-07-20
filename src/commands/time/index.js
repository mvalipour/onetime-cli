var command = require('../../utils/command');

module.exports = command.dispatch([
    'list',
    'start',
    'pause',
    'resume',
    'finish',
    'restart',

    'alias'
], {
    help: {
        description: 'manage your timesheet',
    }
});
