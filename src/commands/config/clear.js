module.exports = {
    $t: true,
    help: {
        description: 'clear all onetime configurations'
    },
    _: function () {
        var inquirer = require('inquirer');
        var utils = require('../../utils');
        var config = require('../../config');

        utils.log();
        utils.log('    [IMPORTANT]');
        utils.log('    Doing this will clear all of your saved password from onetime.');
        utils.log();
        var q = {
            type: 'confirm',
            name: 'sure',
            message: 'Are you sure you want to clear onetime config?'
        };
        inquirer.prompt(q, function (d) {
            if(!d.sure) return;

            config.clear();
        });
    }
};
