var chalk = require('chalk');

function summarize(v, l) {
    if(!v) return v;
    if(v.length <= l) return v;
    return v.substring(0, l - 2) + '..';
}

function pad(v, l) {
    v = v || '';
    while(v.length < l) v += ' ';
    return v;
}

var log = console.log;
log.err = function () {
    var args = [chalk.red('[ERR!]')].concat(Array.prototype.slice.call(arguments));
    console.log.apply(this, args);
};

log.succ = function () {
    var args = Array.prototype.slice.call(arguments);
    console.log.call(this, chalk.green('✓ ' + args.join(' ')));
};

log.chalk = function (c) {
    var args = Array.prototype.slice.call(arguments).splice(1);
    console.log.call(this, chalk[c](args.join(' ')));
};

module.exports = {
    log: log,
    summarize: summarize,
    pad: pad
};
