require('./map');

function listController(t) {
    var utils = require('../../utils');
    var data = require('../../data');

    data.getHarvestProjects(function (err, projects) {
        if(err) return utils.log(err);

        var projection = projects;
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
