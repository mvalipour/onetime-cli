var utils = require('./');

Array.prototype.sortBy = function (f) {
    return this.sort(function (a, b) {
        if (a[f] < b[f])
            return -1;
        if (a[f] > b[f])
            return 1;
        return 0;
    });
};

Array.prototype.sortByDesc = function (f) {
    return this.sort(function (a, b) {
        if (a[f] < b[f])
            return 1;
        if (a[f] > b[f])
            return -1;
        return 0;
    });
};

Array.prototype.isEqualTo = function(b) {
    var a = this;

    if (a === b) return true;
    if (a === null || b === null) return false;
    if (a.length != b.length) return false;

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};

Array.prototype.compact = function() {
    return this.filter(function (i) {
        return !!i;
    });
};

Array.prototype.tabularize = function () {
    var list = this.map(function (i) {
        for(var p in i) i[p] = (i[p] || '').toString();
        return i;
    });

    var len = [];
    list.forEach(function (i) {
        for(var p in i) len[p] = Math.max(len[p] || 0, i[p].length);
    });

    return list.map(function (i) {
        var res = [];
        for(var p in i) res.push(utils.pad(i[p], len[p]));
        return res.join('  ');
    });
};
