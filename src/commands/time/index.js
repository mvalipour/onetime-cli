var command = require('../../utils/command');

module.exports = command.dispatch([
    'list',
    'start',
    'pause',
    'resume',
    'finish',

    'alias'
], {
    help: {
        description: 'manage your timesheet',
    }
});
