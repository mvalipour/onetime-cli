require('./show');
require('./clear');

require('dastoor').builder
.node('onetime.config')
.help({
    description: 'manage onetime configuration',
});
