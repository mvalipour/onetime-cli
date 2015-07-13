var Configstore = require('configstore');
var pkg = require('../package.json');

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
        props.forEach(function (p) {
            var v = store.get(d + '_' + p);
            if(v) res[p] = v;
        });

        return res;
    },
    clear: function () {
        store.clear();
    }
};
