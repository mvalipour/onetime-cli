var minimist = require('minimist');
var extend = require('extend');
var config = require('../config');



function pad(v, l) {
    v = v || '';
    while(v.length < l) v += ' ';
    return v;
}

function notFound(m) {
    options.errorLog('Could not find command `'+m+'`');
}

function loadModule(name, path) {
    var basePath = options.path + (path.length ? path.join('/') + '/' : '') + name;
    return require(basePath);
}

function load(path, name, loadFn) {
    try {
        loadFn = loadFn || loadModule;
        return loadFn(name, path);
    }
    catch (e) {
        console.log(e);
        if (e instanceof Error && e.code === "MODULE_NOT_FOUND")
            return null;
        else throw e;
    }
}

function dispatch(modules, opts, loadFn) {

    var allNames = modules.map(function (m) {
        if(!m) return '';
        if(typeof m === 'string') return m;
        return m.name;
    });

    return {
        help: opts && opts.help,
        all: allNames,
        get: function (path, name) {
            var e = modules.filter(function (m) {
                return m === name || m.name === name;
            })[0];

            if(!e) return notFound(name);

            var m = load(path, name, loadFn);
            if(!m) return notFound(name);

            return m;
        }
    };
}

var onStartingRegistrar = [];
function onStarting(f) {
    onStartingRegistrar.push(f);
}

function start(entry, args) {
    var e,
        path = [];

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
        options.log();
        if(h && h.description){
            options.log('green', '    ' + h.description);
            options.log();
        }

        if(options){
            options.log('green', '    Options:');
            options.forEach(function (o) {
                options.log('green', '      ' + pad(o.name, 20), o.description);
            });
            options.log();
        }

        if(usage || names){
            options.log('green', '    Usage:');
            if(usage){
                usage.forEach(function (u) {
                    options.log('green', '      ' + u);
                });
            }

            if(names){
                names.forEach(function (n) {
                    var p = (path.length ? path.join(' ') + ' ' : '') + n;
                    var h = entry.get(path, n).help || {};
                    options.log('green', '      onetime ' + pad(p, 20), h.description || '');
                });
                options.log();
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

        path.push(e);
        onStartingRegistrar.forEach(function (f) {
            f.call(entry, path, entry);
        });

        var inputArgs = minimist(args.splice(1));
        extend(inputArgs, config.locals);
        action.call(entry, inputArgs);
    }
}

module.exports = {
    dispatch: dispatch,
    onStarting: onStarting,
    start: start
};
