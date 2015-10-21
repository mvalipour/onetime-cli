var Configstore = require('configstore');
var pkg = require('../package.json');
var utils = require('./utils');
var fs = require('fs');
var jsonfile = require('jsonfile');

var localFilename = process.env.PWD + '/.onetime';
var locals = fs.existsSync(localFilename) && jsonfile.readFileSync(localFilename);
locals = locals || {};

var store = new Configstore(pkg.name);

var appdata = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : '/var/local');
appdata += '/' + pkg.name;

if (!fs.existsSync(appdata)){
    fs.mkdirSync(appdata);
}

var properties = {
  harvest: [
    'domain',
    'email',
    { key: 'password', protected: true }
  ],
  tp: [
    'domain',
    'email',
    { key: 'password', protected: true },
    { key: 'bug-time', default: 'both', values: ['none', 'bug', 'user-story', 'both'] }
  ]
};

module.exports = {
    locals: locals,
    appdata: appdata,
    get: function (k) {
        return store.get(k);
    },
    set: function (k, v) {
        return store.set(k, v);
    },
    getKeyOptions: function (d, k) {
      var props = properties[d];
      if(!props) return;

      for (var i = 0; i < props.length; i++) {
        var p = props[i];
        if(p === k) return { key: k };
        if(p.key === k ) return p;
      }
    },
    readDomain: function (d, includeProtected) {
        var res = {};

        var props = properties[d];
        for (var i = 0; i < props.length; i++) {
            var p = props[i];
            var k = typeof p === 'string' ? p : p.key;
            var v = store.get(d + '_' + k) || p.default;
            if(p.protected && !includeProtected) {
              v = '********';
            }

            if(v) res[k] = v;
            else return null;
        }

        return res;
    },
    clear: function () {
        store.clear();
    },
    isInitialized: store.get('_initialized')
};
