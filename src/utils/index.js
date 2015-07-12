var chalk = require('chalk');

function bracetize(v) {
    while(v.length < 12) v += ' ';
    return '['+v.substring(0, 12)+']';
}

var log = console.log;
log.err = function () {
    var args = [chalk.red('[ERR!]')].concat(Array.prototype.slice.call(arguments));
    console.log.apply(this, args);
};

log.chalk = function (c) {
    var args = Array.prototype.slice.call(arguments).splice(1);
    console.log.call(this, chalk[c](args.join(' ')));
};

module.exports = {
    log: log,
    bracetize: bracetize
};
