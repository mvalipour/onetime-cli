module.exports = {
    $t: true,
    help: {
        description: 'finish a timesheet'
    },
    _: function (t) {
        var utils = require('../../utils');
        var harvest = require('../../api/harvest')();
        var tp = require('../../api/tp')();
        var inquirer = require('inquirer');

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

        if(!tp){
            return utils.log.err('this command is only available if target process is configured.');
        }

        harvest.TimeTracking.daily({}, function (err, d) {
            if(err) return utils.log(err);
            var e = d.day_entries.sortByDesc('updated_at')[0];

            var entries = d.day_entries.filter(function (i) {
                return !i.finished;
            });
            var output = entries.map(function (i) {
                var us = i.tp_user_story;
                var task = i.tp_task;

                return {
                    hours:  i.hours.toFixed(2),
                    project: utils.summarize(i.project, 14),
                    type: utils.summarize(i.task, 14),
                    'user story': us ? utils.summarize(us.id + ': ' + us.name, 20) : '-',
                    task: task ? utils.summarize(task.id + ': ' + task.name, 20) : '-',
                    notes: utils.summarize(i.notes, 24) || '-'
                };
            }).tabularize();

            var choices = [];
            for (var i = 0; i < entries.length; i++) {
                choices.push({
                    value: entries[i].id,
                    name: output[i]
                });
            }

            if(choices.length === 0){
                utils.log();
                utils.log.chalk('gray', 'no unfinished time could be found.');
                utils.log();
                return;
            }

            var q = {
                type: 'list',
                name: 'time',
                choices: choices,
                message: 'Which time?'
            };

            inquirer.prompt(q, function (choice) {
                var e = entries.filter(function (i) {
                    return i.id === choice.time;
                })[0];

                if(!e) return utils.log.err('No timer could be found.');
                if(e.finished) return utils.log.err('This time is already marked as finished.');

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
        });
    }
};
