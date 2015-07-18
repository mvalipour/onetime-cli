var Configstore = require('configstore');
var pkg = require('../package.json');
var utils = require('./utils');
var fs = require('fs');

var store = new Configstore(pkg.name);

var appdata = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : '/var/local');
appdata += '/' + pkg.name;

if (!fs.existsSync(appdata)){
    fs.mkdirSync(appdata);
}

module.exports = {
    appdata: appdata,
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
    isInitialized: store.get('_initialized')
};
