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
