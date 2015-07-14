var inquirer = require('inquirer');
var base = require('../_base');
var utils = require('../../../utils');
var store = require('./_store');

module.exports = {
    $t: true,
    _: function (args) {
        store.list(function (data) {
            utils.log();
            for (var n in data) {
                utils.log('    ' + n);
            }
            utils.log();
        });
    }
};
