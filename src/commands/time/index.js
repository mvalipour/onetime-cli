require('./list');
require('./start');
require('./pause');
require('./resume');
require('./finish');
require('./restart');
require('./alias');

require('dastoor').builder
.node('onetime.time')
.help({
    description: 'manage your timesheet',
});
