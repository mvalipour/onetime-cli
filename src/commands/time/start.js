module.exports = {
    $t: true,
    help: {
        description: 'start a timesheet',
        options: [
            {
                name: '-a, --alias',
                description: 'alias name to start the time with'
            }
        ]
    },
    _: function (args) {
        var extend = require('extend');
        var utils = require('../../utils');
        var inquirer = require('inquirer');
        var harvest = require('../../api/harvest')();
        var tpClient = require('../../api/tp')();
        var base = require('./_base');
        var aliasStore = require('./alias/_store');
        var validation = require('../../utils/validation');

        function buildOtherQuestions(args, data) {
            var hours = 0;
            return [
                {
                    name: 'hours',
                    validate: base.validation.float(false),
                    message: 'How may hours have you already spent on it?',
                    when: !hours,
                    filter: function (i) {
                        return (hours = i);
                    }
                },
                {
                    name: 's',
                    type: 'confirm',
                    message: 'Are you still doing this?',
                    when: function () {
                        return !args.s && hours;
                    }
                },
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: 'Are you happy with your selection?'
                }
            ];
        }

        function create(data) {
            var opts = {
                notes: data.tp + (data.notes ? '\n' + data.notes : ''),
                hours: data.hours || 0,
                project_id: data.project,
                task_id: data.task,
                spent_at: new Date()
            };

            function success() {
                utils.log('Your time entry has been created.');
            }

            harvest.TimeTracking.create(opts, function (err, res) {
                if(err) return utils.log.err(err);
                if(data.s && opts.hours){
                    harvest.TimeTracking.toggleTimer({ id: res.id }, function (err) {
                        if(err) return utils.log.err(err);
                        success();
                    });
                }
                else success();
            });
        }

        function start(args) {
            base.captureNewTime(args, tpClient, function (result) {
                inquirer.prompt(buildOtherQuestions(args, result), function (r2) {
                    var notes = [args.notes, result.notes].compact().join('\n');
                    extend(result, r2, args, { notes: notes });
                    if(!result.confirm) return;
                    console.log(result);
                    create(result);
                });
            });
        }

        var alias = args.a || args.alias;
        if(alias){
            aliasStore.get(alias, function (err, data) {
                if(err) return utils.log.err(err);

                extend(args, data);
                start(args);
            });
        }
        else {
            start(args);
        }
    }
};
