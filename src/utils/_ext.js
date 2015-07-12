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
