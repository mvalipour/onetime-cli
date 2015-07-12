var utils = require('../../utils');
var harvest = require('../../utils/harvest');

module.exports = {
    $t: true,
    _: function (t) {
        harvest.TimeTracking.daily({}, function (err, d) {
            if(err) utils.log(err);
            var e = d.day_entries.filter(function (i) {
                return !!i.timer_started_at;
            })[0];
            if(!e) return utils.log.chalk('red', 'No running timer could be found.');
            harvest.TimeTracking.toggleTimer({ id: e.id }, function (err) {
                if(err) return utils.log.err(err);
                utils.log('Your timer is paused.');
            });
        });
    }
};
