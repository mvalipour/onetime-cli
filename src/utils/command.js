var utils = require('./');
var config = require('../config');

function notFound(m) {
    utils.log.err('Could not find command `'+m+'`');
}

function loadModule(name, path) {
    var basePath = '../commands/' + (path.length ? path.join('/') + '/' : '') + name;
    return require(basePath);
}

function load(path, name, noConfig, loadFn) {
    try {
        if(noConfig) {
            config.ensure();
        }
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

            var m = load(path, name, e.noConfig, loadFn);
            if(!m) return notFound(name);

            return m;
        }
    };
}

module.exports = {
    dispatch: dispatch
};
