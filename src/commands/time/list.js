var utils = require('../../utils');
var harvest = require('../../utils/harvest');

module.exports = {
    $t: true,
    _: function (t) {
        var d = t.date ? new Date(t.date) : new Date();
        harvest.get(d, function (err, d) {
            if(err) utils.log(err);
            utils.log('time logs for:', d.for_day);
            var t = 0;
            d.day_entries.forEach(function (i) {
                t += i.hours;
                utils.log('['+i.hours.toFixed(2)+'h]',
                utils.bracetize(i.client),
                utils.bracetize(i.task), i.notes);
            });
            utils.log('['+t.toFixed(2)+'h] total');
        });
    }
};
