var minimist = require('minimist');
var extend = require('extend');
var utils = require('./_utils');

var defaultOptions = {
    log: console.log,
    errorLog: console.log
};

function Runner(options) {
    this.options = extend({}, defaultOptions, options);
    this.onModuleLoadRegistrar = [];
}

Runner.prototype.run = function (root, args) {
    var e,
        path = [],
        entry = root;

    while(args.length){
        e = args[0];
        if(e === '--help' || e === '-h') return this.renderHelp(root, entry);
        entry = entry._getChild(e);
        if(!entry) break;
        if(entry.terminal) break;

        path.push(e);
        args = args.splice(1);
    }

    if(args.length === 0){
        this.renderHelp(root, entry);
    }

    else if(entry){
        var hasHelp = args.filter(function (a) {
            return a === '--help' || a === '-h';
        }).length > 0;
        var action = entry.action;

        if(hasHelp || !action) return this.renderHelp(root, entry);

        path.push(e);
        this.onModuleLoadRegistrar.forEach(function (f) {
            f.call(entry, entry, path);
        });

        var inputArgs = minimist(args.splice(1));
        extend(inputArgs, config.locals);
        action.call(entry, inputArgs);
    }
    else{
        this.options.errorLog('command `'+e+'` not found');
    }
};

Runner.prototype.onModuleLoad = function (f) {
    this.onModuleLoadRegistrar.push(f);
};

Runner.prototype.renderHelp = function (root, command) {
    var helpOption = {
        name: '-h, --help',
        description: 'show this help'
    };

    var log = this.options.log;

    var h = command.help;
    var sub = command.commands;
    var usage = h && h.usage;
    var options = ((h && h.options) || []).concat(helpOption);
    log();
    if(h && h.description){
        log('    ' + h.description);
        log();
    }

    if(options){
        log('    Options:');
        options.forEach(function (o) {
            log('      ' + utils.pad(o.name, 20), o.description);
        });
        log();
    }

    if(usage || sub.length > 0){
        log('    Usage:');
        if(usage){
            usage.forEach(function (u) {
                log('      ' + u);
            });
        }

        if(sub.length > 0){
            names.forEach(function (subcmd) {
                var p = subcmd.replace(/\./g, ' ');
                var h = subcmd.help || {};
                log('      '+root.name+' ' + utils.pad(p, 20), h.description || '');
            });
            log();
        }
    }
};

module.exports = Runner;
