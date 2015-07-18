var command = require('../../utils/command');

module.exports = command.dispatch([
    'show',
    'clear',
], {
    help: {
        description: 'manage onetime configuration',
    }
});
