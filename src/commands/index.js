require('./config');
require('./project');
require('./init');
require('./time');

var cli = require('dastoor').builder;

var onetime = cli.node('onetime', {
    help: 'manage harvest and target-proess in one place'
});

module.exports = onetime;
