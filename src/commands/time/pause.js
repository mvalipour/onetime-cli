function controller(t) {
    var utils = require('../../utils');
    var harvest = require('../../api/harvest')();

    harvest.TimeTracking.daily({}, function (err, d) {
        if(err) utils.log(err);
        var e = d.day_entries.filter(function (i) {
            return !!i.timer_started_at;
        })[0];
        if(!e) return utils.log.err('No running timer could be found.');
        harvest.TimeTracking.toggleTimer({ id: e.id }, function (err) {
            if(err) return utils.log.err(err);
            utils.log.succ('Your timer is paused.');
        });
    });
}

require('dastoor').builder
.node('onetime.time.pause', {
    terminal: true,
    controller: controller,
    help: 'pause a timesheet'
});
