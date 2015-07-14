var jsonfile = require('jsonfile');
var utils = require('../../../utils');
var config = require('../../../config');
var fs = require('fs');

var filename = config.appdata + '/alias.json';

function _read(done) {
    fs.exists(filename, function(exists) {
        if (!exists) {
            done({});
        }
        else {
            jsonfile.readFile(filename, function (err, data) {
                if(err) {
                    return utils.log.err(err);
                }
                done(data);
            });
        }
    });
}

function _write(data, done) {
    jsonfile.writeFile(filename, data, function (err) {
        if(err) {
            return utils.log.err(err);
        }
        done();
    });
}

function _change(action, done) {
    _read(function (data) {
        action(data);
        _write(data, done);
    });
}

function list(done) {
    _read(done);
}

function get(name, done) {
    _read(function (data) {
        var a = data[name];
        if(!a) {
            return utils.log.err('Alias `'+name+'` doesnot exist.');
        }

        done(a);
    });
}

function add(name, opts, done) {
    _change(function (data) {
        if(!!data[name]) {
            done('Alias `'+name+'` already exists.');
        }

        data[name] = opts;

    }, done);
}

function remove(name, done) {
    _change(function (data) {
        if(!data[name]) {
            done('Alias `'+name+'` doesnot exist.');
        }

        delete data[name];

    }, done);
}

module.exports = {
    add: add,
    list: list,
    get: get,
    remove: remove
};
