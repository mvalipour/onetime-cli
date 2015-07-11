#! /usr/bin/env node
var minimist = require('minimist');
var utils = require('./utils');
var config = require('./utils/config');

var commands = require('./commands');

var args = process.argv.splice(2);
var e, entry = commands;
while(args.length){
    e = args[0];
    entry = entry.get(e);
    if(!entry) break;
    if(entry.$t) break;

    args = args.splice(1);
}

if(entry){
    var action = entry._;
    if(!action) return utils.log.err('Could not find command `'+e+'`');
    action.call(entry, minimist(args.splice(1)));
}
else{
    // todo: help
}
