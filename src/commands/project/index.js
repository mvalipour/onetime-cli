var command = require('../../utils/command');

module.exports = command.dispatch([
    'list'
], {
    help: {
        description: 'harvest projects',
    }
});
