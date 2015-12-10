var pkg = require('../package.json');
var fs = require('fs');
var moment = require('moment');
var config = require('./config');
var jsonfile = require('jsonfile');

var dir = config.appdata + '/_cache';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

var opts = config.readDomain('caching');
var cacheTime = +opts['expiry-hours'] || 0;

module.exports = function (fn, key) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    if(!cacheTime) {
      return fn.apply(this, args);
    }

    var cb = args[args.length - 1];
    var path = dir + '/' + key + '.json';
    if(fs.existsSync(path)) {
      var e = jsonfile.readFileSync(path);
      if(e.expires && moment(e.expires).isAfter()) {
        return cb(null, e.data);
      }
    }

    args[args.length - 1] = function (err, d) {
      if(err) return cb(err);
      jsonfile.writeFileSync(path, {
        expires: moment().add(cacheTime, 'hour'),
        data: d
      });
      return cb(null, d);
    };
    fn.apply(this, args);
  };
};
