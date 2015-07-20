module.exports = {
    $t: true,
    help: {
        description: 'finish a timesheet',
        options: [{
            name: '-d, --date',
            description: 'date of the timesheet. e.g. 2015-07-01'
        },
        {
            name: '-o, --offfset',
            description: 'date offset relative to today. e.g. 1 for yesterday'
        }, {
            name: '--all',
            description: 'finished all unfinished times'
        }]
    },
    _: function (t) {
        var utils = require('../../utils');
        var harvest = require('../../api/harvest')();
        var tp = require('../../api/tp')();
        var base = require('./_base');

        function pauseAndLog(e, done) {
            if(e.running) {
                utils.log('    Stopping timer on harvest...');
                harvest.TimeTracking.toggleTimer({ id: e.id }, function (err) {
                    if(err) return utils.log.err(err);
                    utils.log('    Done.');
                    logTime(e, done);
                });
            }
            else {
                utils.log('    Time is already stopped.')
                logTime(e, done);
            }
        }

        function logTime(e, done) {
            if(!tp || !e.tp_task || !e.tp_task.id || !e.hours) return done();

            utils.log('    Logging time on target process...');

            var tpdata = {
                description: e.notes || '-',
                spent: e.hours,
                remain: 0,// -- todo: capture from user
                date: new Date(e.created_at).toJSON()
            };
            tp.addTime(e.tp_task.id, tpdata)
                .then(function (a) {
                    utils.log('    ' + tpdata.spent + 'h is logged on target process against task #' + e.tp_task.id);
                    done();
                }, function (err) {
                    utils.log.err(err);
                });
        }

        function finish(e, done) {
            if(!e) return utils.log.err('No timer could be found.');
            if(e.finished) return utils.log.err('This time is already marked as finished.');

            utils.log('finishing time:', e.id);
            pauseAndLog(e, function () {
                if(!e.tp_task) {
                    utils.log('    Time is not associated with a target-process task.')
                    return done();
                }

                utils.log('    Marking time as finished on harvest...');
                var model = {
                    id: e.id,
                    notes: e.full_notes + '\n' + harvest.prefixes.finishedPrefix
                };
                harvest.TimeTracking.update(model, function (err) {
                    if(err) return utils.log.err(err);
                    utils.log('    Done.');
                    done();
                });
            });
        }

        function finishAll(list) {
            var item = list.pop();
            if(!item) return;
            finish(item, function () {
                finishAll(list);
            });
        }

        var d = t.d || t.date;
        var offset = +(t.o || t.offset);
        if (!d && offset) d = new Date().addDays(-offset);
        base.selectTime(d, function (i) {
            return !i.finished;
        }, function (selection) {
            if(!selection){
                utils.log();
                utils.log.chalk('gray', 'no unfinished time could be found.');
                utils.log();
                return;
            }

            finishAll(selection);
        }, t.all);
    }
};
