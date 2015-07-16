var utils = require('../../utils');
var harvest = require('../../api/harvest')();
var tp = require('../../api/tp')();

function pauseAndLog(e, done) {
    if(e.running) {
        utils.log('Stopping timer on harvest...');
        harvest.TimeTracking.toggleTimer({ id: e.id }, function (err) {
            if(err) return utils.log.err(err);
            utils.log('Done.');
            logTime(e, done);
        });
    }
    else {
        logTime(e, done);
    }
}

function logTime(e, done) {
    if(!e.tp_task || !e.tp_task.id) return done();

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
            done();
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
            if(!e) return utils.log.err('No timer could be found.');
            if(e.finished) return utils.log.err('Your last task is already marked as finished.');
            utils.log('//TODO: print entry');

            pauseAndLog(e, function () {
                utils.log('Marking time as finished on harvest...');
                var model = {
                    id: e.id,
                    notes: e.notes + '\n' + harvest.prefixes.finishedPrefix
                };
                harvest.TimeTracking.update(model, function (err) {
                    if(err) return utils.log.err(err);
                    utils.log('Done.');
                });
            });
        });
    }
};
