function controller(t) {
    var utils = require('../../utils');
    var harvest = require('../../api/harvest')();

    harvest.TimeTracking.daily({}, function (err, d) {
        if(err) utils.log(err);

        var projection = d.projects.select(['id', 'name']);
        console.table(projection);
    });
}

require('dastoor').builder
.terminal('onetime.project.list', controller)
.help({
    description: 'list harvest projects'
});
