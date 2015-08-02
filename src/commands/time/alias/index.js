require('./list');
require('./add');
require('./remove');

require('dastoor').builder
    .node('onetime.time.alias')
    .help('manage your timesheet aliases');
