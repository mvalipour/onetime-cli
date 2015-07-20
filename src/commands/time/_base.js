var inquirer = require('inquirer');
var utils = require('../../utils');
var validation = require('../../utils/validation');
var harvest = require('../../api/harvest')();
var inquirer = require('inquirer');

function captureNewTime(args, tpClient, done) {
    var buildQuestions = function (args, data) {
        var projects = data.projects.map(function (p) {
            return { name: p.name, value: p.id};
        });

        var tpTask;

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
                name: 'tp',
                validate: validation.number(false, function (i) {
                    var done = this.async();
                    tpClient.getTask(i)
                    .then(function (task) {
                        tpTask = task;
                        done(true);
                    }, function (err) {
                        done('An error occured while fetching task from target process.' + err);
                    });
                }),
                message: 'Any target process task?',
                when: !!tpClient && !args.tp,
                filter: function (i) {
                    if(!i) return i;
                    return ['', '> user_story #' + tpTask.UserStory.Id + ' ' + tpTask.UserStory.Name,
                    '> task #' + tpTask.Id + ' ' + tpTask.Name
                ].join('\n');
                }
            },
            {
                name: 'notes',
                message: 'Notes:'
            }
        ];
    };

    harvest.TimeTracking.daily({ }, function (err, data) {
        if(err) return utils.log.err(err);
        inquirer.prompt(buildQuestions(args, data), done);
    });
}

function selectTime(date, filter, done, all) {
    var opts = {};
    if(date) opts.date = new Date(date);
    harvest.TimeTracking.daily(opts, function (err, d) {
        if(err) return utils.log(err);

        var entries = d.day_entries.filter(filter);
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
            return done();
        }

        if(all){
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

module.exports = {
    validation: validation,
    captureNewTime: captureNewTime,
    selectTime: selectTime
};
