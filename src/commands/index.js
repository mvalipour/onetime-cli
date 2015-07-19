var command = require('../utils/command');
var utils = require('../utils');
var config = require('../config');

module.exports = command.dispatch([
    'init',
    'time',
    'project',
    'config'
], {
    help: {
        description: 'manage harvest and target-proess in one place',
    }
});
