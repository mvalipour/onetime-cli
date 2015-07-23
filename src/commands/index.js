require('./config');
require('./project');
require('./init');
require('./time');

module.exports = require('dastoor').builder
.node('onetime')
.help({
    description: 'manage harvest and target-proess in one place',
});
