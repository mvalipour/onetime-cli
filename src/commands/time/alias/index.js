require('./list');
require('./add');
require('./remove');

require('dastoor').builder
.node('onetime.time.alias')
.help({
    description: 'manage your timesheet aliases',
});
