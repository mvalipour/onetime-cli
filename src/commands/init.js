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
    harvest: function () {
        prompt('Harvest', function (opts) {
            store('harvest', opts);
            config.set('_initialized', true);
            utils.log('harvest is configured successfully.');
        });
    },
    tp: function () {
        prompt('Target Process', function (opts) {
            store('tp', opts);
            utils.log('target process is configured successfully.');
        });
    }
};

var command = require('../utils/command');
module.exports = command.setup(function (m) {
    if(m !== 'harvest') {
        config.ensure();
    }

    var a = apps[m];
    return a ? { $t : true, _: a } : null;
});
