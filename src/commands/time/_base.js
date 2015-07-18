var inquirer = require('inquirer');
var utils = require('../../utils');
var validation = require('../../utils/validation');
var harvest = require('../../api/harvest')();

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

module.exports = {
    validation: validation,
    captureNewTime: captureNewTime
};
