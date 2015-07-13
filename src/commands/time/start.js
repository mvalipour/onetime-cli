var extend = require('util')._extend;
var utils = require('../../utils');
var inquirer = require('inquirer');
var harvest = require('../../api/harvest')();
var tp = require('../../api/tp')();

function validateNumber(required, done) {
    return function (i) {
        if(!i && !required) return true;
        var res = /^\d+$/.test(i);
        if(!res) return 'Please enter a valid number.';
        return done ? done.call(this, i) : true;
    };
}

function validateFloat(required) {
    return function (i) {
        if(!i && !required) return true;
        return parseFloat(i) ? true : 'Please enter a valid number.';
    };
}

var buildFields = function (args, data) {
    var projects = data.projects.map(function (p) {
        return { name: p.name, value: p.id};
    });

    var tpTask,
        hours = args.hours;

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
                    return p.id === ctx.project;
                })[0];
                return p.tasks.map(function (t) {
                    return { name: t.name, value: t.id };
                });
            },
            message: 'What kind of task?',
            when: !args.task
        },
        {
            name: 'tp',
            validate: validateNumber(false, function (i) {
                var done = this.async();
                tp.getTask(i)
                .then(function (task) {
                    tpTask = task;
                    done(true);
                }, function (err) {
                    done('An error occured while fetching task from target process.' + err);
                });
            }),
            message: 'Any target process task?',
            when: !args.tp,
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
        },
        {
            name: 'hours',
            validate: validateFloat(false),
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
};

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

module.exports = {
    $t: true,
    _: function (args) {
        harvest.TimeTracking.daily({}, function (err, data) {
            if(err) return utils.log.err(err);
            inquirer.prompt(buildFields(args, data), function (result) {
                if(!result.confirm) return;
                create(extend(result, args));
            });
        });

    }
};
