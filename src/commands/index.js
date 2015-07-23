require('./config');

module.exports = require('dastoor').builder
.node('onetime')
.help({
    description: 'manage harvest and target-proess in one place',
});
