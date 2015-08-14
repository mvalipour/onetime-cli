var jsonfile = require('jsonfile');
var utils = require('../utils');
var config = require('../config');
var fs = require('fs');

var filename = config.appdata + '/map.json';

function _read(done) {
    fs.exists(filename, function(exists) {
        if (!exists) {
            done(null, {});
        }
        else {
            jsonfile.readFile(filename, done);
        }
    });
}

function _write(data, done) {
    jsonfile.writeFile(filename, data, done);
}

function _change(action, done) {
    _read(function (err, data) {
        if(err) return done(err);

        action(data);
        _write(data, done);
    });
}

function list(done) {
    _read(done);
}

function get(name, done) {
    _read(function (err, data) {
        if(err) return done(err);

        var a = data[name];
        done(null, a);
    });
}

function exists(name, done) {
    _read(function (err, data) {
        if(err) return done(err);

        var a = data[name];
        done(null, !!a);
    });
}

function add(name, opts, done) {
    _change(function (data) {
        data[name] = opts;
    }, done);
}

function remove(name, done) {
    _change(function (data) {
        delete data[name];
    }, done);
}

module.exports = {
    add: add,
    list: list,
    get: get,
    exists: exists,
    remove: remove
};
