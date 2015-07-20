module.exports = {
    $t: true,
    help: {
        description: 'start a timesheet',
        options: [{
            name: '-p, --project',
            description: 'harvest project id'
        }, {
            name: '-tp',
            description: 'target process task id'
        }, {
            name: '-a, --alias',
            description: 'alias name to start the time with'
        }]
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

        function start(args) {
            if(args.p){
                args.project = args.p;
                delete args.p;
            }

            base.captureNewTime(args, tpClient, function (result) {
                inquirer.prompt(buildOtherQuestions(args, result), function (r2) {
                    var notes = [args.notes, result.notes].compact().join('\n');
                    extend(result, r2, args, { notes: notes });
                    if(!result.confirm) return;
                    base.createTime(result);
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
