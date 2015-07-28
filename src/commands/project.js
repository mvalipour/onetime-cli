function listController(t) {
    var utils = require('../utils');
    var harvest = require('../api/harvest')();

    harvest.TimeTracking.daily({}, function (err, d) {
        if(err) utils.log(err);

        var projection = d.projects.select(['id', 'name']);
        console.table(projection);
    });
}

var cli = require('dastoor').builder;

cli.node('onetime.project', {
    help: 'harvest projects'
});

cli.node('onetime.project.list', {
    terminal: true,
    controller: listController,
    help: 'list harvest projects'
});
