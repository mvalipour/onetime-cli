var command = require('../utils/command');
var utils = require('../utils');
var config = require('../config');

module.exports = command.setup(function (m) {
    if(m !== 'init' && !config.get('_initialized')){
        utils.log('onetime is not initialized.');
        utils.log('please run:');
        utils.log();
        utils.log('    onetime init');
        utils.log();
        process.exit(0);
    }

    return require('./' + m);
});
