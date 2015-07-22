var cli = require('dastoor').builder;

module.exports = cli.command('onetime.config.show')
.asTerminal()
.withHelp({
    description: 'show onetime configurations'
})
.withAction(function () {
    var utils = require('../../utils');
    var config = require('../../config');
    var props = ['domain', 'email'];

    function showDomain(name, key) {
        var settings = config.readDomain(key, props);
        if(!settings) return;

        utils.log();
        utils.log('    ' + name);
        props.forEach(function (p) {
            utils.log('      ' + utils.pad(p, 10) + settings[p]);
        });
        utils.log();
    }

    showDomain('Harvest', 'harvest');
    showDomain('Target Process', 'tp');
});
