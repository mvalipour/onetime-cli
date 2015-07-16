var command = require('../utils/command');
var utils = require('../utils');
var config = require('../config');

module.exports = command.dispatch([
    { name: 'init', noConfig: true },
    'time'
], {
    help: {
        description: 'manage harvest and target-proess in one place',
    }
});
