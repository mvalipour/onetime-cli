require('./config');
require('./project');
require('./init');
require('./time');

var utils = require('../utils');
var cli = require('dastoor').builder;

var info = require('../../package.json');

var onetime = cli.node('onetime', {
    help: {
        description: [
            info.description,
            '',
            "                      .-.  _                ",
            "                     .' `.:_;               ",
            "     .--. ,-.,-. .--.`. .'.-.,-.,-.,-. .--. ",
            "    ' .; :: ,. :' '_.': : : :: ,. ,. :' '_.'",
            "    `.__.':_;:_;`.__.':_; :_;:_;:_;:_;`.__.'",
            '',
            '    version ' + info.version
        ].join('\n'),
        options: [{
            name: '-v, --version', description: 'show onetime version'
        }]
    },
    controller: function (args) {
        if(args.v || args.version){
            utils.log();
            utils.log.chalk('green', '>   ' + info.version);
            utils.log();
        }
        else return 'h';
    }
});

module.exports = onetime;
