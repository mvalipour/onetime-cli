#! /usr/bin/env node
require('./utils/_ext');

var minimist = require('minimist');
var utils = require('./utils');
var config = require('./config');

var args = process.argv.splice(2);
var e, entry = require('./commands');
var path = [];

while(args.length){
    e = args[0];
    if(e === '--help' || e === '-h') return help(path, entry);
    entry = entry.get(path, e);
    if(!entry) break;
    if(entry.$t) break;

    path.push(e);
    args = args.splice(1);
}

function help(path, e) {
    var helpOption = {
        name: '-h, --help',
        description: 'show this help'
    };

    var h = e.help;
    var names = e.all;
    var usage = h && h.usage;
    var options = ((h && h.options) || []).concat(helpOption);
    utils.log();
    if(h && h.description){
        utils.log('    ' + h.description);
        utils.log();
    }

    if(options){
        utils.log('    Options:');
        options.forEach(function (o) {
            utils.log('      ' + utils.pad(o.name, 20), o.description);
        });
        utils.log();
    }

    if(usage || names){
        utils.log('    Usage:');
        if(usage){
            usage.forEach(function (u) {
                utils.log('      ' + u);
            });
        }

        if(names){
            names.forEach(function (n) {
                var p = (path.length ? path.join(' ') + ' ' : '') + n;
                var h = entry.get(path, n).help || {};
                utils.log('      onetime ' + utils.pad(p, 20), h.description || '');
            });
            utils.log();
        }
    }
}

if(args.length === 0){
    help(path, entry);
}
else if(entry){
    var hasHelp = args.filter(function (a) {
        return a === '--help' || a === '-h';
    });
    var action = entry._;

    if(hasHelp.length || !action) return help(path, entry);
    action.call(entry, minimist(args.splice(1)));
}
