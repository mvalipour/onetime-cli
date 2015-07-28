function controller(t) {
    var utils = require('../../utils');
    var harvest = require('../../api/harvest')();
    var chalk = require('chalk');

    var opts = {};
    var d = t.d || t.date;
    var offset = +(t.o || t.offset);
    if(d) opts.date = new Date(d);
    else if (offset) opts.date = new Date().addDays(-offset);
    harvest.TimeTracking.daily(opts, function (err, d) {
        if(err) return utils.log.err(err);
        var t = 0;
        var output = d.day_entries.map(function (i) {
            t += i.hours;

            var icon;
            if(i.running) icon = String.fromCharCode(0x25B6);
            else if(i.finished) icon = String.fromCharCode(0x25A0);

            var elements = {
                hours:  (icon || ' ') + ' ' + i.hours.toFixed(2),
                project: utils.summarize(i.project, 14),
                type: utils.summarize(i.task, 14)
            };

            var us = i.tp_user_story;
            var task = i.tp_task;
            elements['user story'] = us ? utils.summarize(us.id + ': ' + us.name, 20) : '-';
            elements.task = task ? utils.summarize(task.id + ': ' + task.name, 20) : '-';
            elements.notes = utils.summarize(i.notes, 24) || '-';

            return elements;
        });

        var highlight = chalk.cyan;

        utils.log();
        if(output.length === 0){
            utils.log.chalk('gray', 'no timers could be found for: ' + highlight(d.for_day));
        }
        else {
            console.table('time logs for ' + highlight(d.for_day), output);
            utils.log(highlight(t.toFixed(2)));
        }
        utils.log();
    });
}

require('dastoor').builder
.node('onetime.time.list', {
    terminal: true,
    controller: controller
})
.help({
    description: 'list a day timesheet',
    options: [
        { name: '-d, --date', description: 'date of the timesheet. e.g. 2015-07-01' },
        { name: '-o, --offset', description: 'date offset relative to today. e.g. 1 for yesterday' }
    ]
});
