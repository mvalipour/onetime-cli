#! /usr/bin/env node
require('./utils/_ext');
require('console.table');

var utils = require('./utils');
var config = require('./config');
var Runner = require('./dastoor').Runner;

var args = process.argv.splice(2);
var app = require('./commands');

function ensureConfig(path, module) {
    if(config.isInitialized) return;

    if(!module.$t) return;
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
    log: utils.log,
    errorLog: utils.log.err
});
runner.onModuleLoad(ensureConfig);
runner.run(app, args);
