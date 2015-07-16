var utils = require('../../utils');
var harvest = require('../../api/harvest')();
var tp = require('../../api/tp')();

function pauseAndLog(e) {
    if(e.running) {
        utils.log('Stopping timer on harvest...');
        harvest.TimeTracking.toggleTimer({ id: e.id }, function (err) {
            if(err) return utils.log.err(err);
            utils.log('Your timer has stopped on harvest.');
            logTime(e);
        });
    }
    else {
        logTime(e);
    }
}

function logTime(e) {
    if(!e.tp_task || !e.tp_task.id) return;

    utils.log('Logging time on target process...');

    var tpdata = {
        description: e.notes || '-',
        spent: e.hours,
        remain: 0,// -- todo: capture from user
        date: new Date(e.created_at).toJSON()
    };
    tp.addTime(e.tp_task.id, tpdata)
        .then(function (a) {
            utils.log(tpdata.spent + 'h is logged on target process against task #' + e.tp_task.id);
        }, function (err) {
            utils.log.err(err);
        });
}

module.exports = {
    $t: true,
    _: function (t) {
        if(!tp){
            return utils.log.err('this command is only available if target process is configured.');
        }

        harvest.TimeTracking.daily({}, function (err, d) {
            if(err) return utils.log(err);
            var e = d.day_entries.sortByDesc('updated_at')[0];
            if(!e) return utils.log.chalk('red', 'No timer could be found.');
            utils.log('//TODO: print entry');

            pauseAndLog(e);
        });
    }
};
