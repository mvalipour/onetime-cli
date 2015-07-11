function bracetize(v) {
    while(v.length < 12) v += ' ';
    return '['+v.substring(0, 12)+']';
}

var log = console.log;
log.err = function () {
    var args = ['[ERR!]'].concat(Array.prototype.slice.call(arguments));
    console.log.apply(this, args);
};

module.exports = {
    log: console.log,
    bracetize: bracetize
};
