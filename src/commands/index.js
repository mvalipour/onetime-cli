require('./config');
require('./project');
require('./init');
require('./time');

var utils = require('../utils');
var cli = require('dastoor').builder;

var version = require('../../package.json').version;
var description = require('../../package.json').description;

var onetime = cli.node('onetime', {
    help: {
        description: [
            description,
            '',
            "                      .-.  _                ",
            "                     .' `.:_;               ",
            "     .--. ,-.,-. .--.`. .'.-.,-.,-.,-. .--. ",
            "    ' .; :: ,. :' '_.': : : :: ,. ,. :' '_.'",
            "    `.__.':_;:_;`.__.':_; :_;:_;:_;:_;`.__.'",
            '',
            '    version ' + version
        ].join('\n'),
        options: [{
            name: '-v, --version', description: 'show onetime version'
        }]
    },
    controller: function (args) {
        if(args.v || args.version){
            utils.log();
            utils.log.chalk('green', '>   ' + version);
            utils.log();
        }
        else return 'h';
    }
});

module.exports = onetime;
