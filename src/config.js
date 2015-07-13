var Configstore = require('configstore');
var pkg = require('../package.json');
var utils = require('./utils');

var store = new Configstore(pkg.name);

module.exports = {
    get: function (k) {
        return store.get(k);
    },
    set: function (k, v) {
        return store.set(k, v);
    },
    readDomain: function (d, props) {
        var res = {};
        for (var i = 0; i < props.length; i++) {
            var p = props[i];
            var v = store.get(d + '_' + p);
            if(v) res[p] = v;
            else return null;
        }

        return res;
    },
    clear: function () {
        store.clear();
    },
    ensure: function () {
        if(!store.get('_initialized')){
            utils.log('onetime is not initialized.');
            utils.log('please run:');
            utils.log();
            utils.log('    onetime init harvest');
            utils.log();
            utils.log('also optionally run:');
            utils.log();
            utils.log('    onetime init tp');
            utils.log();
            process.exit(0);
        }
    }
};
