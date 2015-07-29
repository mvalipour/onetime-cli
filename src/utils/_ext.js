var utils = require('./');

Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};

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

Array.prototype.select = function (fields) {
    return this.map(function (i) {
        var res = {};
        fields.forEach(function (f) {
            res[f] = i[f];
        });
        return res;
    });
};

Function.prototype.rebind = function (n) {
    var me = this;

    return function () {
        var res = me.apply();
        var f = res && res[n];
        if(typeof f !== 'function') throw 'routed property was not a function.';
        f.apply(null, arguments);
    };
};
