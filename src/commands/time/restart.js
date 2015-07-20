module.exports = {
    $t: true,
    help: {
        description: 'restart a timesheet',
        options: [{
            name: '-d, --date',
            description: 'date of the timesheet. e.g. 2015-07-01'
        },
        {
            name: '-o, --offset',
            description: 'date offset relative to today. e.g. 1 for yesterday'
        }]
    },
    _: function (t) {
        var utils = require('../../utils');
        var harvest = require('../../api/harvest')();
        var base = require('./_base');

        function restart(e) {
            var tp = base.createTpNote(e.tp_task, e.tp_user_story);
            base.createTime({
                tp: tp,
                notes: e.notes,
                hours: e.hours,
                project: e.project_id,
                task: e.task_id,
                s: true
            });
        }

        var d = t.d || t.date;
        var offset = +(t.o || t.offset);
        if (!d && offset) d = new Date().addDays(-offset);
        base.selectTime(d, null, function (selection) {
            restart(selection[0]);
        });

    }
};
