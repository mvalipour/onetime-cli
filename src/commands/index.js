var cli = require('dastoor').builder;

require('./config');

module.exports = cli.command('onetime')
.withHelp({
    description: 'manage harvest and target-proess in one place',
});
