module.exports = {
    $t: true,
    help: {
        description: 'continue a timesheet'
    },
    _: function (t) {
        var utils = require('../../utils');
        var harvest = require('../../api/harvest')();

        harvest.TimeTracking.daily({}, function (err, d) {
            if(err) utils.log(err);
            var e = d.day_entries.sortByDesc('updated_at')[0];
            if(!e) return utils.log.chalk('red', 'No timer could be found.');

            console.log('//TODO: print entry');
            harvest.TimeTracking.toggleTimer({ id: e.id }, function (err) {
                if(err) return utils.log.err(err);
                utils.log('Your timer is running again.');
            });
        });
    }
};
