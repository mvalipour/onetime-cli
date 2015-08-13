var inquirer = require('inquirer');
var utils = require('../../utils');
var validation = require('../../utils/validation');
var harvest = require('../../api/harvest')();
var inquirer = require('inquirer');
var chalk = require('chalk');
var mappings = require('../../data/map');
var extend = require('extend');

function captureNewTime(args, tpClient, done) {
    harvest.TimeTracking.daily({ }, function (err, data) {
        if(err) return utils.log.err(err);

        var projects = data.projects.map(function (p) {
            return { name: p.name, value: p.id};
        });

        var tpTask;

        var tpq = {
            name: 'tp',
            validate: validation.number(false, function (i) {
                var done = this.async();
                tpClient.getTask(i)
                .then(function (task) {
                    tpTask = task;

                    // set project from mappings
                    mappings.get(tpTask.Project.Id, function (err, m) {
                        if(err) return done(err);
                        if(m) {
                            args.project = m.harvest.id;
                        }
                        done(true);
                    });
                }, function (err) {
                    done('An error occured while fetching task from target process.' + err);
                });
            }),
            message: 'Any target process task? (id without #)',
            when: !!tpClient && !args.tp,
            filter: function (i) {
                if(!i) return i;

                var task = { id: tpTask.Id, name: tpTask.Name };
                var us  = { id: tpTask.UserStory.Id, name: tpTask.UserStory.Name };
                return createTpNote(task, us);
            }
        };

        function qq() {
            return [
                {
                    type: 'list',
                    name: 'project',
                    choices: projects,
                    message: 'Which project?',
                    when: !args.project
                },
                {
                    type: 'list',
                    name: 'task',
                    choices: function (ctx) {
                        var p = data.projects.filter(function (p) {
                            return p.id === (ctx.project || args.project);
                        })[0];
                        if(!p) {
                            utils.log.err('Project could not be found!');
                            return process.exit(1);
                        }

                        return p.tasks.map(function (t) {
                            return { name: t.name, value: t.id };
                        });
                    },
                    message: 'What kind of task?',
                    when: !args.task
                },
                {
                    name: 'notes',
                    message: 'Notes:'
                }
            ];
        }

        inquirer.prompt([tpq], function (res1) {
            inquirer.prompt(qq(), function (res) {
                extend(res, res1);
                done(res);
            });
        });
    });
}

function createTpNote(task, us) {
    if(!task || !us) return '';
    return ['', '> user_story #' + us.id + ' ' + us.name,
    '> task #' + task.id + ' ' + task.name
].join('\n');
}

function selectTime(date, filter, done, all, autoSelectSingle) {
    var opts = {};
    if(date) opts.date = new Date(date);
    harvest.TimeTracking.daily(opts, function (err, d) {
        if(err) return utils.log(err);

        var entries = d.day_entries;
        if(filter) entries = entries.filter(filter);
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
            utils.log.chalk('gray', 'no timers could be found for: ' + chalk.cyan(d.for_day));
            utils.log();
            return;
        }

        if(all){
            done(entries);
        }
        else if(autoSelectSingle && entries.length === 1){
            utils.log.chalk('cyan', '❯ ' + output[0]);
            done(entries);
        }
        else {
            var q = {
                type: 'list',
                name: 'time',
                choices: choices,
                message: 'Which time?'
            };

            inquirer.prompt(q, function (choice) {
                done(entries.filter(function (i) {
                    return i.id === choice.time;
                }));
            });
        }
    });
}

function createTime(data) {
    var opts = {
        notes: data.tp + (data.notes ? '\n' + data.notes : ''),
        hours: data.hours || 0,
        project_id: data.project,
        task_id: data.task,
        spent_at: new Date()
    };

    function success() {
        utils.log.succ('Your time entry has been created.');
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

function captureTimeRemaining(hours, task, done) {

    var projected = (task.TimeRemain > hours ?
                    task.TimeRemain - hours : 0).toFixed(2);

    utils.log.chalk('green', '> User story: #', task.UserStory.Id, ':', task.UserStory.Name);
    utils.log.chalk('green', '> Task: #' + task.Id, ':', task.Name);
    utils.log.chalk('green', '> Projected remaining time:', projected);

    var q = {
        name: 'remaining',
        validate: validation.time(false),
        message: 'How many hours is remaining from this task?' ,
        filter: function (i) {
            var t = validation.convertTime(i);
            return t === 0 ? t : (t || projected);
        }
    };

    inquirer.prompt([q], function (res) {
        done(res.remaining);
    });

}

function captureHourAndConfirm(args, done) {
    function buildQuestions(args) {
        var hours = 0;
        return [
            {
                name: 'hours',
                validate: validation.time(false),
                message: 'How many hours have you already spent on it?',
                when: !hours,
                filter: function (i) {
                    return (hours = validation.convertTime(i) || 0);
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

    inquirer.prompt(buildQuestions(args), done);
}

module.exports = {
    validation: validation,
    captureNewTime: captureNewTime,
    selectTime: selectTime,
    createTime: createTime,
    createTpNote: createTpNote,
    captureHourAndConfirm: captureHourAndConfirm,
    captureTimeRemaining: captureTimeRemaining
};
