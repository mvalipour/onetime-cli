function getHarvestProjects(done) {
    var harvest = require('../api/harvest')();
    harvest.TimeTracking.daily({}, function (err, d) {
        if(err) return done(err);
        return done(null, d.projects.select(['id', 'name']));
    });

}

function getTPProjects(done) {
    var client = require('../api/tp')();
    client.getProjects().then(function (res) {
        done(res.Items.select(['Id', 'Name']).map(function (i) {
            return { name: i.Name, id: i.Id };
        }));
    });
}

module.exports = {
    getHarvestProjects: getHarvestProjects,
    getTPProjects: getTPProjects
};
