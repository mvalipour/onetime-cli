var command = require('../../utils/command');
module.exports = command.setup(function (m) {
    return require('./' + m);
});
