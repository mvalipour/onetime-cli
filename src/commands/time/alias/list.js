function controller(args) {
    var inquirer = require('inquirer');
    var base = require('../_base');
    var utils = require('../../../utils');
    var store = require('./_store');

    store.list(function (err, data) {
        if(err) return utils.log.err(err);

        utils.log();
        for (var n in data) {
            utils.log('    ' + n);
        }
        utils.log();
    });
}

require('dastoor').builder
.terminal('onetime.time.alias.list', controller)
.help({
    description: 'list aliases'
});
