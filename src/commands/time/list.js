var utils = require('../../utils');
var harvest = require('../../utils/harvest');

module.exports = {
    $t: true,
    _: function (t) {
        var opts = {};
        var d = t.d || t.date;
        if(d) opts.date = new Date(d);
        harvest.TimeTracking.daily(opts, function (err, d) {
            if(err) utils.log(err);
            utils.log('time logs for:', d.for_day);
            var t = 0;
            d.day_entries.forEach(function (i) {
                var running = !!i.timer_started_at;
                t += i.hours;
                var chalk = running ? 'green' : 'gray';
                utils.log.chalk(chalk, '['+i.hours.toFixed(2)+'h]',
                utils.bracetize(i.client),
                utils.bracetize(i.task), i.notes);
            });
            utils.log('['+t.toFixed(2)+'h] total');
        });
    }
};
