var inquirer = require('inquirer');
var base = require('../_base');
var utils = require('../../../utils');
var store = require('./_store');

module.exports = {
    $t: true,
    _: function (args) {
        var name = args._[0];
        var questions = [{
            name: 'name',
            message: 'Choose a name:',
            validate: base.validation.identifier(true),
            when: !name
        }];

        inquirer.prompt(questions, function (data) {
            name = name || data.name;

            store.exists(name, function (err, e) {
                if(err) return utils.log.err(err);
                if(e) return utils.log.err('Alias `'+name+'` already exists.');

                base.captureNewTime(args, null, function (res) {
                    store.add(name, res, function (err) {
                        if(err) return utils.log.err(err);
                    });
                });
            });
        });
    }
};
