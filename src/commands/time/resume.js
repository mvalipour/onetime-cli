function controller(t) {
    var utils = require('../../utils');
    var harvest = require('../../api/harvest')();
    var base = require('./_base');
    var aliasStore = require('./alias/_store');

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

    function action(alias, autoSelectSingle) {
        base.selectTime(null, function (i) {
            if(i.running) return false;
            if(!alias) return true;
            if(alias.project !== +i.project_id) return false;
            if(alias.task !== +i.task_id) return false;

            return true;
        }, function (selection) {
            pause(selection[0]);
        }, false, autoSelectSingle);
    }

    var alias = t.a || t.alias;
    if(alias){
        aliasStore.get(alias, function (err, data) {
            if(err) return utils.log.err(err);
            action(data, true);
        });
    }
    else action();
}

require('dastoor').builder
.node('onetime.time.resume', {
    terminal: true,
    controller: controller
})
.help({
    description: 'continue a timesheet',
    options: [{
        name: '-a, --alias',
        description: 'alias name of the time to resume'
    }]
});
