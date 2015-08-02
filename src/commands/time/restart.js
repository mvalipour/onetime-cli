function controller(t) {
    var utils = require('../../utils');
    var harvest = require('../../api/harvest')();
    var base = require('./_base');

    function restart(e, data) {
        var tp = base.createTpNote(e.tp_task, e.tp_user_story);
        base.createTime({
            tp: tp,
            notes: e.notes,
            hours: data.hours,
            project: e.project_id,
            task: e.task_id,
            s: data.s
        });
    }

    var d = t.d || t.date;
    var offset = +(t.o || t.offset);
    if (!d && offset) d = new Date().addDays(-offset);
    base.selectTime(d, null, function (selection) {
        base.captureHourAndConfirm(t, function (data) {
            restart(selection[0], data);
        });
    });

}

require('dastoor').builder
.node('onetime.time.restart', {
    terminal: true,
    controller: controller
})
.help({
    description: 'restart a timesheet',
    options: [{
        name: '-d, --date',
        description: 'date of the timesheet. e.g. 2015-07-01'
    },
    {
        name: '-o, --offset',
        description: 'date offset relative to today. e.g. 1 for yesterday'
    }]
});
