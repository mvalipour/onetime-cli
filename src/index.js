#! /usr/bin/env node
require('./utils/_ext');
require('console.table');
var updateNotifier = require('update-notifier');

var utils = require('./utils');
var config = require('./config');
var Runner = require('dastoor').Runner;

var args = process.argv.splice(2);
var app = require('./commands');

updateNotifier({pkg: require('../package.json')}).notify();

function ensureConfig(module, path) {
    if(config.isInitialized) return;

    if(!module.terminal) return;
    if(path.isEqualTo(['init', 'harvest'])) return;

    utils.log();
    utils.log.err('onetime is not initialized.');
    utils.log();
    utils.log('please run:');
    utils.log.chalk('green','    onetime init harvest');
    utils.log();
    utils.log('also optionally run:');
    utils.log.chalk('green','    onetime init tp');
    utils.log();
    process.exit(0);
}

var runner = new Runner({
    localArgs: config.locals
});
runner.onModuleLoad(ensureConfig);
runner.run(app, args);
