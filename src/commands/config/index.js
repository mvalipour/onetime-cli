var cli = require('dastoor').builder;

require('./show');
require('./clear');

module.exports = cli.command('onetime.config')
.withHelp({
    description: 'manage onetime configuration',
});
