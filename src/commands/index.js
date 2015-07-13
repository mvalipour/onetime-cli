var command = require('../utils/command');
var utils = require('../utils');
var config = require('../config');

module.exports = command.setup(function (m) {

    if(m !== 'init') {
        config.ensure();
    }

    return require('./' + m);
});
