function controller(t) {
    var utils = require('../../utils');
    var harvest = require('../../api/harvest')();
    var base = require('./_base');

    function pause(e) {
        if(e.running){
            return utils.log.err('This timer is already running.');
        }

        if(e.tp_task && e.finished){
            return utils.log.err('This timer is associated with a target-process task and is already finalized. consider adding it again.');
        }

        harvest.TimeTracking.toggleTimer({ id: e.id }, function (err) {
            if(err) return utils.log.err(err);
            utils.log('Your timer is running again.');
        });
    }

    base.selectTime(null, function (i) {
        return !i.running;
    }, function (selection) {
        pause(selection[0]);
    });
}

require('dastoor').builder
.terminal('onetime.time.resume', controller)
.help({
    description: 'continue a timesheet'
});
