var command = require('../utils/command');
module.exports = command.dispatch([
    'harvest',
    'tp'
], {
    help: {
        description: 'initialize onetime',
    }
}, function (m) {
    var inquirer = require('inquirer');
    var utils = require('../utils');
    var config = require('../config');

    function required(i) {
        return !!i;
    }

    function buildFields(d) {
        return [
            {
                name: 'domain',
                message: 'Your '+d+' domain:',
                validate: required
            },
            {
                name: 'email',
                message: 'Your '+d+' email:',
                validate: required
            },
            {
                type: 'password',
                name: 'password',
                message: 'Your '+d+' password:',
                validate: required
            }
        ];
    }

    function prompt(d, done) {
        inquirer.prompt(buildFields(d), done);
    }

    function store(d, res) {
        config.set(d + '_domain', res.domain);
        config.set(d + '_email', res.email);
        config.set(d + '_password', res.password);
    }


    var apps = {
        harvest: {
            _: function () {
                prompt('Harvest', function (opts) {
                    store('harvest', opts);
                    config.set('_initialized', true);
                    utils.log('harvest is configured successfully.');
                });
            },
            help: {
                description: 'initialize harvest'
            }
        },
        tp: {
            _: function () {
                prompt('Target Process', function (opts) {
                    store('tp', opts);
                    utils.log('target process is configured successfully.');
                });
            },
            help: {
                description: 'initialize target process'
            }
        }
    };

    var a = apps[m];
    if(!a) return null;

    a.$t = true;
    return a;
});
