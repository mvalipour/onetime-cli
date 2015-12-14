var pkg = require('../package.json');
var fs = require('fs');
var moment = require('moment');
var config = require('./config');
var jsonfile = require('jsonfile');
var rimraf = require('rimraf');

var dir = config.appdata + '/_cache';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

var opts = config.readDomain('caching');
var cacheTime = +opts['expiry-hours'] || 0;

function _getPath(key) {
  return dir + '/' + key + '.json';
}

function get(key) {
  var path = _getPath(key);
  if(fs.existsSync(path)) {
    var e = jsonfile.readFileSync(path);
    if(e.expires && moment(e.expires).isAfter()) {
      return e.data;
    }
  }
}

function set(key, data) {
  var path = _getPath(key);
  jsonfile.writeFileSync(path, {
    expires: moment().add(cacheTime, 'hour'),
    data: data
  });
}

function clear(cb) {
  rimraf(dir, cb);
}

function apply(fn, key) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    if(!cacheTime) {
      return fn.apply(this, args);
    }

    var cb = args[args.length - 1];
    var cached = get(key);
    if(typeof cached !== 'undefined') {
      return cb(null, cached);
    }

    args[args.length - 1] = function (err, d) {
      if(err) return cb(err);
      set(key, d);
      return cb(null, d);
    };
    fn.apply(this, args);
  };
}

module.exports = {
  get: get,
  set: set,
  clear: clear,
  apply: apply
};
